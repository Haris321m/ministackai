import createChatCompletion from '../controllers/chatcompletion.controller.js';
import promptenhancement from '../controllers/promptenhancment.controller.js';
import express from 'express';
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRole } from '../middlewares/roleMiddleware.js';
const router = express.Router();


router.post('/',authenticate, authorizeRole("user", "admin"), createChatCompletion);
router.post('/enhance',authenticate, authorizeRole("user", "admin"),promptenhancement)

export default router;