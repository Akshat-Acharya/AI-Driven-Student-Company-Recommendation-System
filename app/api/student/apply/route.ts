import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generateMatchScore } from "@/lib/ai/matchScore"; // 🔥 NEW

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* 🔥 GET USER FROM DB (SAFE WAY) */
    const dbUser = await prisma.user.findUnique({
      where: {
        email: session.user.email!,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /* 🔥 GET STUDENT PROFILE */
    const student = await prisma.studentProfile.findUnique({
      where: {
        userId: dbUser.id,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Complete your profile first" },
        { status: 400 }
      );
    }

    /* 🔥 GET JOB ID */
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "Missing jobId" },
        { status: 400 }
      );
    }

    /* 🔥 CHECK IF JOB EXISTS */
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    /* 🔥 PREVENT DUPLICATE APPLY */
    const existing = await prisma.application.findUnique({
      where: {
        studentId_jobId: {
          studentId: student.id,
          jobId: jobId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already applied" },
        { status: 400 }
      );
    }

    /* 🔥 CREATE APPLICATION */
    const application = await prisma.application.create({
      data: {
        studentId: student.id,
        jobId: jobId,
      },
    });

    /* ===================================================== */
    /* 🔥 AI SCORING (NEW PART — SAFE, NON-BREAKING) */
    /* ===================================================== */

    try {
      const aiResult = await generateMatchScore({
        job,
        student,
      });

      await prisma.matchScore.upsert({
        where: {
          studentId_jobId: {
            studentId: student.id,
            jobId: jobId,
          },
        },
        update: {
          score: aiResult.score,
          explanation: aiResult.explanation,
        },
        create: {
          studentId: student.id,
          jobId: jobId,
          score: aiResult.score,
          explanation: aiResult.explanation,
        },
      });
    } catch (err) {
      console.error("AI scoring failed:", err);
      // ❗ Do NOT break application flow
    }

    /* ===================================================== */

    return NextResponse.json({ success: true, application });

  } catch (err) {
    console.error("APPLY ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}