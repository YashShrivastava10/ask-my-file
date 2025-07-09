import { generateS3UploadUrl } from "@/lib/s3";
import { errorResponse, successResponse } from "@/utils";
import { NextRequest } from "next/server";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { contentType, fileName } = await request.json();

    console.log(contentType);

    if (!(contentType && fileName))
      return errorResponse({
        message: "File name or Content type is missing",
        status: 400,
      });

    if (!(typeof contentType === "string" && typeof fileName === "string"))
      return errorResponse({
        message: "Incorrect type of file name or content type",
        status: 400,
      });

    const fileExtension = path.extname(fileName);
    const docId = `doc-${Date.now()}`;

    const fileLocation = `raw/${docId}${fileExtension}`;

    const uploadUrl = await generateS3UploadUrl({
      key: fileLocation,
      contentType,
    });

    return successResponse({
      data: { docId, uploadUrl },
      message: "File parsed successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return errorResponse({
      message: "Internal server error",
    });
  }
}
