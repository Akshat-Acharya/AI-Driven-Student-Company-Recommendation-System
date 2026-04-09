import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* 🔥 GET USER FROM DB */
    const dbUser = await prisma.user.findUnique({
      where: {
        email: session.user.email!,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /* 🔥 GET PARAM */
    const { jobId } = await context.params;

    if (!jobId) {
      return NextResponse.json(
        { error: "Missing jobId" },
        { status: 400 }
      );
    }

    /* 🔥 VERIFY JOB BELONGS TO COMPANY */
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        company: {
          userId: dbUser.id,
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or unauthorized" },
        { status: 404 }
      );
    }

    /* 🔥 GET APPLICATIONS */
  const applications = await prisma.application.findMany({
  where: {
    jobId: jobId,
  },
  include: {
    student: {
      include: {
        user: true,
      },
    },
    job: {
      include: {
        matches: true, // 🔥 important
      },
    },
  },
});
const enriched = applications.map((app) => {
  const match = app.job.matches.find(
    (m) => m.studentId === app.student.id
  );

  return {
    ...app,
    score: match?.score || 0,
    explanation: match?.explanation || "No AI evaluation yet",
  };
});
const sorted = enriched.sort((a, b) => b.score - a.score);

    return NextResponse.json({ applications: sorted });

  } catch (err) {
    console.error("APPLICATIONS FETCH ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

