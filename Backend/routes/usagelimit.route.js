import usagelimitController from '../controllers/usagelimit.controller.js';
import express from 'express';
const router = express.Router();


router.post('/', usagelimitController.createUsageLimit);
router.get('/:id', usagelimitController.getUsageLimitById);
router.get('/', usagelimitController.getAllUsageLimits);
router.put('/:id', usagelimitController.updateUsageLimit);
router.delete('/:id', usagelimitController.deleteUsageLimit);

export default router;