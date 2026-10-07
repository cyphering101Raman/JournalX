import { Router } from "express";
import { AIController } from "../controllers/ai.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticateUser);

router.post("/insight", AIController.getInsight);

export default router;
