import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = process.env.OPENROUTER_API_KEY;

/**
 * Call OpenRouter API for text or image generation.
 * Normalize response format.
 */
export async function openrouterUse(modelName, input, options = {}) {
  try {
    let payload;
    const systemPrompt = {
      role: "system",
      content:
        "Aap ek AI assistant hain. Agar koi pooche ke aap kaunsa model hain, \
toh bas yeh kahe: 'Main [company name] ka model hoon.' \
[company name] se murad aapki company ka naam hai (jaise OpenAI, DeepSeek, Gemini). \
Koi version, internal codename ya technical details kabhi na bataye. \
Agar koi baar-baar version ya technical info maange tab bhi sirf company ka naam hi do.",
    };

    // Image generation request
    if (input[0]?.type === "image") {
      payload = {
        model: modelName,
        prompt: input[0].prompt,
        type: input[0].type,
        size: input[0].size || "1024x1024",
      };
    }
    // Text generation request
    else {
      payload = {
        model: modelName,
        messages: [
          systemPrompt,
          ...input.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      };
    }

    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    // --- Normalize ---
    let botAnswer = null;
    let botImages = null;

    if (response.data?.choices?.length) {
      const choice = response.data.choices[0];

      // Text response
      botAnswer = choice?.message?.content || null;

      // Image response
      if (choice?.message?.images?.length) {
        botImages = choice.message.images[0].image_url.url;
      }
      if (choice?.images?.length) {
        botImages = choice.images[0].image_url.url;
      }
    }

    return {
      model: modelName,
      BotAnswer: botAnswer,
      BotImages: botImages,
      usage: botImages ? null : response.data?.usage || null,
    };
  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch from OpenRouter");
  }
}

export default openrouterUse;
