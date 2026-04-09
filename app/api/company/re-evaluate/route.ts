import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateMatchScore } from "@/lib/ai/matchScore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, studentId } = await req.json();

    if (!jobId || !studentId) {
      return NextResponse.json(
        { error: "Missing jobId or studentId" },
        { status: 400 }
      );
    }

    /* 🔥 GET JOB */
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    /* 🔥 GET STUDENT */
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    /* 🔥 RUN AI AGAIN */
    const aiResult = await generateMatchScore({
      job,
      student,
    });

    /* 🔥 UPSERT MATCH SCORE */
    await prisma.matchScore.upsert({
      where: {
        studentId_jobId: {
          studentId,
          jobId,
        },
      },
      update: {
        score: aiResult.score,
        explanation: aiResult.explanation,
      },
      create: {
        studentId,
        jobId,
        score: aiResult.score,
        explanation: aiResult.explanation,
      },
    });

    return NextResponse.json({
      success: true,
      score: aiResult.score,
      explanation: aiResult.explanation,
    });

  } catch (err) {
    console.error("RE-EVALUATE ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}