import { Router } from "express";
import authRoutes from "./auth.routes";
import journalRoutes from "./journal.routes";
import aiRoutes from "./ai.routes";

const router = Router();

router.use("/v1/auth", authRoutes);
router.use("/v1/journal", journalRoutes);
router.use("/v1/ai", aiRoutes);

export default router;
