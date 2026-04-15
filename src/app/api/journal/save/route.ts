import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/app/lib/db";
import { Journal } from "@/app/models/Journal";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("auth-session");

    // 1. Verify Authentication
    if (!session?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.value;
    const body = await req.json();
    const { journalId, title, content } = body;

    await connectDB();

    let journal;

    // Direct ObjectId validation prevents cast errors
    if (journalId && journalId.length === 24) {
      journal = await Journal.findOne({ _id: journalId, userId });
      if (journal) {
        journal.title = title ?? journal.title;
        journal.content = content ?? journal.content;
        await journal.save();
      }
    }

    // Guarantee document creation if the payload ID is completely absent or bogus
    if (!journal) {
      journal = await Journal.create({
        userId,
        title: title || "Untitled",
        content: content || "",
      });
    }

    // 5. Respond
    return NextResponse.json(
      { message: "Journal saved accurately", journal },
      { status: 200 }
    );
  } catch (error) {
    console.error("Journal Save Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
