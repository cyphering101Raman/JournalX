import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { User } from "@/app/models/User";
import { hashPassword } from "@/app/lib/hash";
import { validateSignup } from "@/app/utils/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const error = validateSignup(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const { name, email, password } = body;

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const response = NextResponse.json(
      { message: "User created", userId: user._id },
      { status: 201 }
    );
    response.cookies.set("auth-session", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}