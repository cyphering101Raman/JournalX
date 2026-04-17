import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/app/lib/db";
import { Journal } from "@/app/models/Journal";
import { AIGeneration } from "@/app/models/AIGeneration";
import { generateJournalInsight, generateRangeSummary } from "@/app/lib/ai";

export async function POST(req: Request) {
  try {
    const { startDate, endDate } = await req.json();

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Missing dates" }, { status: 400 });
    }

    // Auth - Get userId from session
    const cookieStore = await cookies();
    const session = cookieStore.get("auth-session");
    if (!session?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.value;

    // Validate Range (3-15 days inclusive)
    // We expect 2 to 14 day difference for a 3-15 day span
    const startObj = new Date(startDate);
    const endObj = new Date(endDate);
    const diffTime = Math.abs(endObj.getTime() - startObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end

    if (diffDays < 3 || diffDays > 15) {
      return NextResponse.json(
        { error: "Select a range between 3 and 15 days" },
        { status: 400 }
      );
    }

    await connectDB();

    // Set time boundaries to capture the full days
    const startLimit = new Date(startDate);
    startLimit.setHours(0, 0, 0, 0);

    const endLimit = new Date(endDate);
    endLimit.setHours(23, 59, 59, 999);

    // Fetch journals for this user within the range
    const journals = await Journal.find({
      userId,
      createdAt: { $gte: startLimit, $lte: endLimit },
    })
      .select("content insights createdAt")
      .sort({ createdAt: 1 })
      .lean(); // Convert to plain JS objects for easier manipulation

    if (journals.length === 0) {
      return NextResponse.json(
        { error: "No journal entries found in this range" },
        { status: 404 }
      );
    }

    // Identify journals missing insights
    const journalsNeedingInsights = journals.filter(
      (j) => !j.insights || j.insights.length === 0
    );

    // Generate and save missing insights in parallel
    if (journalsNeedingInsights.length > 0) {
      await Promise.all(
        journalsNeedingInsights.map(async (journal) => {
          try {
            const insight = await generateJournalInsight(journal.content);
            // Persistent Save
            await Journal.findByIdAndUpdate(journal._id, {
              $push: { insights: insight },
            });
            // Update in-memory object for next step
            (journal as any).insights = [{ ...insight, createdAt: new Date() }];
          } catch (err) {
            console.error(`Failed to generate insight for journal ${journal._id}:`, err);
            // We could throw or just skip, but for summary we need them. 
            // Better to throw if generation fails to ensure quality.
            throw new Error(`AI generation failed for journal date ${journal.createdAt}`);
          }
        })
      );
    }

    // Build final optimized structured input using ONLY insights
    const preparedInput = journals
      .map((j, index) => {
        const insight = j.insights[j.insights.length - 1]; // Latest insight
        const dateStr = new Date(j.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return `Day ${index + 1} (${dateStr}):
Mood: ${insight.mood}
Summary: ${insight.summary}
Tags: ${insight.tags.join(", ")}`;
      })
      .join("\n\n---\n\n");

    // Generate Final Range Summary using AI
    const aiSummary = await generateRangeSummary(preparedInput);

    // Save summary to database for history
    await AIGeneration.create({
      userId,
      type: "SUMMARY",
      startDate,
      endDate,
      output: aiSummary,
    });

    return NextResponse.json({ journals, preparedInput, aiSummary }, { status: 200 });

  } catch (error: any) {
    console.error("Summary Range API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
