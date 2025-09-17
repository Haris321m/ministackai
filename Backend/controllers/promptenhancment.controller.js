import openrouterUse from "../utils/openrouter.utils.js";

async function promptenhancement(req, res) {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const modelName = "openai/gpt-4o-mini";

    const input = messages
    
    const modelResponse = await openrouterUse(modelName, input);

    console.log(modelResponse)
    
    return res.status(200).json({
      success: true,
      model: modelName,
      message: modelResponse,
    });
  } catch (error) {
    console.error("Prompt enhancement error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to enhance prompt",
      details: error.message || error,
    });
  }
}

export default promptenhancement;
