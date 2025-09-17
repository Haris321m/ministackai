import billingcontroller from "../controllers/billing.controller.js";
import express from "express";
const router = express.Router();

router.post("/", billingcontroller.createBilling);
router.get("/:id", billingcontroller.getBillingById);
router.get("/", billingcontroller.getAllBillings);
router.put("/:id", billingcontroller.updateBilling);
router.delete("/:id", billingcontroller.deleteBilling);

export default router;