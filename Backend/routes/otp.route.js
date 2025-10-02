import otpController from "../controllers/otp.controller.js";
import express from "express";


const router = express.Router();


router.post("/",otpController.createotp);
router.post("/resent",otpController.updateotp);
router.post("/checkotp",otpController.checkOtp);
router.post("/forget",otpController.forgetOtp)
router.post("/createforget",otpController.createforgetotp)


export default router;