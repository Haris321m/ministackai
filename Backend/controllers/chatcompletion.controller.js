// src/controllers/createChatCompletion.controller.js

import chatController from './chat.controller.js';
import modelUse from '../utils/modelconfig.utils.js';
import usagelogscontroller from './usagelogs.controller.js';
import openrouterUse from '../utils/openrouter.utils.js';
import models from '../models/models.model.js';
import { getSummary, upsertSummary } from './conversationSummary.controller.js';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Helper: send SSE error (or fallback to JSON)
 */
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
      console.warn("Failed to send SSE error, falling back to JSON:", e.message);
    }
  }

  if (!res.headersSent) {
    res.status(403).json({ error: message, ...extra });
  } else {
    try { res.end(); } catch {}
  }
}

/**
 * Helper: check user quota (text/image) using Prisma
 */
async function checkUserQuota(userId, type) {
  const uid = Number(userId);
  const userPlan = await prisma.userPlans.findFirst({
    where: { UserId: uid, Status: "active" },
    orderBy: { CreatedAt: "desc" },
    include: { Plans: true },
  });

  if (!userPlan || !userPlan.Plans) {
    throw new Error("No active plan found. Please subscribe to a plan.");
  }

  const plan = userPlan.Plans;
  const usage = await prisma.usageLogs.aggregate({
    where: { UserId: uid },
    _sum: { TokensUsed: true, ImagesGenerated: true },
  });

  const totalTokens = usage._sum?.TokensUsed ?? 0;
  const totalImages = usage._sum?.ImagesGenerated ?? 0;

  const usageType = type === "image" ? "image" : "text";

  if (usageType === "text" && plan.TokensLimit != null && totalTokens >= plan.TokensLimit) {
    throw new Error("Token limit reached for your plan. Please upgrade.");
  }
  if (usageType === "image" && plan.ImagesLimit != null && totalImages >= plan.ImagesLimit) {
    throw new Error("Image limit reached for your plan. Please upgrade.");
  }

  return { totalTokens, totalImages, TokensLimit: plan.TokensLimit, ImagesLimit: plan.ImagesLimit };
}

/**
 * Main handler (Express style)
 * Accepts body with:
 *  - userId (number)
 *  - modelid (array of numbers) OR modelIds (array)
 *  - messages (array)  (for text)
 *  - prompt (string)   (for image and optionally text)
 *  - type ('image' | 'chat' | 'enhance' etc.)
 *  - size (optional image size)
 *  - conversationId (optional)
 *  - chatname (optional)
 */
