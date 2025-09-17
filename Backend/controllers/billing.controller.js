import billingModel from "../models/billing.model.js";


function createBilling(req, res) {
    const data = req.body;
    billingModel.createBilling(data)
        .then((newB) => {
            res.status(201).json(newB);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to create billing', details: error.message });
        });
}

function getBillingById(req, res) {
    const id = parseInt(req.params.id, 10);
    billingModel.getBillingById(id)
        .then((billing) => {
            if (billing) {
                res.status(200).json(billing);
            } else {
                res.status(404).json({ error: 'Billing not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve billing', details: error.message });
        }
    );
}   

function getAllBillings(req, res) {
    billingModel.getAllBillings()
        .then((billings) => {
            res.status(200).json(billings);
        }
        ).catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve billings', details: error.message });
        }
    );
}
function updateBilling(req, res) {
    const id = parseInt(req.params.id, 10);
    const data = req.body;
    billingModel.updateBilling(id, data)
        .then((billing) => {
            if (billing) {
                res.status(200).json(billing);
            } else {
                res.status(404).json({ error: 'Billing not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to update billing', details: error.message });
        }
    );
}

function deleteBilling(req, res) {
    const id = parseInt(req.params.id, 10);
    billingModel.deleteBilling(id)
        .then((billing) => {
            if (billing) {
                res.status(200).json({ message: 'Billing deleted successfully' });
            } else {
                res.status(404).json({ error: 'Billing not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to delete billing', details: error.message });
        }
    );
}

export default {
    createBilling,
    getBillingById,
    getAllBillings,
    updateBilling,
    deleteBilling
};