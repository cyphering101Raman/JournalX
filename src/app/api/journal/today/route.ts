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

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const journal = await Journal.findOne({
      userId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (journal) {
      return NextResponse.json({ exists: true, journal });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    console.error("Fetch Today Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
