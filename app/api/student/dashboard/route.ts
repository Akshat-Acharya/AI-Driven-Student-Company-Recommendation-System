import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ChatOllama } from "@langchain/ollama";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* 🔥 USER */
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { studentProfile: true },
    });

    const student = user?.studentProfile;

    if (!student) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    /* 🔥 APPLICATIONS */
    const applications = await prisma.application.findMany({
      where: { studentId: student.id },
      include: { job: true },
    });

    const totalApplications = applications.length;

    const statusCounts = {
      APPLIED: 0,
      SHORTLISTED: 0,
      REJECTED: 0,
      HIRED: 0,
    };

    applications.forEach((a) => {
      statusCounts[a.status]++;
    });

    /* 🔥 MATCH SCORES */
    const scores = await prisma.matchScore.findMany({
      where: { studentId: student.id },
    });

    const avgScore =
      scores.length > 0
        ? Math.round(
            scores.reduce((acc, s) => acc + s.score, 0) / scores.length
          )
        : 0;

    /* 🔥 RECOMMENDED JOBS (TOP 3) */
    const jobs = await prisma.job.findMany({
      where: { status: "ACTIVE" },
      include: { matches: true },
    });

    const recommended = jobs
      .map((job) => {
        const match = job.matches.find(
          (m) => m.studentId === student.id
        );

        return {
          id: job.id,
          title: job.title,
          score: match?.score || 0,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    /* 🔥 AI INSIGHTS */
    let insights: string[] = [];

    try {
      const model = new ChatOllama({
        baseUrl: "http://127.0.0.1:11434",
        model: "llama3",
      });

      const prompt = `
You are a career assistant.

Student Data:
- Skills: ${student.skills.join(", ")}
- Avg Score: ${avgScore}
- Applications: ${totalApplications}
- Shortlisted: ${statusCounts.SHORTLISTED}

Give 3 short insights:
- strengths
- weaknesses
- improvement tip

No numbering.
`;

      const res = await model.invoke(prompt);

      insights = (res.content as string)
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 3);

    } catch {
      insights = ["Insights unavailable"];
    }

    return NextResponse.json({
      stats: {
        totalApplications,
        shortlisted: statusCounts.SHORTLISTED,
        avgScore,
        profileCompleted: student.profileCompleted,
      },
      statusCounts,
      recommended,
      insights,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}