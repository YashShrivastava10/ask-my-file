import { saveItem } from "@/lib/ddb";
import { generateFetchS3Url, uploadToS3 } from "@/lib/s3";
import { parseDocx, parsePDF } from "@/services";
import { errorResponse, successResponse } from "@/utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get("key");
    const fileName = searchParams.get("fileName");

    if (!key) return errorResponse({ message: "No key provided", status: 400 });

    if (!fileName)
      return errorResponse({ message: "No filename provided", status: 400 });

    const preSignedUrl = await generateFetchS3Url(key);

    const response = await fetch(preSignedUrl);

    if (!response.ok) {
      return errorResponse({
        message: "Failed to fetch from S3",
        status: response.status,
      });
    }

    const uploadedAt = response.headers.get("Last-Modified");
    const size = response.headers.get("Content-Length");
    const fileSize = size
      ? (Number(size) / (1024 * 1024)).toFixed(2) + " MB"
      : "Unkown";

    const fileInfo = key.split("/")[1].split(".");
    const docId = fileInfo[0];
    const fileExtension = fileInfo[1];

    const info = {
      docId,
      metadata: {
        fileSize,
        fileName,
        fileType: fileExtension,
        pages: 2, // Placeholder for pages
        uploadedAt,
        lastModified: uploadedAt,
      },
      s3_processed: `${process.env.PROCESSED}/${docId}.txt`,
      s3_raw: `${process.env.RAW}/${key.split("/")[1]}`,
    };

    const bytes = await response.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const parsers = {
      pdf: () => parsePDF(buffer),
      docx: () => parseDocx(buffer),
      txt: () => Promise.resolve(buffer.toString("utf-8")),
      // ".jpg": () => parseImageWithCleanup(buffer, tempFilePath),
      // ".jpeg": () => parseImageWithCleanup(buffer, tempFilePath),
      // ".png": () => parseImageWithCleanup(buffer, tempFilePath),
    };

    let extractedText = "";

    const parser = parsers[fileExtension as keyof typeof parsers];

    if (!parser) {
      return errorResponse({
        message: "Unsupported file type",
        status: 400,
      });
    }

    extractedText = await parser();

    await saveItem(info, process.env.TABLE_NAME_DOCS!);
    await uploadToS3({
      key: `${process.env.PROCESSED}/${docId}.txt`,
      body: extractedText,
      contentType: "text/plain",
    });

    return successResponse({ data: info, message: "File parsed successfully" });
  } catch (e) {
    if (e instanceof Error) return errorResponse({ message: e.message });
  }
}
