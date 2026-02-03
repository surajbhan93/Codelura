import express from "express";
import {
  signup,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword
} from "../controllers/web/authController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.patch("/change-password", authMiddleware, changePassword);


export default router;
