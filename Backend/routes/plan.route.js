import plancontroller from '../controllers/plan.controller.js';
import express from 'express';
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRole } from '../middlewares/roleMiddleware.js';
const router = express.Router();

router.post('/',authenticate, authorizeRole("admin"), plancontroller.createPlan);
router.get('/:id', plancontroller.getPlanById);
router.get('/',authenticate, authorizeRole("admin"), plancontroller.getAllPlans);
router.put('/:id',authenticate, authorizeRole("admin"), plancontroller.updatePlan);
router.delete('/:id',authenticate, authorizeRole("admin"), plancontroller.deletePlan);

export default router;