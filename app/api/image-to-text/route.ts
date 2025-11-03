import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

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

    // Convert image to base64
    const imageBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    console.log("[ImageToText] Image converted to base64");

    // Call OpenRouter API with qwen2.5vl model
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": `${process.env.VERCEL_URL || "http://localhost:3000"}`,
          "X-Title": "Khoj - Image Text Extraction",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-maverick:free",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract all the text from this image, focusing on any news content, headlines, or important information. Return only the extracted text, no explanations needed. There might be spelling errors. Only focus on the text that could be a potential news content. Ignore other texts.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "[ImageToText] OpenRouter API error:",
        await response.text()
      );
      return NextResponse.json(
        { error: "Failed to extract text from image" },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("[ImageToText] Successfully extracted text from image");
    const extractedText = data.choices[0].message.content;

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error("[ImageToText] Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
