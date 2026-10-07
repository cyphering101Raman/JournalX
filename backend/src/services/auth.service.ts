import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { hashPassword, verifyPassword } from "../utils/hash";

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  user: { id: string; email: string };
  token: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_in_env";

export class AuthService {
  static async signup(email: string, password: string): Promise<AuthResponse> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ email, passwordHash: hashedPassword });

    const payload: JwtPayload = { userId: newUser._id.toString(), email: newUser.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return {
      user: { id: newUser._id.toString(), email: newUser.email },
      token,
    };
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials.");
    }

    // Support both passwordHash and legacy password field
    const hashedPassword = user.passwordHash || user.get("password") || (user as any).password;
    if (!hashedPassword) {
      throw new Error("Invalid credentials.");
    }

    const isMatch = await verifyPassword(password, hashedPassword);
    if (!isMatch) {
      throw new Error("Invalid credentials.");
    }

    // Auto-migrate legacy field to passwordHash if needed
    if (!user.passwordHash && hashedPassword) {
      user.passwordHash = hashedPassword;
      await user.save();
    }

    const payload: JwtPayload = { userId: user._id.toString(), email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return {
      user: { id: user._id.toString(), email: user.email },
      token,
    };
  }
}
