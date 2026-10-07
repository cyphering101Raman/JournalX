import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { validateEmail, validatePassword } from "../utils/validators";

const isProd = process.env.NODE_ENV === "production";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!validateEmail(email)) {
        res.status(400).json({ error: "Invalid email format." });
        return;
      }

      const passCheck = validatePassword(password);
      if (!passCheck.isValid) {
        res.status(400).json({ error: passCheck.message });
        return;
      }

      const result = await AuthService.signup(email, password);

      res.cookie("token", result.token, COOKIE_OPTIONS);

      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.cookie("token", result.token, COOKIE_OPTIONS);

      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    });
    res.status(200).json({ message: "Logged out successfully." });
  }
}
