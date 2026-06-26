import express from "express";
import { checkSymptoms, summarizeClinicalDetails, recommendMedicines } from "../controllers/ai.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const aiRouter = express.Router();

aiRouter.post("/symptom-checker", authMiddleware, checkSymptoms);
aiRouter.post("/clinical-summary", authMiddleware, summarizeClinicalDetails);
aiRouter.post("/recommend-medicines", authMiddleware, recommendMedicines);

export default aiRouter;
