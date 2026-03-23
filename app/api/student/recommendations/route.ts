import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

function calculateScore(student: any, job: any) {
  /* 🔥 SKILLS MATCH */
  const studentSkills = student.skills || [];
  const jobSkills = job.requiredSkills || [];

  const matchedSkills = jobSkills.filter((skill: string) =>
    studentSkills.includes(skill)
  );

  const skillsScore =
    jobSkills.length > 0
      ? (matchedSkills.length / jobSkills.length) * 100
      : 0;

  /* 🔥 DOMAIN MATCH */
  const domainScore =
    student.domainFocus && job.domainFocus &&
    student.domainFocus === job.domainFocus
      ? 100
      : 0;

  /* 🔥 EXPERIENCE MATCH */
  const expScore =
    student.experienceLevel === job.experienceLevel ? 100 : 50;

  /* 🔥 CGPA MATCH */
  const cgpaScore =
    job.minCgpa && student.cgpa
      ? student.cgpa >= job.minCgpa
        ? 100
        : 0
      : 50;

  /* 🔥 FINAL WEIGHTED SCORE */
  const finalScore =
    skillsScore * 0.5 +
    domainScore * 0.2 +
    expScore * 0.2 +
    cgpaScore * 0.1;

  return Math.round(finalScore);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* 🔥 GET USER */
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /* 🔥 GET STUDENT PROFILE */
    const student = await prisma.studentProfile.findUnique({
      where: { userId: dbUser.id },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Complete your profile first" },
        { status: 400 }
      );
    }

    /* 🔥 GET ALL ACTIVE JOBS */
    const jobs = await prisma.job.findMany({
      where: { status: "ACTIVE" },
      include: {
        company: true,
      },
    });

    /* 🔥 CALCULATE SCORES */
    const scoredJobs = jobs.map((job) => ({
      ...job,
      score: calculateScore(student, job),
    }));

    /* 🔥 SORT DESC */
    scoredJobs.sort((a, b) => b.score - a.score);

    return NextResponse.json({ jobs: scoredJobs });

  } catch (err) {
    console.error("RECOMMENDATION ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}