import modelcontroller from '../controllers/model.controller.js';
import express from 'express';
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRole } from '../middlewares/roleMiddleware.js';
const router = express.Router();

router.post('/',authenticate, authorizeRole("admin"), modelcontroller.createModel);
router.get('/:id', modelcontroller.getModelById);
router.get('/', modelcontroller.getAllModels);
router.put('/:id',authenticate, authorizeRole("admin"), modelcontroller.updateModel);
router.delete('/:id',authenticate, authorizeRole("admin"), modelcontroller.deleteModel);


export default router;