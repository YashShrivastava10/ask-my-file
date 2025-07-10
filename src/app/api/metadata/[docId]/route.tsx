import { fetchItem } from "@/lib/ddb";
import { errorResponse, getRelativeTime, successResponse } from "@/utils";
import { NextApiRequest } from "next";

export async function GET(
  request: NextApiRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const { docId } = await params;

    const result = await fetchItem({
      key: { docId },
      tableName: process.env.TABLE_NAME_DOCS!,
    });

    const { status, data, message } = result;

    if (!status) throw new Error(message);

    if (data)
      data.metadata.timeAgo = getRelativeTime(data.metadata.lastModified);

    return successResponse({
      data,
      message,
    });
  } catch (e) {
    if (e instanceof Error) return errorResponse({ message: e.message });
  }
}
