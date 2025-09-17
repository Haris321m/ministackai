import UserPlanModel from "../models/userplan.model.js";

function createUserPlan(req, res) {
    const data = req.body;
    UserPlanModel.createUserPlan(data)
        .then((newUP) => {
            res.status(201).json(newUP);
        }
        ).catch((error) => {
            res.status(500).json({ error: 'Failed to create user plan', details: error.message });
        }   
    );
}

function getUserPlanById(req, res) {
    const id = parseInt(req.params.id, 10);
    UserPlanModel.getUserPlanByUserId(id)
        .then((userplan) => {
            if (userplan) {
                res.status(200).json(userplan);
            } else {
                res.status(404).json({ error: 'User plan not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve user plan', details: error.message });
        }
    );
}

function getAllUserPlans(req, res) {
    UserPlanModel.getAllUserPlans()
        .then((userplans) => {
            res.status(200).json(userplans);
        }
        ).catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve user plans', details: error.message });
        }
    );
}

function updateUserPlan(req, res) {
    const id = parseInt(req.params.id, 10);
    const data = req.body;
    UserPlanModel.updateUserPlan(id, data)
        .then((userplan) => {
            if (userplan) {
                res.status(200).json(userplan);
            } else {
                res.status(404).json({ error: 'User plan not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to update user plan', details: error.message });
        }
    );
}

function deleteUserPlan(req, res) {
    const id = parseInt(req.params.id, 10);
    UserPlanModel.deleteUserPlan(id)
        .then((userplan) => {
            if (userplan) {
                res.status(200).json({ message: 'User plan deleted successfully' });
            } else {
                res.status(404).json({ error: 'User plan not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to delete user plan', details: error.message });
        }
    );
}

export default { createUserPlan, getUserPlanById, getAllUserPlans, updateUserPlan, deleteUserPlan };
