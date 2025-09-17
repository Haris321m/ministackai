import userplancontroller from '../controllers/userplan.controller.js';
import express from 'express';
const router = express.Router();


router.post('/', userplancontroller.createUserPlan);
router.get('/:id', userplancontroller.getUserPlanById);
router.get('/', userplancontroller.getAllUserPlans);
router.put('/:id', userplancontroller.updateUserPlan);
router.delete('/:id', userplancontroller.deleteUserPlan);

export default router;