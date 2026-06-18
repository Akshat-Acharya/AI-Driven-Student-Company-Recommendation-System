import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ChatGroq } from "@langchain/groq";

export async function POST(req: Request) {
  try {
    const { candidateIds, jobId } = await req.json();

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!candidateIds || candidateIds.length < 2) {
      return NextResponse.json(
        { error: "Select at least 2 candidates" },
        { status: 400 }
      );
    }

    /* 🔹 FETCH JOB */
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    /* 🔹 FETCH CANDIDATES */
    const candidates = await prisma.studentProfile.findMany({
      where: {
        id: {
          in: candidateIds,
        },
      },
    });

    /* 🔹 MODEL */
    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    /* 🔹 BUILD PROMPT */
    const candidatesWithScore = await prisma.matchScore.findMany({
      where: {
        jobId,
        studentId: {
          in: candidateIds,
        },
      },
    });

    const candidateText = candidates
      .map((c, i) => {
        const score = candidatesWithScore.find(
          (m) => m.studentId === c.id
        )?.score;

        return `
Candidate ${i + 1} (${c.fullName}):
- Match Score: ${score}
- Skills: ${c.skills?.join(", ")}
- CGPA: ${c.cgpa}
- Domain: ${c.domainFocus}
- Experience: ${c.experienceLevel}
`;
      })
      .join("\n");

    const prompt = `
You are an AI hiring assistant.

IMPORTANT:
- Match Score is the primary indicator
- Prefer candidates with higher score unless strong reason

Job:
- Title: ${job?.title}
- Required Skills: ${job?.requiredSkills?.join(", ")}

${candidateText}

Compare candidates and return:

1. Strengths (use names)
2. Weaknesses (use names)
3. Final recommendation

RULE:
If one candidate has significantly higher score, prefer them unless major weakness.
`;

    const response = await model.invoke(prompt);

    return NextResponse.json({
      result: response.content,
    });

  } catch (err) {
    console.error("COMPARE ERROR:", err);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}