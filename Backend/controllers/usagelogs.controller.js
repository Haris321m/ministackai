// controllers/usageLogs.controller.js
import UsageLogsModel from "../models/usagelogs.model.js";

// ------------------------
// CREATE or UPSERT usage log
// ------------------------
async function upsertUsageLog({ userId, mId, TokensUsed,ImagesGenerated}) {
  try {

    // Check if a log already exists
    const existingLog = await UsageLogsModel.findOne({ userId, mId });

    if (existingLog) {
      // Increment token count
      const updatedLog = await UsageLogsModel.updateUsageLog(existingLog.Id, {
        tokensUsed: Number(existingLog.TokensUsed + Number(TokensUsed)),
        ImagesGenerated : Number(existingLog.ImagesGenerated + Number(ImagesGenerated))
      });
      return updatedLog;
    } else {
      // Create a new usage log
      const newLog = await UsageLogsModel.createUsageLog({ userId, mId, TokensUsed ,ImagesGenerated});
      return newLog;
    }
  } catch (err) {
    console.error("Failed to upsert usage log:", err.message);
    throw err;
  }
}

// Express route to handle upsert via API
async function handleUpsertUsageLog(req, res) {
  try {
    const { userId, modelId, tokensUsed } = req.body;
    if (!userId || !modelId || tokensUsed == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const log = await upsertUsageLog({ userId, modelId, tokensUsed });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: "Failed to create/update usage log", details: err.message });
  }
}

// ------------------------
// GET a single usage log
// ------------------------
async function getUsageLogById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const usageLog = await UsageLogsModel.getUsageLogById(id);
    if (!usageLog) {
      return res.status(404).json({ error: "Usage log not found" });
    }
    res.status(200).json(usageLog);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve usage log", details: err.message });
  }
}

// ------------------------
// GET all usage logs
// ------------------------
async function getAllUsageLogs(req, res) {
  try {
    const usageLogs = await UsageLogsModel.getAllUsageLogs();
    res.status(200).json(usageLogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve usage logs", details: err.message });
  }
}

// ------------------------
// UPDATE usage log
// ------------------------
async function updateUsageLog(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body;
    const updatedLog = await UsageLogsModel.updateUsageLog(id, data);
    if (!updatedLog) {
      return res.status(404).json({ error: "Usage log not found" });
    }
    res.status(200).json(updatedLog);
  } catch (err) {
    res.status(500).json({ error: "Failed to update usage log", details: err.message });
  }
}

// ------------------------
// DELETE usage log
// ------------------------
async function deleteUsageLog(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const deletedLog = await UsageLogsModel.deleteUsageLog(id);
    if (!deletedLog) {
      return res.status(404).json({ error: "Usage log not found" });
    }
    res.status(200).json({ message: "Usage log deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete usage log", details: err.message });
  }
}



export default {
  handleUpsertUsageLog,
  getUsageLogById,
  getAllUsageLogs,
  updateUsageLog,
  deleteUsageLog,
  upsertUsageLog,
};
