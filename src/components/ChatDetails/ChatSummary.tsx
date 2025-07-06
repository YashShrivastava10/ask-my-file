"use client";

import MarkdownIt from "markdown-it";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Card } from "../ui";

type Props = {
  docId: string;
};

const md = new MarkdownIt({
  html: false,
  breaks: true, // This requires real newline characters, not escaped \\n
  linkify: true,
});

/**
 * A robust way to un-escape a string that was part of a JSON object.
 * It handles \\n, \\", \\t, etc., by wrapping the string in quotes
 * and using the browser's native JSON parser.
 * @param str The escaped string content.
 * @returns The un-escaped string.
 */
function unescapeJsonString(str: string): string {
  try {
    // The wrapping in quotes is essential for JSON.parse to work on a raw string.
    return JSON.parse(`"${str}"`);
  } catch (e) {
    // If parsing fails, return the string as-is.
    console.log(e);
    return str;
  }
}

export const ChatSummary = ({ docId }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchStream = async () => {
      // Reset all states
      setContent("");
      setIsStreaming(false);
      setError(null);

      let buffer = "";

      try {
        const res = await fetch(`/api/generate-summary/${docId}`, { signal });
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const contentType = res.headers.get("Content-Type") || "";

        if (contentType.includes("application/json")) {
          const json = await res.json();
          setContent(json.data?.summary || "");

          return;
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("Failed to get readable stream.");

        setIsStreaming(true);
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // --- LIVE RENDERING LOGIC ---
          const summaryStartIndex = buffer.indexOf('"summary"');
          if (summaryStartIndex !== -1) {
            // Find the start of the summary's value (after the colon and quote)
            const valueStartIndex =
              buffer.indexOf('"', summaryStartIndex + 9) + 1;
            if (valueStartIndex > 0) {
              // Get the partial summary content
              const partialSummary = buffer.substring(valueStartIndex);
              // Un-escape it for correct markdown rendering
              setContent(unescapeJsonString(partialSummary));
            }
          }
        }

        // --- FINAL PARSE LOGIC ---
        // The stream is complete. The buffer now contains the full text.
        // Let's use safer methods to extract the final, clean data.

        // Define regex for final extraction
        const roleRegex = /"role"\s*:\s*"([^"]*)"/;
        const summaryRegex = /"summary"\s*:\s*"((?:\\.|[^"\\])*)"/;

        const roleMatch = buffer.match(roleRegex);
        const summaryMatch = buffer.match(summaryRegex);

        if (roleMatch && roleMatch[1]) {
        }

        if (summaryMatch && summaryMatch[1]) {
          // The captured group is the clean, escaped summary string.
          // We un-escape it to get the final, pure markdown.
          const finalSummary = unescapeJsonString(summaryMatch[1]);
          setContent(finalSummary);
        } else if (!content) {
          setError("Failed to parse the final summary from the data stream.");
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            return;
          }
          setError(`Failed to load summary. ${err.message}`);
        } else {
          setError(`An unexpected error occurred: ${String(err)}`);
        }
      } finally {
        setIsStreaming(false);
      }
    };

    if (docId) fetchStream();
    else {
      setContent("");
    }

    return () => controller.abort();
  }, [docId]);

  const htmlContent = content ? md.render(content) : "";

  return (
    <div className="space-y-2 p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Summary</h3>
      </div>

      <Card ref={containerRef}>
        {htmlContent ? (
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <p className={error ? "text-red-500" : "text-muted-foreground"}>
            {error
              ? error
              : isStreaming
              ? "Generating..."
              : "Generating summary..."}
          </p>
        )}
      </Card>
    </div>
  );
};
