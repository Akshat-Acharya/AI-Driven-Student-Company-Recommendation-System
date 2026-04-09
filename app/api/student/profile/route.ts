import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }

    const profile = await prisma.studentProfile.upsert({
      where: { userId: user.id },

      update: {
        fullName: body.fullName,
        university: body.university,
        degree: body.degree,
        graduationYear: body.graduationYear
          ? Number(body.graduationYear)
          : null,
        cgpa: body.cgpa ? Number(body.cgpa) : null,
       experienceLevel: body.experienceLevel
  ? body.experienceLevel.toUpperCase()
  : null,
        resumeUrl: body.resumeUrl,
        domainFocus: body.domainFocus || null,
        skills: body.skills.split(",").map((s: string) => s.trim()),
        projects: body.projects.split("\n").map((p: string) => p.trim()),
        profileCompleted: true,
      },

      create: {
        userId: user.id,
        fullName: body.fullName,
        university: body.university,
        degree: body.degree,
        graduationYear: body.graduationYear
          ? Number(body.graduationYear)
          : null,
        cgpa: body.cgpa ? Number(body.cgpa) : null,
       experienceLevel: body.experienceLevel
  ? body.experienceLevel.toUpperCase()
  : null,
        resumeUrl: body.resumeUrl,
        domainFocus: body.domainFocus || null,
        skills: body.skills.split(",").map((s: string) => s.trim()),
        projects: body.projects.split("\n").map((p: string) => p.trim()),
        profileCompleted: true,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Profile save failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { studentProfile: true },
    });

    if (!user?.studentProfile) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({
      profile: user.studentProfile,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
