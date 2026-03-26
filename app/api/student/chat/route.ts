import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ChatOllama } from "@langchain/ollama";

export async function POST(req: Request) {
  try {
    const { message, jobId, history } = await req.json();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔹 USER + STUDENT
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { studentProfile: true },
    });

    if (!user?.studentProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const student = user.studentProfile;

    // 🔹 JOB + MATCH
    let job = null;
    let match = null;

    if (jobId) {
      job = await prisma.job.findUnique({
        where: { id: jobId },
      });

      match = await prisma.matchScore.findUnique({
        where: {
          studentId_jobId: {
            studentId: student.id,
            jobId,
          },
        },
      });
    }

    /* ---------------- MODEL ---------------- */
    const model = new ChatOllama({
      baseUrl: "http://127.0.0.1:11434",
      model: "llama3",
      temperature: 0.3, // 🔥 less randomness = better advice
    });

    /* ---------------- CONTEXT ---------------- */
    const context = `
You are an AI career assistant helping a student.

Student Profile:
- Skills: ${student.skills?.join(", ")}
- CGPA: ${student.cgpa}
- Domain: ${student.domainFocus}
- Experience: ${student.experienceLevel}

Job Context:
- Title: ${job?.title}
- Required Skills: ${job?.requiredSkills?.join(", ")}
- Domain: ${job?.domainFocus}
- Min CGPA: ${job?.minCgpa}

Match Score: ${match?.score || "N/A"}

Instructions:
- Be specific and actionable
- If skills are missing, suggest what to learn
- Keep answer concise (4-6 lines)
- No generic advice
`;

    /* ---------------- HISTORY ---------------- */
    const formattedHistory =
      history?.map((h: any) => `${h.role}: ${h.text}`).join("\n") || "";

    const finalPrompt = `
${context}

Conversation:
${formattedHistory}

User: ${message}
AI:
`;

    /* ---------------- LLM CALL ---------------- */
    const response = await model.invoke(finalPrompt);

    return NextResponse.json({
      reply: response.content,
    });

  } catch (err) {
    console.error("CHAT ERROR:", err);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}