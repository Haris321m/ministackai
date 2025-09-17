import axios from "axios";

const API_URL = 'https://api.openai.com/v1/images/generations';
const API_KEY = process.env.OPENAI_API_KEY;

/**
 * Generate image using OpenAI DALL·E, normalized response
 */
async function modelUse(modelName, input) {
  try {

    if (!modelName || !Array.isArray(input) || !input[0]?.prompt) {
      throw new Error("Model name and prompt are required");
    }

    const payload = {
      model: modelName,
      prompt: input[0].prompt,
      size: input[0].size || "1024x1024",
    };

    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    console.log(response.data)
    const imageUrl = response.data?.data?.[0]?.url || null;
    const revised_prompt = response.data?.data?.[0]?.revised_prompt || null;

    return {
  model: modelName,
  BotAnswer: revised_prompt,
  BotImages: imageUrl,
  usage: null
};
  } catch (error) {
    console.error("OpenAI DALL·E Error:", error.response?.data || error.message);
    throw new Error("Failed to generate image from OpenAI");
  }
}

export default modelUse;
