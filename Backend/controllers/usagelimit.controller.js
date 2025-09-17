import UsageLimitModel from "../models/usagelimit.model.js";


function createUsageLimit(req, res) {
    const data = req.body;
    UsageLimitModel.createUsageLimit(data)
        .then((newUL) => {
            res.status(201).json(newUL);
        }
        ).catch((error) => {
            res.status(500).json({ error: 'Failed to create usage limit', details: error.message });
        });
}

function getUsageLimitById(req, res) {
    const id = parseInt(req.params.id, 10);
    UsageLimitModel.getUsageLimitById(id)
        .then((usageLimit) => {
            if (usageLimit) {
                res.status(200).json(usageLimit);
            } else {
                res.status(404).json({ error: 'Usage limit not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve usage limit', details: error.message });
        });
}

function getAllUsageLimits(req, res) {
    UsageLimitModel.getAllUsageLimits()
        .then((usageLimits) => {
            res.status(200).json(usageLimits);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve usage limits', details: error.message });
        });
}
function updateUsageLimit(req, res) {
    const id = parseInt(req.params.id, 10);
    const data = req.body;
    UsageLimitModel.updateUsageLimit(id, data)
        .then((usageLimit) => {
            if (usageLimit) {
                res.status(200).json(usageLimit);
            } else {
                res.status(404).json({ error: 'Usage limit not found' });
            }
        }
        ).catch((error) => {
            res.status(500).json({ error: 'Failed to update usage limit', details: error.message });
        }
    );
}
function deleteUsageLimit(req, res) {
    const id = parseInt(req.params.id, 10);
    UsageLimitModel.deleteUsageLimit(id)
        .then((usageLimit) => {
            if (usageLimit) {
                res.status(200).json({ message: 'Usage limit deleted successfully' });
            } else {
                res.status(404).json({ error: 'Usage limit not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to delete usage limit', details: error.message });
        });
}

export default {
    createUsageLimit,
    getUsageLimitById,
    getAllUsageLimits,
    updateUsageLimit,
    deleteUsageLimit
};