import { Router } from "express";
import { JournalController } from "../controllers/journal.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticateUser);

router.get("/today", JournalController.getTodayJournal);
router.post("/save", JournalController.saveJournal);
router.get("/all", JournalController.getAllJournals);
router.delete("/:id", JournalController.deleteJournal);

export default router;
