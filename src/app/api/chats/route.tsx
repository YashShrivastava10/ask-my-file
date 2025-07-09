import { fetchAllItems } from "@/lib/ddb";
import { errorResponse, successResponse } from "@/utils";

export async function GET() {
  try {
    const result = await fetchAllItems(process.env.TABLE_NAME_DOCS!);

    const { status, message, data } = result;
    if (!status) return errorResponse({ message });

    if (!data || !data.length)
      return successResponse({ data: [], message: "No Items found" });

    return successResponse({
      data,
      message: "Chats fetched successfully",
    });
  } catch (e) {
    if (e instanceof Error) return errorResponse({ message: e.message });
  }
}
