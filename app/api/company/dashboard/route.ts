import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ChatGroq } from "@langchain/groq";

export async function GET() {
  try {
    /* 🔐 AUTH */
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* 👤 COMPANY */
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { companyProfile: true },
    });

    const companyId = user?.companyProfile?.id;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    /* =========================
       🔥 JOB STATS
    ========================== */
    const totalJobs = await prisma.job.count({
      where: { companyId },
    });

    const activeJobsCount = await prisma.job.count({
      where: {
        companyId,
        status: "ACTIVE",
      },
    });

    /* =========================
       🔥 APPLICATIONS
    ========================== */
    const applications = await prisma.application.findMany({
      where: {
        job: { companyId },
      },
    });

    const totalApplicants = applications.length;

    const statusCounts = {
      APPLIED: 0,
      SHORTLISTED: 0,
      REJECTED: 0,
      HIRED: 0,
    };

    applications.forEach((a) => {
      statusCounts[a.status]++;
    });

    /* =========================
       🔥 MATCH SCORES
    ========================== */
    const scores = await prisma.matchScore.findMany({
      where: {
        job: { companyId },
      },
    });

    const avgScore =
      scores.length > 0
        ? Math.round(
            scores.reduce((acc, s) => acc + s.score, 0) / scores.length
          )
        : 0;

    /* =========================
       🔥 ACTIVE JOBS LIST
    ========================== */
    const jobs = await prisma.job.findMany({
      where: {
        companyId,
        status: "ACTIVE",
      },
      include: {
        applications: true,
        matches: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const activeJobs = jobs.map((job) => {
      const applicantCount = job.applications.length;

      const jobAvgScore =
        job.matches.length > 0
          ? Math.round(
              job.matches.reduce((acc, m) => acc + m.score, 0) /
                job.matches.length
            )
          : 0;

      return {
        id: job.id,
        title: job.title,
        applicants: applicantCount,
        avgScore: jobAvgScore,
      };
    });

    /* =========================
       🔥 SKILL ANALYSIS
    ========================== */
    const allApplications = await prisma.application.findMany({
      where: {
        job: { companyId },
      },
      include: {
        student: true,
      },
    });

    const skillMap: Record<string, number> = {};

    allApplications.forEach((app) => {
      app.student.skills?.forEach((skill: string) => {
        const key = skill.toLowerCase();
        skillMap[key] = (skillMap[key] || 0) + 1;
      });
    });

    const skillData = Object.entries(skillMap)
      .map(([skill, count]) => ({
        skill,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    /* =========================
       🔥 TOP JOB
    ========================== */
    const topJob =
      activeJobs.length > 0
        ? activeJobs.reduce((prev, curr) =>
            curr.applicants > prev.applicants ? curr : prev
          )
        : null;

    /* =========================
       🚀 RESPONSE
    ========================== */

    /* =========================
       🤖 AI INSIGHTS (DYNAMIC)
    ========================== */

    let insights: string[] = [];

    try {
      const model = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: "llama-3.3-70b-versatile",
      });

      const topSkillsText = skillData
        .map((s) => `${s.skill} (${s.count})`)
        .join(", ");

      const prompt = `
You are an AI hiring analyst.

Based on the following hiring data, generate 3 short insights.

DATA:
- Total Applicants: ${totalApplicants}
- Shortlisted: ${statusCounts.SHORTLISTED}
- Avg Score: ${avgScore}
- Top Skills: ${topSkillsText}

RULES:
- Each insight must be 1 short sentence
- Be specific (not generic)
- No numbering
- No explanation

Return as plain text separated by new lines.
`;

      const response = await model.invoke(prompt);

      const raw = response.content as string;

      insights = raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 3);

    } catch (err) {
      console.error("AI INSIGHTS ERROR:", err);

      insights = [
        "Unable to generate insights",
      ];
    }

    return NextResponse.json({
      stats: {
        totalJobs,
        activeJobs: activeJobsCount,
        totalApplicants,
        shortlisted: statusCounts.SHORTLISTED,
        avgScore,
      },
      funnel: statusCounts,
      activeJobs,
      skillData,
      topJob,
      insights,
    });

  } catch (err) {
    console.error("DASHBOARD ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}