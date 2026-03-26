import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // adjust path if needed

export async function GET() {
  try {
    // ✅ Get logged-in user
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // ✅ Fetch jobs + check applications
    const jobs = await prisma.job.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        company: {
          include: {
            user: true,
          },
        },
        applications: {
          where: {
            studentId: studentId,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // ✅ Add isApplied flag
    const formattedJobs = jobs.map((job) => ({
      ...job,
      isApplied: job.applications.length > 0,
    }));

    return NextResponse.json({ jobs: formattedJobs });

  } catch (err) {
    console.error("JOBS FETCH ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}