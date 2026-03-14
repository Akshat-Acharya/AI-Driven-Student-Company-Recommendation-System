import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
const session = await getServerSession(authOptions);
 console.log("UPLOAD SESSION:", session);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("resumes")
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const { data } = supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    const resumeUrl = data.publicUrl;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }

    await prisma.studentProfile.upsert({
      where: { userId: user.id },

      update: {
        resumeUrl,
      },

      create: {
        userId: user.id,
        fullName: user.name ?? "",
        resumeUrl,
        skills: [],
        projects: [],
      },
    });

    return NextResponse.json({
      resumeUrl,
      fileName,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
