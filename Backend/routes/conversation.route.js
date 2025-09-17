import conversationcontroller from '../controllers/conversation.controller.js'; 
import express from 'express';
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRole } from '../middlewares/roleMiddleware.js';
const router = express.Router();


router.post('/',authenticate, authorizeRole("user", "admin"), conversationcontroller.createconversation);
router.get('/:id',authenticate, authorizeRole("user", "admin"), conversationcontroller.getconversationById);
router.get('/',authenticate, authorizeRole("user", "admin"), conversationcontroller.getAllconversations);
router.put('/:id',authenticate, authorizeRole("user", "admin"), conversationcontroller.updateconversation);
router.delete('/:id',authenticate, authorizeRole("user", "admin"), conversationcontroller.deleteconversation);

export default router;