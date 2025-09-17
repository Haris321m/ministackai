import chatController from '../controllers/chat.controller.js';
import express from 'express';
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRole } from '../middlewares/roleMiddleware.js';
const router = express.Router();


router.post('/',authenticate, authorizeRole("user", "admin"), chatController.createChat);
router.get('/:id',authenticate, authorizeRole("user", "admin"), chatController.getChatById);
router.get('/',authenticate, authorizeRole("user", "admin"), chatController.getAllChats);
router.put('/:id',authenticate, authorizeRole("user", "admin"), chatController.updateChat);
router.delete('/:id',authenticate, authorizeRole("user", "admin"), chatController.deleteChat);

export default router;