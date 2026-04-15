import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/app/lib/db";
import { Journal } from "@/app/models/Journal";
import { AIUsage } from "@/app/models/AIUsage";
import { generateJournalInsight } from "@/app/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { journalId } = body;

    if (!journalId) {
      return NextResponse.json(
        { error: "Journal ID is required" },
        { status: 400 }
      );
    }

    // 1. Validate User (Auth)
    const cookieStore = await cookies();
    const session = cookieStore.get("auth-session");

    if (!session?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.value;

    await connectDB();

    // 2. Check Daily Limit
    const today = new Date().toISOString().split("T")[0];
    let usage = await AIUsage.findOne({ userId, date: today });

    if (usage && usage.insightCount >= 3) {
      return NextResponse.json(
        { error: "Daily AI insight limit reached (3/day)." },
        { status: 429 }
      );
    }

    // 3. Fetch Journal by journalId (Securely)
    const journal = await Journal.findOne({
      _id: journalId,
      userId: userId,
    });

    if (!journal) {
      return NextResponse.json(
        { error: "Journal not found or unauthorized" },
        { status: 404 }
      );
    }

    // 3. Extract Content
    const content = journal.content;

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: "Journal content is too short for AI insights" },
        { status: 400 }
      );
    }

    // 4. Send Content to LLM (Gemini)
    const insightData = await generateJournalInsight(content);

    // 5. Append to journal.insights (History preserved)
    const newInsight = {
      ...insightData,
      createdAt: new Date(),
    };

    if (!journal.insights) {
      journal.insights = [];
    }
    journal.insights.push(newInsight);

    await journal.save();

    // 6. Update Usage Count
    if (!usage) {
      await AIUsage.create({ userId, date: today, insightCount: 1 });
    } else {
      usage.insightCount += 1;
      await usage.save();
    }

    // 7. Return the new Insight
    return NextResponse.json(newInsight, { status: 200 });
  } catch (error) {
    console.error("AI Insight API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
