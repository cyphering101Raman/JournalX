import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { RagService } from "../services/rag.service";

export class RagController {
  static async query(
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

      const { query } = req.body;
      if (!query || typeof query !== "string" || !query.trim()) {
        res.status(400).json({ error: "A valid query string is required" });
        return;
      }

      const result = await RagService.query(userId, query.trim());
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
