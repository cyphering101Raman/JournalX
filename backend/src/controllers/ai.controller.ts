import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { AIService } from "../services/ai.service";

export class AIController {
  static async getInsight(
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

      const { content } = req.body;
      if (!content || content.trim().length === 0) {
        res.status(400).json({ error: "Journal content is required for insight generation." });
        return;
      }

      const insight = await AIService.generateInsight(userId, content);
      res.status(200).json({ insight });
    } catch (error) {
      next(error);
    }
  }
}