async function createChatCompletion(req, res) {
  try {
    // normalize incoming names - frontend uses 'modelid'
    const {
      userId,
      modelid,
      modelIds,
      messages,
      prompt,
      type,
      size,
      conversationId,
      chatname
    } = req.body || {};

    const modelIdsFinal = Array.isArray(modelid) ? modelid : Array.isArray(modelIds) ? modelIds : null;

    if (!userId || !Array.isArray(modelIdsFinal) || modelIdsFinal.length === 0) {
      return res.status(400).json({ error: "Invalid input: userId and modelid (array) are required." });
    }

    // initial quota check (global before opening SSE)
    try {
      const usageType = type === "image" ? "image" : "text";
      await checkUserQuota(userId, usageType);
    } catch (quotaError) {
      return sendQuotaErrorResponse(req, res, quotaError.message);
    }

    // Open SSE (front-end expects SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // helper to save chat + usage
    const saveReply = async (model, modelResponse, modelId, userInput) => {
      // map to DB column names (PascalCase) used in Prisma
      const chatData = {
        UserId: Number(userId),
        ModelId: Number(modelId),
        ConversationId: conversationId || null,
        ChatName: chatname || "New Conversation",
        UserQuestion: userInput,
        BotAnswer: modelResponse?.BotAnswer || "",
        BotImages: modelResponse?.BotImages || null,
      };
      if (chatData.BotImages) chatData.ImagesGenerated = 1;

      try {
        // ensure chatController.createChatData writes fields matching DB (PascalCase)
        await chatController.createChatData(chatData);
      } catch (err) {
        console.error(`Save chat error for ${model?.Name || modelId}:`, err?.message || err);
      }

      try {
        const usage = {
          UserId: Number(userId),
          ModelId: Number(modelId),
          TokensUsed: modelResponse?.usage?.total_tokens || 0,
          ImagesGenerated: chatData.ImagesGenerated || 0,
        };
        await usagelogscontroller.upsertUsageLog(usage);
      } catch (err) {
        console.warn(`Usage log error for ${model?.Name || modelId}:`, err?.message || err);
      }

      return {
        model: model?.Name || `model-${modelId}`,
        message: {
          query: userInput,
          reply: chatData.BotAnswer,
          image: chatData.BotImages,
          isNew: true,
        },
      };
    };

    // iterate models
    for (const rawModelId of modelIdsFinal) {
      // defensive number parsing
      const mId = Number(rawModelId);
      if (!Number.isFinite(mId)) {
        // send model-level error but continue to next model
        try {
          res.write(`event: error\n`);
          res.write(`data: ${JSON.stringify({ modelId: rawModelId, error: "Invalid model id" })}\n\n`);
        } catch {}
        continue;
      }

      try {
        const modelArr = await models.getModelById(mId);
        if (!modelArr?.[0]) {
          // model not found
          try {
            res.write(`event: error\n`);
            res.write(`data: ${JSON.stringify({ modelId: mId, error: "Model not found" })}\n\n`);
          } catch {}
          continue;
        }
        const model = modelArr[0];

        const willBeImage = (type === "image") || model.Type === "image generation";
        const usageTypeForThisModel = willBeImage ? "image" : "text";

        // per-model quota check
        try {
          await checkUserQuota(userId, usageTypeForThisModel);
        } catch (quotaError) {
          // send SSE error and stop further processing (respect your previous behavior)
          sendQuotaErrorResponse(req, res, quotaError.message, { modelId: mId });
          return;
        }

        // Build messages / payload
        let modelResponse = null;
        if (model.Provider === "openai" && model.Type === "image generation") {
          // image call via modelUse (your util)
          modelResponse = await modelUse(model.Name, [{ prompt, size }]);
        } else {
          // fetch model-specific summary (getSummary expects conversationId and modelId)
          let systemSummary = null;
          if (conversationId) {
            try {
              // call your controller which should accept (conversationId, modelId)
              const rec = await getSummary(conversationId, userId,mId);
              systemSummary = rec?.Summary || null;
            } catch (e) {
              // If getSummary throws, log and continue without summary
              console.warn("getSummary error:", e?.message || e);
              systemSummary = null;
            }
          }

          // prepare messages array for openrouterUse
          const baseMessages = Array.isArray(messages) ? messages.map(m => ({ role: m.role, content: m.content })) : [];
          const finalMessages = willBeImage
            ? [{ prompt, type, size }]
            : (systemSummary ? [{ role: "system", content: "Conversation Summary: " + systemSummary }, ...baseMessages] : baseMessages);

          modelResponse = await openrouterUse(model.Name, finalMessages);
        }

        const userInput = willBeImage ? prompt : (messages?.[messages.length - 1]?.content || "");
        const reply = await saveReply(model, modelResponse, mId, userInput);

        // stream reply back via SSE
        try {
          res.write(`event: reply\n`);
          res.write(`data: ${JSON.stringify(reply)}\n\n`);
        } catch (e) {
          console.warn("Failed to write SSE reply:", e?.message || e);
        }

        // Update per-model summary asynchronously (do not await)
        if (conversationId && !willBeImage) {
          (async () => {
            try {
              // Prefer chatController.getMessagesByConversation(conversationId, mId) if it supports model filter
              let allMessages = null;
              try {
                allMessages = await chatController.getMessagesByConversation(conversationId, mId);
              } catch (err) {
                // fallback to unfiltered and then filter in JS
                allMessages = await chatController.getMessagesByConversation(conversationId);
                if (Array.isArray(allMessages)) {
                  allMessages = allMessages.filter(msg => Number(msg.CurrentModelId) === Number(mId));
                }
              }

              const formattedMessages = [];
              (Array.isArray(allMessages) ? allMessages : []).forEach((m) => {
                if (m.UserQuestion) formattedMessages.push({ role: "user", content: m.UserQuestion });
                if (m.BotAnswer) formattedMessages.push({ role: "assistant", content: m.BotAnswer });
              });

              if (formattedMessages.length === 0) return;

              const summaryResp = await openrouterUse("gpt-4o-mini", [
                { role: "system", content: "Summarize this conversation concisely:" },
                ...formattedMessages,
              ]);

              const newSummary = summaryResp?.BotAnswer || "";
              if (newSummary) {
                await upsertSummary(conversationId, Number(userId), mId, newSummary);
              }
            } catch (err) {
              console.error("Error generating/updating model-specific summary:", err?.message || err);
            }
          })();
        }
      } catch (err) {
        console.error(`Error with model ${mId}:`, err?.message || err);
        try {
          res.write(`event: error\n`);
          res.write(`data: ${JSON.stringify({ modelId: mId, error: err?.message || err })}\n\n`);
        } catch {}
      }
    } // end for modelIds

    // finish SSE
    try {
      res.write("event: end\n");
      res.write("data: done\n\n");
      res.end();
    } catch (e) {
      // ignore
    }
  } catch (error) {
    console.error("Unexpected error in createChatCompletion:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to create chat completion", details: (error?.message || error) });
    } else {
      try {
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify({ error: "Unexpected server error", details: (error?.message || error) })}\n\n`);
        res.write("event: end\n");
        res.write("data: done\n\n");
        res.end();
      } catch {}
    }
  }
}

export default createChatCompletion;
