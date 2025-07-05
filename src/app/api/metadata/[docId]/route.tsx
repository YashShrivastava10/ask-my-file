import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const { docId } = await params;

    const filePath = path.join(process.cwd(), "src", "temp", `${docId}.json`);
    const fileContent = readFileSync(filePath, "utf-8");
    const { metadata } = JSON.parse(fileContent);

    return NextResponse.json({ sucess: true, metadata }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
