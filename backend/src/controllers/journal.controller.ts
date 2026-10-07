import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { JournalService } from "../services/journal.service";

export class JournalController {
  static async getTodayJournal(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { dateKey } = req.query;
      const key = (dateKey as string) || new Date().toISOString().split("T")[0];

      const journal = await JournalService.getJournalByDate(userId, key);
      res.status(200).json({ journal });
    } catch (error) {
      next(error);
    }
  }

  static async saveJournal(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { dateKey, title, content } = req.body;
      const journal = await JournalService.saveJournal(userId, dateKey, title, content);
      res.status(200).json({ message: "Journal saved successfully", journal });
    } catch (error) {
      next(error);
    }
  }

  static async getAllJournals(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const journals = await JournalService.getAllJournals(userId);
      res.status(200).json({ journals });
    } catch (error) {
      next(error);
    }
  }
}
