import { NextResponse } from "next/server";
import { ChatOllama } from "@langchain/ollama";

/* ---------------- SAFE JSON PARSER ---------------- */

function safeParseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractJSON(text: string) {
  try {
    // Remove markdown
    let cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON block
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) return null;

    let jsonString = cleaned.slice(start, end + 1);

    // Fix common issues
    jsonString = jsonString
      .replace(/\r/g, "")
      .replace(/\t/g, "")
      .replace(/[\u0000-\u001F]+/g, "")
      .replace(/\n/g, "\\n");

    // Try parsing
    let parsed = safeParseJSON(jsonString);

    if (parsed) return parsed;

    // 🔥 Attempt fallback fix (quotes issues)
    jsonString = jsonString.replace(/(\w+):/g, '"$1":');

    parsed = safeParseJSON(jsonString);

    return parsed;

  } catch {
    return null;
  }
}

/* ---------------- API ---------------- */

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Job title required" },
        { status: 400 }
      );
    }

    const model = new ChatOllama({
      baseUrl: "http://127.0.0.1:11434",
      model: "llama3",
    });

    const prompt = `
You are a senior recruiter writing professional LinkedIn job posts.

STRICT RULES:
- Follow the structure EXACTLY
- Use section headings exactly as written
- Use paragraphs for descriptions
- Use "-" for bullet points
- Make it realistic and professional
- DO NOT return anything outside JSON
- All newlines inside "description" must be written as \\n

Job Title: ${title}

Return ONLY valid JSON:

{
  "description": "string",
  "skills": ["skill1", "skill2"],
  "experienceLevel": "BEGINNER | INTERMEDIATE | ADVANCED",
  "domainFocus": "domain"
}

DESCRIPTION FORMAT:

About the Job

About the Role:
[3-4 lines paragraph]

Key Responsibilities:
- point
- point

Required Qualifications:
- point
- point

Nice to Have:
- point

Why Join Us:
- point
`;

    const response = await model.invoke(prompt);

    const raw = response.content as string;

    console.log("RAW AI OUTPUT:", raw);

    const parsed = extractJSON(raw);

    // ❗ FINAL SAFETY NET
    if (!parsed) {
      return NextResponse.json({
        description:
          "Unable to generate structured description. Please try again.",
        skills: [],
        experienceLevel: "BEGINNER",
        domainFocus: "",
      });
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("AI ERROR:", error);

    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}