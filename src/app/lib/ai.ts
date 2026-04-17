import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ GEMINI_API_KEY is not defined in .env");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function generateJournalInsight(content: string) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  if (!content || content.trim().length === 0) {
    return {
      mood: "Neutral",
      summary: "This entry was empty.",
      tags: ["Empty"]
    };
  }

  const prompt = `
    Analyze the following journal entry and provide insights in JSON format.
    
    STRICT RULES:
    1. mood: Exactly 1 word only (e.g., Happy, Stressed, Focused, Anxious). Non-negotiable.
    2. summary: 2-3 lines total. Keep it short and sharp.
    3. tags: 3-5 keywords max.
    
    Journal Content:
    """
    ${content}
    """
    
    Response MUST be valid JSON in this format:
    {
      "mood": "SingleWord",
      "summary": "2-3 lines of summary...",
      "tags": ["tag1", "tag2", "tag3"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (Gemini sometimes wraps in ```json ... ```)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response: No JSON found");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validation of strict rules
    if (parsed.mood && parsed.mood.split(" ").length > 1) {
      parsed.mood = parsed.mood.split(" ")[0]; // Force 1 word if LLM fails
    }

    return {
      mood: parsed.mood || "Neutral",
      summary: parsed.summary || "No summary available.",
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
    };
  } catch (error: any) {
    console.error("AI Insight Error:", error);
    throw new Error(`Failed to generate AI insights: ${error.message}`);
  }
}

export async function generateRangeSummary(preparedInput: string) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Analyze the following multi-day journal insights and provide a high-level summary.
    
    Data:
    """
    ${preparedInput}
    """
    
    STRICT RULES:
    1. summary: A short, cohesive overview of the entire period.
    2. patterns: An array of 3-5 recurring themes, habits, or mental models observed across the days.
    3. overallMood: Exactly 1 word representing the primary tone of the period (e.g., Growth, Resilience, Turbulent, Growth, Reflective).
    
    Response MUST be valid JSON in this format:
    {
      "summary": "Cohesive overview...",
      "patterns": ["pattern 1", "pattern 2", "pattern 3"],
      "overallMood": "SingleWord"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response: No JSON found");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      summary: parsed.summary || "No multi-day summary available.",
      patterns: Array.isArray(parsed.patterns) ? parsed.patterns.slice(0, 5) : [],
      overallMood: parsed.overallMood || "Neutral",
    };
  } catch (error: any) {
    console.error("AI Range Summary Error:", error);
    throw new Error(`Failed to generate range summary: ${error.message}`);
  }
}

