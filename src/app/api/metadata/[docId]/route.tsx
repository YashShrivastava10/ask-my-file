import { errorResponse, successResponse } from "@/utils";
import { readFileSync } from "fs";
import { NextApiRequest } from "next";
import path from "path";

export async function GET(
  request: NextApiRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const { docId } = await params;

    const filePath = path.join(process.cwd(), "src", "temp", `${docId}.json`);
    const fileContent = readFileSync(filePath, "utf-8");

    const { metadata } = JSON.parse(fileContent);

    return successResponse({
      data: metadata,
      message: "Metadata successfult fetched",
    });
  } catch (e) {
    if (e instanceof Error) return errorResponse({ message: e.message });
  }
}
