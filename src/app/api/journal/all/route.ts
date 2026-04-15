import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/app/lib/db";
import { Journal } from "@/app/models/Journal";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("auth-session");

    if (!session?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.value;
    await connectDB();

    const journals = await Journal.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ journals }, { status: 200 });
  } catch (error) {
    console.error("Fetch All Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
