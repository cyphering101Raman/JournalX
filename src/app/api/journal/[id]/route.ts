import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/app/lib/db";
import { Journal } from "@/app/models/Journal";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("auth-session");

    if (!session?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.value;
    const { id: journalId } = await params;

    // Validate parameter gracefully to avoid Mongoose casting crashes
    if (!journalId || journalId.length !== 24) {
      return NextResponse.json({ error: "Invalid journal ID" }, { status: 400 });
    }

    await connectDB();

    // Securely tie the deletion strictly to the mapped logged-in session user
    const deletedJournal = await Journal.findOneAndDelete({
      _id: journalId,
      userId: userId,
    });

    if (!deletedJournal) {
      return NextResponse.json(
        { error: "Journal not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Journal successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
