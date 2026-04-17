import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { User } from "@/app/models/User";
import { comparePassword } from "@/app/lib/hash";
import { validateLogin } from "@/app/utils/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const error = validateLogin(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      { message: "Login success", userId: user._id },
      { status: 200 }
    );
    response.cookies.set("auth-session", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}