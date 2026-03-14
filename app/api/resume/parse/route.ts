import { NextResponse } from "next/server";
import { parseResume } from "@/lib/ai/resumeParser";
import PDFParser from "pdf2json";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const pdfParser = new PDFParser();

    const text = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", reject);

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        let extractedText = "";

        pdfData.Pages.forEach((page: any) => {
          page.Texts.forEach((text: any) => {
            text.R.forEach((t: any) => {
              try {
                extractedText += decodeURIComponent(t.T) + " ";
              } catch {
                extractedText += t.T + " ";
              }
            });
          });
        });

        resolve(extractedText);
      });

      pdfParser.parseBuffer(buffer);
    });

    const parsed = await parseResume(text);

    return NextResponse.json({
      parsed,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Resume parsing failed" },
      { status: 500 },
    );
  }
}
