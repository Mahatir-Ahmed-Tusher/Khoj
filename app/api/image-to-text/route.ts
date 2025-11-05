import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Helper function to convert ArrayBuffer to base64 (Edge runtime compatible)
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function POST(req: NextRequest) {
  try {
    console.log("[ImageToText] Starting image-to-text conversion");
    const formData = await req.formData();
    const imageFile = formData.get("image") as Blob;

    if (!imageFile) {
      console.error("[ImageToText] No image file provided");
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Check if OPENROUTER_API_KEY is configured
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("[ImageToText] OPENROUTER_API_KEY not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Convert image to base64 (Edge runtime compatible)
    const imageBuffer = await imageFile.arrayBuffer();
    const base64Image = arrayBufferToBase64(imageBuffer);
    
    // Detect MIME type from the file, default to image/jpeg if not available
    const mimeType = imageFile.type || "image/jpeg";
    console.log("[ImageToText] Image converted to base64, MIME type:", mimeType);

    // Create AbortController for timeout handling (30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      // Call OpenRouter API with meta-llama/llama-4-scout:free model
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": `${process.env.VERCEL_URL || "http://localhost:3000"}`,
            "X-Title": "Khoj - Image Text Extraction",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "model": "meta-llama/llama-4-scout:free",
            "messages": [
              {
                "role": "user",
                "content": [
                  {
                    "type": "text",
                    "text": "Extract all the text from this image, focusing on any news content, headlines, or important information. Return only the extracted text, no explanations needed. There might be spelling errors. Only focus on the text that could be a potential news content. Ignore other texts.",
                  },
                  {
                    "type": "image_url",
                    "image_url": {
                      "url": `data:${mimeType};base64,${base64Image}`,
                    },
                  },
                ],
              },
            ],
            "max_tokens": 1000,
            "temperature": 0.3,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        console.error(
          "[ImageToText] OpenRouter API error:",
          response.status,
          response.statusText,
          errorData
        );
        return NextResponse.json(
          {
            error: "Failed to extract text from image",
            details: errorData.message || errorData.error?.message || "Unknown error",
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log("[ImageToText] OpenRouter API response received");

      // Validate response structure
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("[ImageToText] Invalid response structure:", data);
        return NextResponse.json(
          { error: "Invalid response from API" },
          { status: 500 }
        );
      }

      const extractedText = data.choices[0].message.content;

      if (!extractedText) {
        console.error("[ImageToText] No text content in response");
        return NextResponse.json(
          { error: "No text extracted from image" },
          { status: 500 }
        );
      }

      console.log("[ImageToText] Successfully extracted text from image");
      return NextResponse.json({ text: extractedText });
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        console.error("[ImageToText] Request timed out after 30 seconds");
        return NextResponse.json(
          {
            error: "Failed to extract text from image",
            details: "Request timed out",
          },
          { status: 408 }
        );
      }
      throw error; // Re-throw to be caught by outer catch
    }
  } catch (error: any) {
    console.error("[ImageToText] Error processing image:", error);
    return NextResponse.json(
      { 
        error: "Failed to process image",
        details: error?.message || String(error)
      },
      { status: 500 }
    );
  }
}

