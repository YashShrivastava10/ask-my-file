import { parseDocx, parsePDF } from "@/services";
import parseImageWithCleanup from "@/services/parseImage";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import os from "os";
import path from "path";

function detectDocumentType(
  text: string,
  filename: string
): "resume" | "mom" | "invoice" | "generic" {
  const lowerText = text.toLowerCase();

  if (
    filename.toLowerCase().includes("resume") ||
    (lowerText.includes("skills") &&
      lowerText.includes("experience") &&
      lowerText.includes("education"))
  ) {
    return "resume";
  }

  if (
    lowerText.includes("minutes of meeting") ||
    lowerText.includes("attendees") ||
    lowerText.includes("action items")
  ) {
    return "mom";
  }

  if (
    lowerText.includes("invoice") ||
    lowerText.includes("bill to") ||
    lowerText.includes("total amount")
  ) {
    return "invoice";
  }

  return "generic";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [".pdf", ".docx", ".txt", ".jpg", ".jpeg", ".png"];
    const fileExtension = path.extname(file.name).toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Accepted types: PDF, DOCX, TXT, JPG, JPEG, PNG",
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temporary file path
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${Date.now()}-${file.name}`);

    const parsers = {
      ".pdf": () => parsePDF(buffer),
      ".docx": () => parseDocx(buffer),
      ".txt": () => Promise.resolve(buffer.toString("utf-8")),
      ".jpg": () => parseImageWithCleanup(buffer, tempFilePath),
      ".jpeg": () => parseImageWithCleanup(buffer, tempFilePath),
      ".png": () => parseImageWithCleanup(buffer, tempFilePath),
    };

    let extractedText = "";

    try {
      const parser = parsers[fileExtension as keyof typeof parsers];

      if (!parser) {
        return NextResponse.json(
          {
            error: "Unsupported file type",
          },
          { status: 400 }
        );
      }

      extractedText = await parser();

      const docId = `doc-${Date.now()}`;
      const fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
      const fileName = file.name;
      const documentType = detectDocumentType(extractedText, fileName);

      const info = {
        docId,
        metadata: {
          fileSize,
          fileName,
          fileType: fileExtension,
          pages: 2, // Placeholder for pages
          uploadedAt: new Date(),
          documentType,
        },
        extractedText,
      };

      const dir = path.join(process.cwd(), "src", "temp");
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

      writeFileSync(
        path.join(dir, `${docId}.json`),
        JSON.stringify(info, null, 2),
        "utf-8"
      );

      return NextResponse.json({
        success: true,
        docId,
      });
    } catch (parseError) {
      console.error("Parsing error:", parseError);
      return NextResponse.json(
        {
          error: "Failed to parse file content",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
