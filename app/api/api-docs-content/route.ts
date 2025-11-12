import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * GET /api/api-docs-content
 * Serve the API documentation markdown content
 */
export async function GET() {
  try {
    const filePath = join(process.cwd(), "API_DOCS.md");
    const content = readFileSync(filePath, "utf-8");
    
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error reading API docs:", error);
    return NextResponse.json(
      {
        error: "Failed to load API documentation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

