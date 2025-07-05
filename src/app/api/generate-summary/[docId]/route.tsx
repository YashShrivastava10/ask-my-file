import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import path from "path";

const USER_PROMPT = {
  resume: `Please review and summarize the following resume output as markdown:`,

  mom: `Summarize this meeting. Extract key decisions, action items, and who is responsible for what. Mention any pending tasks. Provide a clear structured overview.`,

  invoice: `Summarize this invoice. Extract total amount, due date, sender/recipient, invoice number, and any notes. If anything seems missing or wrong, highlight it.`,

  generic: `Summarize the following document in a clear, concise, and structured way. Extract any key data points and provide a high-level overview.`,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const { docId } = await params;

    const filePath = path.join(process.cwd(), "src", "temp", `${docId}.json`);
    const fileContent = readFileSync(filePath, "utf-8");
    const { extractedText, metadata } = JSON.parse(fileContent);

    const { documentType } = metadata;

    const basePrompt =
      USER_PROMPT[documentType as keyof typeof USER_PROMPT] ||
      USER_PROMPT.generic;

    const user_prompt = `${basePrompt}\n---${extractedText}`.trim();

    const system_prompt = `Analyse below content and determine document type, based on identified document type assume below roles.\n\nresume: You are a professional hiring manager with deep expertise in evaluating resumes across technical and non-technical domains. Your role is to carefully analyze the resume provided by the user and:\n\n- Summarize key skills, work experience, projects, achievements, and education (if available)\n- Identify missing sections such as name, email, phone, location, or LinkedIn\n- Check for formatting issues, particularly inconsistent or incorrect date formats\n- Provide constructive, ATS - friendly suggestions to improve resume quality and impact.\nEnsure your response is well-structured, concise, and aligned with current hiring standards. Always aim to make the resume more effective and recruiter-friendly,\n\nminutes of meeting: Summarize this meeting. Extract key decisions, action items, and who is responsible for what. Mention any pending tasks. Provide a clear structured overview,\n\ninvoice: Summarize this invoice. Extract total amount, due date, sender/recipient, invoice number, and any notes. If anything seems missing or wrong, highlight it,\n\ngeneric: Summarize the following document in a clear, concise, and structured way. Extract any key data points and provide a high-level overview. Before surving user prompt prepend the identified document type in one line.`;

    const openai = new OpenAI({
      baseURL: process.env.OPENAI_URI,
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const chat = await openai.chat.completions.create({
      model: process.env.AI_MODEL!,
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: user_prompt },
      ],
      max_tokens: 10000,
      max_completion_tokens: 10000,
      // temperature: 0.2,
      // top_p: 1,
      // frequency_penalty: 0,
      // presence_penalty: 0,
    });

    console.log(system_prompt);
    console.log("User:", user_prompt);

    console.log(chat);
    return NextResponse.json(
      {
        success: true,
        result: { message: chat.choices[0].message, usage: chat.usage },
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
