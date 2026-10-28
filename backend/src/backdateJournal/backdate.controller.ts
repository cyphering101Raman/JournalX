import { Request, Response } from "express";
import { BackdateService } from "./backdate.service";

export class BackdateController {
  static async save(req: Request, res: Response): Promise<void> {
    try {
      const { userId, dateKey, title, content } = req.body;

      if (!userId) {
        res.status(400).json({ success: false, error: "userId is required in request body" });
        return;
      }

      if (!dateKey) {
        res.status(400).json({ success: false, error: "dateKey is required (e.g. 2026-10-15)" });
        return;
      }

      const journal = await BackdateService.saveJournal(userId, dateKey, title, content);
      res.status(200).json({
        success: true,
        message: "Backdated journal saved to MongoDB (AES-256 Encrypted, vectors skipped)",
        journalId: journal._id,
        dateKey: journal.dateKey,
        title: journal.title,
      });
    } catch (error: any) {
      console.error("Backdate save error:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to save journal" });
    }
  }
}
