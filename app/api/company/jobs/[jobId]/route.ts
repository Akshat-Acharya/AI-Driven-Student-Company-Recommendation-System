import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  context: { params: { jobId: string } }
) {
  try {
    const { jobId } = context.params;
    console.log("JOB ID FROM PARAM:", jobId);
    if (!jobId) {
      return NextResponse.json(
        { error: "Missing job id" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

   const job = await prisma.job.findFirst({
  where: {
    id: jobId,
    company: {
      userId: session.user.id,
    },
  },
  include: {
    company: true,
  },
});

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Ownership check
    if (job.company.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({ job });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: { jobId: string } }
) {
  try {
    const { jobId } = context.params;

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔥 Secure delete (VERY IMPORTANT)
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        company: {
          userId: session.user.id,
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}