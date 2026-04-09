import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ChatOllama } from "@langchain/ollama";

export async function POST(req: Request) {
  try {
    const { message, jobId, history } = await req.json();

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { companyProfile: true },
    });

    const company = dbUser?.companyProfile;

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    /* 🔹 JOB + APPLICANTS */
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        applications: {
          include: {
            student: true,
          },
        },
      },
    });

    const candidates = job?.applications.map((a) => a.student);

    /* 🔹 MODEL */
    const model = new ChatOllama({
      baseUrl: "http://127.0.0.1:11434",
      model: "llama3",
      temperature: 0.3,
    });

    /* 🔹 CONTEXT */
    const context = `
You are an AI hiring assistant helping a recruiter.

Job:
- Title: ${job?.title}
- Required Skills: ${job?.requiredSkills?.join(", ")}

Candidates:
${candidates
  ?.map(
    (c) => `
- Skills: ${c.skills?.join(", ")}
- CGPA: ${c.cgpa}
- Experience: ${c.experienceLevel}
`
  )
  .join("\n")}

Instructions:
- Be concise
- Help in decision making
- Suggest best candidates
- Highlight strengths & weaknesses
`;

    const formattedHistory =
      history?.map((h: any) => `${h.role}: ${h.text}`).join("\n") || "";

    const prompt = `
${context}

Conversation:
${formattedHistory}

User: ${message}
AI:
`;

    const response = await model.invoke(prompt);

    return NextResponse.json({
      reply: response.content,
    });

  } catch (err) {
    console.error("COMPANY CHAT ERROR:", err);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}