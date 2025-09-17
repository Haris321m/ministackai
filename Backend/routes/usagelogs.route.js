import express from 'express';
const router = express.Router();
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRole } from '../middlewares/roleMiddleware.js';
import usagelogsController from '../controllers/usagelogs.controller.js';

router.get('/:id',authenticate, authorizeRole("admin"), usagelogsController.getUsageLogById);
router.get('/', authenticate, authorizeRole("admin"), usagelogsController.getAllUsageLogs);
router.put('/:id', authenticate, authorizeRole("admin"), usagelogsController.updateUsageLog);
router.delete('/:id', authenticate, authorizeRole("admin"), usagelogsController.deleteUsageLog);


export default router;