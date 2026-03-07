import express from "express";
import { 
  getHackathons, 
  getHackathonById, 
  joinHackathon 
} from "../controllers/web/hackathon.controller.js";
import { authMiddleware, authOptional } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (with optional auth for registration status)
router.get("/", authOptional, getHackathons);
router.get("/:id", authOptional, getHackathonById);

// Protected routes
router.post("/join", authMiddleware, joinHackathon);

export default router;
