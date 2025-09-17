import PlanModel from "../models/plan.model.js";


function createPlan(req, res) {
    const data = req.body;
    PlanModel.createPlan(data)
        .then((newP) => {
            res.status(201).json(newP);
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: 'Failed to create plan', details: error.message });
        }); 
}

function getPlanById(req, res) {
    const id = parseInt(req.params.id, 10);
    PlanModel.getPlanById(id)
        .then((plan) => {
            if (plan) {
                res.status(200).json(plan);
            } else {
                res.status(404).json({ error: 'Plan not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve plan', details: error.message });
        });
}
function getAllPlans(req, res) {
    PlanModel.getAllPlans()
        .then((plans) => {
            res.status(200).json(plans);
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: 'Failed to retrieve plans', details: error.message });
        });
}

function updatePlan(req, res) {
    const id = parseInt(req.params.id, 10);
    const data = req.body;
    PlanModel.updatePlan(id, data)
        .then((plan) => {
            if (plan) {
                res.status(200).json(plan);
            } else {
                res.status(404).json({ error: 'Plan not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to update plan', details: error.message });
        });
}

function deletePlan(req, res) {
    const id = parseInt(req.params.id, 10);
    PlanModel.deletePlan(id)
        .then((plan) => {
            if (plan) {
                res.status(200).json({ message: 'Plan deleted successfully' }); 
            } else {
                res.status(404).json({ error: 'Plan not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to delete plan', details: error.message });
        });
}

export default { createPlan, getPlanById, getAllPlans, updatePlan, deletePlan };