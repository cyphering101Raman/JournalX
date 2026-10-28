import { Router } from "express";
import { RagController } from "../controllers/rag.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticateUser);

router.post("/query", RagController.query);

export default router;
