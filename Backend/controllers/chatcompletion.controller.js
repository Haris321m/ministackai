import chatController from './chat.controller.js';
import modelUse from '../utils/modelconfig.utils.js'; 
import usagelogscontroller from './usagelogs.controller.js';
import openrouterUse from '../utils/openrouter.utils.js'; 
import models from '../models/models.model.js';
import { getSummary, upsertSummary } from './conversationSummary.controller.js';

async function createChatCompletion(req, res) {
  try {
    const { userId, modelid, messages, prompt, type, size, conversationId, chatname } = req.body;

    if (!userId || !Array.isArray(modelid)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const saveReply = async (model, modelResponse, mId, userInput) => {
      let chatData = {
        userId,
        modelid: mId,
        conversationid: conversationId || null,
        chatname: chatname || "New Conversation",
        userquestion: userInput,
      };

      if (model.Provider === "openai" && model.Type === "image generation") {
        chatData.BotImages = modelResponse?.BotImages || null;
        chatData.BotAnswer = modelResponse?.BotAnswer || null;
        if (modelResponse.BotImages != null) chatData.ImagesGenerated = 1;
      } else {
        chatData.BotAnswer = modelResponse.BotAnswer || "";
        chatData.BotImages = modelResponse.BotImages;
        if (modelResponse.BotImages != null) chatData.ImagesGenerated = 1;
      }

      try {
        await chatController.createChatData(chatData);
      } catch (err) {
        console.error(`Save chat error for ${model.Name}:`, err.message);
      }

      try {
        const ImagesGenerated = chatData.ImagesGenerated;
        const TokensUsed = modelResponse?.usage?.total_tokens || 0;
        await usagelogscontroller.upsertUsageLog({ userId, mId, TokensUsed, ImagesGenerated });
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

    for (let mId of modelid) {
      try {
        const modelArr = await models.getModelById(mId);
        if (!modelArr?.[0]) continue;
        const model = modelArr[0];

       
        let systemSummary = null;
        if (conversationId) {
          const prevSummary = await getSummary(conversationId);
          if (prevSummary) {
            systemSummary = { role: "system", content: "Conversation Summary: " + prevSummary.Summary };
          }
        }

        
        let modelResponse;
        if (model.Provider === "openai" && model.Type === "image generation") {
          modelResponse = await modelUse(model.Name, [{ prompt, size }]);
        } else {
          const finalMessages = type === "image" 
            ? [{ prompt, type, size }] 
            : systemSummary 
              ? [systemSummary, ...messages] 
              : messages;

          modelResponse = await openrouterUse(model.Name, finalMessages);
        }

        const userInput = type === "image" ? prompt : messages?.[messages.length - 1]?.content || "";
        const reply = await saveReply(model, modelResponse, mId, userInput);

        console.log(reply)
        res.write(`event: reply\n`);
        res.write(`data: ${JSON.stringify(reply)}\n\n`);

        
        if (conversationId) {
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
            await upsertSummary(conversationId, userId, newSummary);
          } catch (err) {
            console.error("Error generating/updating summary:", err.message);
          }
        }

      } catch (err) {
        console.error(`Error with model ${mId}:`, err.message);
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify({ modelid: mId, error: err.message })}\n\n`);
      }
    }

    res.write("event: end\n");
    res.write("data: done\n\n");
    res.end();

  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Failed to create chat completion", details: error.message });
  }
}

export default createChatCompletion;
