import { SYSTEM_PROMPT, USER_PROMPT } from "@/constants";
import { fetchItem, updateItem } from "@/lib/ddb";
import { openai } from "@/lib/openai";
import { generateFetchS3Url, uploadToS3 } from "@/lib/s3";
import { errorResponse, successResponse } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

// Flow:
// Fetch items from DB
// use s3_summary to check if summary already exist:
// If Exist, send summary, no need to re-generate
// else generate summary using s3_processed
// store summary to summary folder in bucket
// update the role and 2 lines of summary in dynamodb

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const { docId } = await params;

    // Step 1: Fetch metadata from DB
    const { data, status, message } = await fetchItem({
      key: { docId },
      tableName: process.env.TABLE_NAME_DOCS!,
    });

    if (!status || !data) return errorResponse({ message });

    // Step 2: Check if summary already exists in S3
    try {
      const summaryUrl = await generateFetchS3Url(data.s3_summary);

      const summaryRes = await fetch(summaryUrl);

      if (summaryRes.ok) {
        const summary = await summaryRes.text();
        return successResponse({
          data: { summary },
          message: "Already summarized",
        });
      }
    } catch (e) {
      console.log(e);
      // Summary doesn't exist, continue to generate
    }

    // Step 3: Fetch processed text
    const processedUrl = await generateFetchS3Url(data.s3_processed);
    const processedRes = await fetch(processedUrl);
    if (!processedRes.ok) {
      return errorResponse({
        message: "Failed to fetch from S3",
        status: processedRes.status,
      });
    }
    const processedText = await processedRes.text();

    // Step 4: Prepare OpenAI prompt
    const userPrompt = USER_PROMPT.replace(
      "[[DOCUMENT_CONTENT_HERE]]",
      processedText
    );

    const stream = await openai.chat.completions.create({
      model: process.env.AI_MODEL!,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    // Step 5: Stream + Extract + Upload
    const encoder = new TextEncoder();
    let fullContent = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices?.[0]?.delta?.content || "";
            fullContent += delta;
            controller.enqueue(encoder.encode(delta));
          }
        } catch (err) {
          console.error("Stream error:", err);
          controller.enqueue(encoder.encode("\n\n[Stream error]"));
        } finally {
          controller.close();

          try {
            let cleaned = fullContent.trim();
            if (cleaned.startsWith("```json") || cleaned.startsWith("```")) {
              cleaned = cleaned
                .replace(/^```(?:json)?/, "")
                .replace(/```$/, "")
                .trim();
            }
            const { role, summary } = JSON.parse(cleaned);

            const s3Key = `${process.env.SUMMARY}/${docId}.txt`;

            await uploadToS3({
              key: s3Key,
              contentType: "text/plain",
              body: summary,
            });

            await updateItem({
              key: { docId },
              tableName: process.env.TABLE_NAME_DOCS!,
              updates: {
                s3_summary: s3Key,
                role,
                summary: summary.slice(0, 200),
              },
            });
          } catch (err) {
            console.error("Failed to parse and write summary:", err);
          }
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    console.error("Fatal error:", e);
    return errorResponse({ message: "Internal server error", status: 500 });
  }
}
