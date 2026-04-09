import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/* 🔥 UTILS */
function normalize(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function calculateScore(student: any, job: any) {
  // 🔹 SKILLS
  const studentSkills = new Set(
    (student.skills || []).map((s: string) => normalize(s))
  );

  const jobSkills = (job.requiredSkills || []).map((s: string) =>
    normalize(s)
  );

  let skillsScore = 50; // ✅ baseline

  if (jobSkills.length > 0) {
    let matchCount = 0;

    for (const skill of jobSkills) {
      if (studentSkills.has(skill)) {
        matchCount++;
      }
    }

    const ratio = matchCount / jobSkills.length;

    // smoother scaling
    skillsScore = 40 + ratio * 60; 
  }

  // 🔹 DOMAIN
  let domainScore = 50; // baseline

  if (student.domainFocus && job.domainFocus) {
    const sDomain = normalize(student.domainFocus);
    const jDomain = normalize(job.domainFocus);

    if (sDomain === jDomain) {
      domainScore = 100;
    } else if (sDomain.includes(jDomain) || jDomain.includes(sDomain)) {
      domainScore = 75;
    } else {
      domainScore = 40;
    }
  }

  // 🔹 EXPERIENCE
  const levelMap: Record<string, number> = {
    BEGINNER: 1,
    INTERMEDIATE: 2,
    ADVANCED: 3,
  };

  const sLev = levelMap[student.experienceLevel] || 1;
  const jLev = levelMap[job.experienceLevel] || 1;

  let expScore = 60; // baseline

  const diff = Math.abs(sLev - jLev);

  if (diff === 0) expScore = 100;
  else if (diff === 1) expScore = 80;
  else expScore = 50;

  // 🔹 CGPA
  let cgpaScore = 70; // baseline

  if (job.minCgpa && student.cgpa) {
    if (student.cgpa >= job.minCgpa) {
      cgpaScore = 100;
    } else {
      const gap = job.minCgpa - student.cgpa;
      cgpaScore = Math.max(50, 100 - gap * 20);
    }
  }

  // 🔹 FINAL SCORE (Adjusted weights)
  const finalScore =
    skillsScore * 0.5 +
    domainScore * 0.2 +
    expScore * 0.2 +
    cgpaScore * 0.1;

  return Math.round(finalScore);
}

/* 🔥 ROUTE */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* 🔥 USER */
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /* 🔥 STUDENT PROFILE */
    const student = await prisma.studentProfile.findUnique({
      where: { userId: dbUser.id },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Complete your profile first" },
        { status: 400 }
      );
    }

    /* 🔥 JOBS (EXCLUDING APPLIED) */
    const jobs = await prisma.job.findMany({
      where: {
        status: "ACTIVE",
        applications: {
          none: {
            studentId: student.id, // ✅ key fix
          },
        },
      },
      include: {
        company: true,
      },
    });

    /* 🔥 SCORE CALCULATION */
    const scoredJobs = jobs.map((job) => ({
      ...job,
      score: calculateScore(student, job),
    }));

    /* 🔥 SORT */
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