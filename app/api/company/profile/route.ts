import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/* ---------------- GET PROFILE ---------------- */

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* 🔥 ALWAYS FETCH USER FROM DB */
    const dbUser = await prisma.user.findUnique({
      where: {
        email: session.user.email!,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /* 🔥 STRICT FILTER */
    const company = await prisma.companyProfile.findFirst({
      where: {
        userId: dbUser.id, // ✅ THIS IS THE KEY FIX
      },
    });

    return NextResponse.json({ company });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

/* ---------------- UPSERT PROFILE ---------------- */

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* ---------------- GET USER FROM DB ---------------- */

    const dbUser = await prisma.user.findUnique({
      where: {
        email: session.user.email!,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId = dbUser.id;

    const body = await req.json();

    const {
      companyName,
      description,
      location,
      website,
      logoUrl,
      bannerUrl,
      industry,
      companySize,
      foundedYear,
      hiringDomains,
      socialLinks,
    } = body;

    if (!companyName) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    /* ---------------- CHECK EXISTING ---------------- */

    const existing = await prisma.companyProfile.findFirst({
      where: {
        userId: userId,
      },
    });

    let company;

    /* ---------------- UPDATE ---------------- */
    if (existing) {
      company = await prisma.companyProfile.update({
        where: {
          id: existing.id,
        },
        data: {
          companyName,
          description,
          location,
          website,
          logoUrl,
          bannerUrl,
          industry,
          companySize,
          foundedYear,
          hiringDomains: hiringDomains || [],
          socialLinks,
          profileCompleted: true,
        },
      });
    }

    /* ---------------- CREATE ---------------- */
    else {
      company = await prisma.companyProfile.create({
        data: {
          userId: userId,
          companyName,
          description,
          location,
          website,
          logoUrl,
          bannerUrl,
          industry,
          companySize,
          foundedYear,
          hiringDomains: hiringDomains || [],
          socialLinks,
          profileCompleted: true,
        },
      });
    }

    return NextResponse.json({ company });
  } catch (err) {
    console.error("PROFILE POST ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}