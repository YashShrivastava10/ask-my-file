import { parseDocx, parsePDF } from "@/services";
import parseImageWithCleanup from "@/services/parseImage";
import { errorResponse, successResponse } from "@/utils";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { NextRequest } from "next/server";
import os from "os";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse({ message: "No file provided", status: 400 });
    }

    const allowedTypes = [".pdf", ".docx", ".txt", ".jpg", ".jpeg", ".png"];
    const fileExtension = path.extname(file.name).toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      return errorResponse({
        message:
          "Invalid file type. Accepted types: PDF, DOCX, TXT, JPG, JPEG, PNG",
        status: 400,
      });
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
        return errorResponse({
          message: "Unsupported file type",
          status: 400,
        });
      }

      extractedText = await parser();

      const docId = `doc-${Date.now()}`;
      const fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
      const fileName = file.name;

      const currentTime = new Date();
      const info = {
        docId,
        metadata: {
          fileSize,
          fileName,
          fileType: fileExtension,
          pages: 2, // Placeholder for pages
          uploadedAt: currentTime,
          lastModified: currentTime,
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

      return successResponse({
        data: { docId },
        message: "File parsed successfully",
      });
    } catch (parseError) {
      console.error("Parsing error:", parseError);
      return errorResponse({ message: "Failed to parse" });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return errorResponse({
      message: "Internal server error",
    });
  }
}
