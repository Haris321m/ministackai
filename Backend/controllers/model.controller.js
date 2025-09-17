import Models from "../models/models.model.js";

function createModel(req, res) {
    const data = req.body;
    Models.createModel(data)
        .then((model) => {
            res.status(201).json(model);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to create model', details: error.message });
        }
    );
}
function getModelById(req, res) {
    const id = parseInt(req.params.id, 10);
    Models.getModelById(id)
        .then((model) => {
            if (model) {
                res.status(200).json(model);
            } else {
                res.status(404).json({ error: 'Model not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve model', details: error.message });
        });
}
function getAllModels(req, res) {
    Models.getAllModels()
        .then((models) => {
            res.status(200).json(models);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve models', details: error.message });
        }
    );
}
function updateModel(req, res) {
    const id = parseInt(req.params.id, 10);
    const data = req.body;
    Models.updateModel(id, data)
        .then((model) => {
            if (model) {
                res.status(200).json(model);
            } else {
                res.status(404).json({ error: 'Model not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to update model', details: error.message });
        });
}

function deleteModel(req, res) {
    const id = parseInt(req.params.id, 10);
    Models.deleteModel(id)
        .then((model) => {
            if (model) {
                res.status(200).json({ message: 'Model deleted successfully' });
            } else {
                res.status(404).json({ error: 'Model not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to delete model', details: error.message });
        });
}

export default {
    createModel,
    getModelById,
    getAllModels,
    updateModel,
    deleteModel
};