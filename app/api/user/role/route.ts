import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await req.json();

    if (role !== "STUDENT" && role !== "COMPANY") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { role },
    });

   if (role === "STUDENT") {
  await prisma.studentProfile.upsert({
    where: {
      userId: user.id,
    },
    update: {},
    create: {
      userId: user.id,
      fullName: user.name || "",
      skills: [],
      projects: [],
    },
  });
}

if (role === "COMPANY") {
  await prisma.companyProfile.upsert({
    where: {
      userId: user.id,
    },
    update: {},
    create: {
      userId: user.id,
      companyName: user.name || "",
    },
  });
}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ROLE_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}