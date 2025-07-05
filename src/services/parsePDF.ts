export default async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const pdf = await import("pdf-parse");
    const data = await pdf.default(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error}`);
  }
}
