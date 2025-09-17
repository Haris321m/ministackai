import usercontroller from '../controllers/user.controller.js';
import express from 'express';
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRole } from '../middlewares/roleMiddleware.js';
const router = express.Router();


router.post('/', usercontroller.createUser);
router.get('/:id', usercontroller.getUserById);
router.get('/', authenticate, authorizeRole("admin"), usercontroller.getAllUsers);
router.put('/:id', authenticate, authorizeRole("admin"), usercontroller.updateUser);
router.delete('/:id', authenticate, authorizeRole("admin"), usercontroller.deleteUser);
router.post('/login', usercontroller.LoginUser);
export default router;