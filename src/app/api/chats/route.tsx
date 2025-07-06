import { errorResponse, getRelativeTime, successResponse } from "@/utils";
import { existsSync, readdirSync, readFileSync } from "fs";
import path from "path";
import removeMarkdown from "remove-markdown";

export async function GET() {
  try {
    const tempDir = path.join(process.cwd(), "src", "temp");

    if (!existsSync(tempDir)) {
      return successResponse({
        data: [],
        message: "No chats found",
      });
    }

    const files = readdirSync(tempDir);

    const chats = files.map((fileName) => {
      const filePath = path.join(tempDir, fileName);
      const content = readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);

      const { docId, metadata, summary } = parsed;
      const fullSummary = summary ?? "";
      const plainSummary = removeMarkdown(fullSummary)
        .replace(/\s+/g, " ")
        .trim();

      const charLimit = 100;
      const summaryPreview =
        plainSummary.length > charLimit
          ? plainSummary.slice(0, charLimit) + "..."
          : plainSummary;

      const { lastModified, fileName: name } = metadata;
      const timeAgo = getRelativeTime(lastModified);

      return {
        docId,
        title: name,
        timeAgo,
        summary: summaryPreview,
      };
    });

    return successResponse({
      data: chats,
      message: "Chats fetched successfully",
    });
  } catch (e) {
    if (e instanceof Error) return errorResponse({ message: e.message });
  }
}
