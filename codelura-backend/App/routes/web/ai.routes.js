import express from "express";
import { semanticSearch } from "../../controllers/web/ai.controller.js";

const router = express.Router();

router.post("/search", semanticSearch);

export default router;