import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  context: { params: Promise<{ jobId: string }> } // Change to Promise
) {
  try {
    // 1. Await the params (Required in Next.js 15)
    const params = await context.params;
    const  jobId  = params.jobId; 
    console.log("JOB ID in route : " , jobId)
    
    if (!jobId) {
      return NextResponse.json({ error: "Missing job id" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    console.log("DATABASE RETURNED JOB ID:", job?.id);

    if (!job) {
      // If the job belongs to someone else, this returns 404, 
      // which is correct for security (don't leak that it exists).
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    // ✅ FIX: await params
    const params = await context.params;

    const jobId = params.jobId;

    console.log("DELETE JOB ID:", jobId);

    if (!jobId) {
      return NextResponse.json(
        { error: "Missing jobId" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      where: { id: jobId }, // ✅ now valid
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
export async function PATCH(req: Request, context: any) {
  try {
    // ✅ FIX: await params
    const params = await context.params;

    console.log("UNWRAPPED PARAMS:", params);

    const jobId = params.jobId;

    console.log("FINAL JOB ID:", jobId);

    if (!jobId) {
      return NextResponse.json(
        { error: "Missing jobId" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        company: {
          userId: session.user.id,
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    await prisma.job.update({
      where: { id: jobId },
      data: {
        ...body,
        ...(body.status && {status : body.status}),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}