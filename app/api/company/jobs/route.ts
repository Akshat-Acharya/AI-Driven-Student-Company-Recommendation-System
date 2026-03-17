import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { companyProfile: true },
  }); 

  if (!user?.companyProfile) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const jobs = await prisma.job.findMany({
    where: {
      companyId: user.companyProfile.id,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ jobs });
}


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { companyProfile: true },
    });

    if (!user?.companyProfile) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const job = await prisma.job.create({
      data: {
        companyId: user.companyProfile.id,
        title: body.title,
        description: body.description,
        experienceLevel: body.experienceLevel || null,
        minCgpa: body.minCgpa || null,
        requiredSkills: [],
        preferredSkills: [],
      },
    });

    return NextResponse.json({ job });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}