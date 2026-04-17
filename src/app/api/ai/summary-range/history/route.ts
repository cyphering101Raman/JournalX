import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/app/lib/db";
import { AIGeneration } from "@/app/models/AIGeneration";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("auth-session");

    if (!session?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.value;
    await connectDB();

    const history = await AIGeneration.find({
      userId,
      type: "SUMMARY",
    }).sort({ createdAt: -1 }); // Latest first

    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    console.error("Fetch History Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
