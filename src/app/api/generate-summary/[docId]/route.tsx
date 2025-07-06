// import { SYSTEM_PROMPT, USER_PROMPT } from "@/constants";
// import { errorResponse } from "@/utils";
// import { readFileSync } from "fs";
// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";
// import path from "path";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ docId: string }> }
// ) {
//   try {
//     const { docId } = await params;

//     const filePath = path.join(process.cwd(), "src", "temp", `${docId}.json`);
//     const fileContent = readFileSync(filePath, "utf-8");
//     const { extractedText } = JSON.parse(fileContent);

//     const user_prompt = USER_PROMPT.replace(
//       "[[DOCUMENT_CONTENT_HERE]]",
//       extractedText
//     );

//     const openai = new OpenAI({
//       baseURL: process.env.OPENAI_URI,
//       apiKey: process.env.OPENROUTER_API_KEY,
//     });

//     // const chat = await openai.chat.completions.create({
//     //   model: process.env.AI_MODEL!,
//     //   messages: [
//     //     { role: "system", content: system_prompt },
//     //     { role: "user", content: user_prompt },
//     //   ],
//     // });

//     // const content = chat.choices[0].message.content;

//     // if (!content) return errorResponse({ message: "Content is empty" });

//     // let cleanedContent = content.trim();

//     // if (
//     //   cleanedContent.startsWith("```json") ||
//     //   cleanedContent.startsWith("```")
//     // ) {
//     //   cleanedContent = cleanedContent
//     //     .replace(/^```(?:json)?/, "")
//     //     .replace(/```$/, "")
//     //     .trim();
//     // }

//     // const parsed = JSON.parse(cleanedContent);
//     // const { role, summary } = parsed;

//     // return successResponse({
//     //   data: { summary, useage: chat.usage, role },
//     //   message: "Summary Generated",
//     // });

//     const stream = await openai.chat.completions.create({
//       model: process.env.AI_MODEL!,
//       stream: true,
//       messages: [
//         { role: "system", content: SYSTEM_PROMPT },
//         { role: "user", content: user_prompt },
//       ],
//     });

//     const encoder = new TextEncoder();

//     const readableStream = new ReadableStream({
//       async start(controller) {
//         try {
//           for await (const chunk of stream) {
//             const delta = chunk.choices?.[0]?.delta?.content;
//             if (delta) controller.enqueue(encoder.encode(delta));
//           }
//         } catch (err) {
//           console.log(err);
//           controller.enqueue(encoder.encode("\n\n[Stream error]"));
//         } finally {
//           controller.close();
//         }
//       },
//     });

//     return new NextResponse(readableStream, {
//       headers: {
//         "Content-Type": "text/plain; charset=utf-8",
//         "Cache-Control": "no-cache",
//       },
//     });
//   } catch (e) {
//     if (e instanceof Error)
//       return errorResponse({ message: e.message, status: 500 });
//   }
// }

import { SYSTEM_PROMPT, USER_PROMPT } from "@/constants";
import { errorResponse } from "@/utils";
import { readFileSync, writeFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const { docId } = await params;

    const filePath = path.join(process.cwd(), "src", "temp", `${docId}.json`);
    const fileContent = readFileSync(filePath, "utf-8");
    const parsedFile = JSON.parse(fileContent);
    const { extractedText, summary, role } = parsedFile;

    // If already summarized, return early
    if (summary && role) {
      return NextResponse.json({
        data: { summary, role },
        message: "Already summarized",
      });
    }

    const user_prompt = USER_PROMPT.replace(
      "[[DOCUMENT_CONTENT_HERE]]",
      extractedText
    );

    const openai = new OpenAI({
      baseURL: process.env.OPENAI_URI,
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const stream = await openai.chat.completions.create({
      model: process.env.AI_MODEL!,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: user_prompt },
      ],
    });

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

          // Once streaming is done, clean and parse the content
          try {
            let cleaned = fullContent.trim();
            if (cleaned.startsWith("```json") || cleaned.startsWith("```")) {
              cleaned = cleaned
                .replace(/^```(?:json)?/, "")
                .replace(/```$/, "")
                .trim();
            }

            const parsed = JSON.parse(cleaned);
            const { role, summary } = parsed;

            // Save back to the file
            const updated = {
              ...parsedFile,
              role,
              summary,
            };

            writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
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
    if (e instanceof Error)
      return errorResponse({ message: e.message, status: 500 });
  }
}
