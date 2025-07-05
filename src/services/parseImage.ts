import { promises as fs } from "fs";

export default async function parseImageWithCleanup(
  buffer: Buffer,
  tempFilePath: string
): Promise<string> {
  try {
    // Save image temporarily for OCR
    await fs.writeFile(tempFilePath, buffer);
    const text = await parseImage(tempFilePath);
    // Clean up temp file
    await fs.unlink(tempFilePath);
    return text;
  } catch (error) {
    // Ensure cleanup even on error
    try {
      await fs.unlink(tempFilePath);
    } catch (cleanupError) {
      console.log(cleanupError);
      // Ignore cleanup errors
    }
    throw error;
  }
}

// Image OCR Parser with dynamic import
async function parseImage(imagePath: string): Promise<string> {
  try {
    const Tesseract = await import("tesseract.js");
    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, "eng", {
      logger: (m) => console.log(m), // Optional: log OCR progress
    });
    return text;
  } catch (error) {
    throw new Error(`OCR parsing failed: ${error}`);
  }
}
