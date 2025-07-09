import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: process.env.OPENAI_URI,
  apiKey: process.env.OPENROUTER_API_KEY,
});
