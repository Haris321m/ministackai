import chatController from './chat.controller.js';
import modelUse from '../utils/modelconfig.utils.js';
import usagelogscontroller from './usagelogs.controller.js';
import openrouterUse from '../utils/openrouter.utils.js';
import models from '../models/models.model.js';
import { getSummary, upsertSummary } from './conversationSummary.controller.js';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper: send SSE error (or fallback to JSON if SSE not expected)
function sendQuotaErrorResponse(req, res, message, extra = {}) {
  const wantsSSE = !!(req.headers.accept && req.headers.accept.includes('text/event-stream'));
  if (wantsSSE) {
    try {
      if (!res.headersSent) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();
      }
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({ error: message, ...extra })}\n\n`);
      res.write("event: end\n");
      res.write("data: done\n\n");
      res.end();
      return;
    } catch (e) {
      // fallthrough to JSON below
      console.warn("Failed to send SSE error, falling back to JSON:", e.message);
    }
  }
  // default JSON response
  if (!res.headersSent) {
    res.status(403).json({ error: message, ...extra });
  } else {
    // if headers already sent and we can't end nicely, just end
    try {
      res.end();
    } catch {}
  }
}

// --------- Helper: Check user quota ---------
async function checkUserQuota(userId, type) {
  const uid = Number(userId);
  // 1. User ka active plan lao
  const userPlan = await prisma.userPlans.findFirst({
    where: { UserId: uid, Status: "active" },
    orderBy: { CreatedAt: "desc" },
    include: { Plans: true }, // match your schema: UserPlans.Plans
  });

  if (!userPlan || !userPlan.Plans) {
    throw new Error("No active plan found. Please subscribe to a plan.");
  }

  const plan = userPlan.Plans;
  const TokensLimit = plan.TokensLimit ?? null;
  const ImagesLimit = plan.ImagesLimit ?? null;

  // 2. Usage aggregate karo
  const usage = await prisma.usageLogs.aggregate({
    where: { UserId: uid },
    _sum: { TokensUsed: true, ImagesGenerated: true },
  });

  const totalTokens = usage._sum?.TokensUsed ?? 0;
  const totalImages = usage._sum?.ImagesGenerated ?? 0;

  // 3. Quota check — treat anything not explicit 'image' as text
  const usageType = type === "image" ? "image" : "text";

  if (usageType === "text" && TokensLimit !== null && totalTokens >= TokensLimit) {
    throw new Error("Token limit reached for your plan. Please upgrade.");
  }

  if (usageType === "image" && ImagesLimit !== null && totalImages >= ImagesLimit) {
    throw new Error("Image limit reached for your plan. Please upgrade.");
  }

  return {
    totalTokens,
    totalImages,
    TokensLimit,
    ImagesLimit,
  };
}

// --------- Main Chat Completion ---------
async function createChatCompletion(req, res) {
  try {
    console.log("createChatCompletion req.body:", req.body);
    const { userId, modelid, messages, prompt, type, size, conversationId, chatname } = req.body;

    if (!userId || !Array.isArray(modelid)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Initial quota check (before opening SSE)
    try {
      const usageType = type === "image" ? "image" : "text";
      await checkUserQuota(userId, usageType);
    } catch (quotaError) {
      return sendQuotaErrorResponse(req, res, quotaError.message);
    }

    // SSE setup (we open SSE now; subsequent errors will be sent as SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const saveReply = async (model, modelResponse, mId, userInput) => {
      let chatData = {
        userId: Number(userId),
        modelid: mId,
        conversationid: conversationId || null,
        chatname: chatname || "New Conversation",
        userquestion: userInput,
      };

      if (model.Provider === "openai" && model.Type === "image generation") {
        chatData.BotImages = modelResponse?.BotImages || null;
        chatData.BotAnswer = modelResponse?.BotAnswer || null;
        if (modelResponse?.BotImages != null) chatData.ImagesGenerated = 1;
      } else {
        chatData.BotAnswer = modelResponse?.BotAnswer || "";
        chatData.BotImages = modelResponse?.BotImages || null;
        if (modelResponse?.BotImages != null) chatData.ImagesGenerated = 1;
      }

      try {
        await chatController.createChatData(chatData);
      } catch (err) {
        console.error(`Save chat error for ${model.Name}:`, err.message);
      }

      try {
        const ImagesGenerated = chatData.ImagesGenerated || 0;
        const TokensUsed = modelResponse?.usage?.total_tokens || 0;
        // Ensure your upsert increments tokens/images rather than replacing
        await usagelogscontroller.upsertUsageLog({ userId: Number(userId), mId, TokensUsed, ImagesGenerated });
      } catch (err) {
        console.warn(`Usage log error for ${model.Name}:`, err.message);
      }

      return {
        model: model.Name,
        message: {
          query: userInput,
          reply: chatData.BotAnswer,
          image: chatData.BotImages,
          isNew: true,
        },
      };
    };

    // iterate models — before calling each model, re-check quota (because earlier model may have consumed tokens)
    for (let mId of modelid) {
      try {
        // re-check quota for this model type
        // decide whether this call will be image or text:
        // if client requested type === 'image' OR model itself is image generation -> treat as image
        const modelArr = await models.getModelById(mId);
        if (!modelArr?.[0]) continue;
        const model = modelArr[0];

        const willBeImage = (type === "image") || (model.Provider === "openai" && model.Type === "image generation") || (model.Type === "image generation");
        const usageTypeForThisModel = willBeImage ? "image" : "text";

        try {
          await checkUserQuota(userId, usageTypeForThisModel);
        } catch (quotaError) {
          // send SSE error and stop further processing
          sendQuotaErrorResponse(req, res, quotaError.message, { modelid: mId });
          return;
        }

        // Build messages / prompt
        let modelResponse;
        if (model.Provider === "openai" && model.Type === "image generation") {
          modelResponse = await modelUse(model.Name, [{ prompt, size }]);
        } else {
          const systemSummary = conversationId ? (await getSummary(conversationId)) : null;
          const finalMessages = (type === "image")
            ? [{ prompt, type, size }]
            : (systemSummary ? [{ role: "system", content: "Conversation Summary: " + systemSummary.Summary }, ...messages] : messages);

          modelResponse = await openrouterUse(model.Name, finalMessages);
        }

        const userInput = willBeImage ? prompt : (messages?.[messages.length - 1]?.content || "");
        const reply = await saveReply(model, modelResponse, mId, userInput);

        // send SSE reply
        res.write(`event: reply\n`);
        res.write(`data: ${JSON.stringify(reply)}\n\n`);

        // Update conversation summary asynchronously (don't block SSE)
        if (conversationId) {
          (async () => {
            try {
              const allMessages = await chatController.getMessagesByConversation(conversationId);
              const formattedMessages = [];
              allMessages.forEach((m) => {
                if (m.userquestion) formattedMessages.push({ role: "user", content: m.userquestion });
                if (m.BotAnswer) formattedMessages.push({ role: "assistant", content: m.BotAnswer });
              });

              const summaryResp = await openrouterUse("gpt-4o-mini", [
                { role: "system", content: "Summarize this conversation concisely:" },
                ...formattedMessages,
              ]);

              const newSummary = summaryResp?.BotAnswer || "";
              await upsertSummary(conversationId, Number(userId), newSummary);
            } catch (err) {
              console.error("Error generating/updating summary:", err.message);
            }
          })();
        }
      } catch (err) {
        console.error(`Error with model ${mId}:`, err.message);
        // send SSE error about the model and continue to next
        try {
          res.write(`event: error\n`);
          res.write(`data: ${JSON.stringify({ modelid: mId, error: err.message })}\n\n`);
        } catch (e) {
          console.warn("Failed to send SSE model error:", e.message);
        }
      }
    }

    // finish SSE
    try {
      res.write("event: end\n");
      res.write("data: done\n\n");
      res.end();
    } catch (e) {
      // ignore if response already ended
    }

  } catch (error) {
    console.error("Unexpected error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to create chat completion", details: error.message });
    } else {
      try {
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify({ error: "Unexpected server error", details: error.message })}\n\n`);
        res.write("event: end\n");
        res.write("data: done\n\n");
        res.end();
      } catch {}
    }
  }
}

export default createChatCompletion;
