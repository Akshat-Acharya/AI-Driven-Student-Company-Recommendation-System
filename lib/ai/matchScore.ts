import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

/* 🔥 HELPER: SAFE JSON PARSE */
function safeParseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    try {
      // try extracting JSON manually
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch {}

    return null;
  }
}

export async function generateMatchScore({
  job,
  student,
}: any): Promise<{ score: number; explanation: string }> {
  const prompt = `
You are an expert hiring AI.

Evaluate how well the candidate fits the job.

STRICT RULES:
- Output ONLY valid JSON
- No markdown
- No explanation outside JSON

Format:
{
  "score": number (0-100),
  "explanation": "1-2 line short reasoning"
}

Scoring Logic:
- Skills match → highest priority
- Relevant projects → high priority
- Experience → medium priority

----------------------------------

JOB:
Title: ${job.title}
Skills: ${job.requiredSkills.join(", ")}
Domain: ${job.domainFocus || "Not specified"}

----------------------------------

CANDIDATE:
Skills: ${student.skills.join(", ")}
Experience: ${student.experienceLevel || "Unknown"}
Projects: ${(student.projects || []).join(", ")}

----------------------------------

Return ONLY JSON.
`;

  try {
    const response = await llm.invoke(prompt);

    const parsed = safeParseJSON(response.content as string);

    if (!parsed) {
      return {
        score: 50,
        explanation: "Average match based on available data.",
      };
    }

    return {
      score: Number(parsed.score) || 50,
      explanation:
        parsed.explanation ||
        "Candidate has moderate alignment with job requirements.",
    };
  } catch (err) {
    console.error("LLM ERROR:", err);

    return {
      score: 50,
      explanation: "AI evaluation failed, default score assigned.",
    };
  }
}