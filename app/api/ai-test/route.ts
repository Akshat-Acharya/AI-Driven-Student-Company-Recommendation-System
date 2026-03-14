import { NextResponse } from "next/server";
import { testModel } from "@/lib/ai/testModel";

export async function GET() {
  try {
    const result = await testModel();

    return NextResponse.json({
      message: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}