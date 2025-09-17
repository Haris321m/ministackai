import applinglimitsController from "../controllers/applinglimits.controller.js";
import createMulter from "../utils/fileupload.utils.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRole } from '../middlewares/roleMiddleware.js';
import express from "express";

const router = express.Router();

const upload = createMulter("uploads/", [".jpg", ".jpeg", ".png"]);

router.get("/",authenticate, authorizeRole("admin"), applinglimitsController.getAllUsersPlanReport);
router.post("/:id",upload.single("easypaisa") ,authenticate, authorizeRole("user"), applinglimitsController.userfileupload)
router.get("/getpayments",authenticate, authorizeRole("admin"),applinglimitsController.userpayment)
router.delete("/:id",authenticate, authorizeRole("admin"),applinglimitsController.deletepayment)

export default router;
