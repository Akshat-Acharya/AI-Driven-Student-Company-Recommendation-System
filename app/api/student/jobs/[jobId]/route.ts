import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params;

    if (!jobId) {
      return NextResponse.json(
        { error: "Missing jobId" },
        { status: 400 }
      );
    }

    // ✅ Get session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Get student profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        studentProfile: true,
      },
    });

    if (!user?.studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const studentId = user.studentProfile.id;

    // ✅ Fetch job + application info
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: true,
        applications: {
          where: {
            studentId,
          },
          select: { id: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    const { applications, ...rest } = job;

    return NextResponse.json({
      job: {
        ...rest,
        isApplied: applications.length > 0,
      },
    });

  } catch (err) {
    console.error("JOB DETAIL ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}