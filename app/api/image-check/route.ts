import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

// Function to upload image to Imgur and get URL
async function uploadToImgur(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  // Convert buffer to base64
  const base64Image = imageBuffer.toString("base64");

  // Upload to Imgur using the same public client ID as image-search
  const response = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: "Client-ID 546c25a59c58ad7", // Imgur public client ID (same as image-search)
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: base64Image,
      type: "base64",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to upload to Imgur");
  }

  const data = await response.json();
  if (data.success) {
    return data.data.link;
  } else {
    throw new Error("Failed to upload to Imgur");
  }
}

// Function to generate English report using OpenRouter
async function generateEnglishReport(
  imageUrl: string,
  sightengineResult: any
): Promise<string> {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterApiKey) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }

  const aiGeneratedScore = sightengineResult.type?.ai_generated || 0;
  const isAIGenerated = aiGeneratedScore >= 0.4;

  const prompt = isAIGenerated
    ? `This image has been identified as AI-generated (Sightengine score: ${(aiGeneratedScore * 100).toFixed(1)}%). Analyze the image and explain in English why it appears to be AI-generated. Examine various features like colors, lighting, shadows, textures, and other visual elements to describe the signs that indicate AI generation.`
    : `This image has been identified as a real photograph (Sightengine score: ${(aiGeneratedScore * 100).toFixed(1)}%). Analyze the image and explain in English why it appears to be a genuine photograph. Examine various features like colors, lighting, shadows, textures, and other visual elements to describe the characteristics that indicate it's a real image.`;

  try {
    const requestBody = {
      model: "qwen/qwen2.5-vl-32b-instruct:free",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    };

    console.log(
      "OpenRouter request body:",
      JSON.stringify(requestBody, null, 2)
    );
    console.log("Image URL:", imageUrl);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          "HTTP-Referer": "https://khoj-bd.com",
          "X-Title": "Khoj Fact Checker",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("OpenRouter response:", JSON.stringify(response.data, null, 2));

    if (
      response.data.choices &&
      response.data.choices[0] &&
      response.data.choices[0].message
    ) {
      return response.data.choices[0].message.content;
    } else {
      console.error("Unexpected OpenRouter response structure:", response.data);
      throw new Error("No response from OpenRouter");
    }
  } catch (error: any) {
    console.error("OpenRouter API error:", error);
    if (error.response) {
      console.error("OpenRouter error response:", error.response.data);
    }
    throw new Error("Failed to generate English report");
  }
}

// Function to translate English report to Bengali using Gemini
async function translateToBengali(englishReport: string): Promise<string> {
  const geminiApiKey = process.env.GEMINI_API_KEY_2;
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY_2 not configured");
  }

  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Translate the following English image analysis report to natural, fluent Bengali. Make sure the translation is easy to understand and sounds natural in Bengali. Keep the technical accuracy but make it conversational and clear for Bengali readers.

English Report:
${englishReport}

Please provide only the Bengali translation, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini translation error:", error);
    throw new Error("Failed to translate to Bengali");
  }
}

// New endpoint for generating reports on demand
export async function PUT(request: NextRequest) {
  try {
    const { imageUrl, sightengineResult } = await request.json();

    if (!imageUrl || !sightengineResult) {
      return NextResponse.json(
        { error: "Image URL and Sightengine result are required" },
        { status: 400 }
      );
    }

    try {
      console.log("Generating English report with OpenRouter...");
      const englishReport = await generateEnglishReport(
        imageUrl,
        sightengineResult
      );
      console.log(
        "English report generated, translating to Bengali with Gemini..."
      );
      const bengaliReport = await translateToBengali(englishReport);
      console.log("Bengali report generated successfully");

      return NextResponse.json({
        success: true,
        bengaliReport,
      });
    } catch (reportError) {
      console.error("Report generation failed:", reportError);
      return NextResponse.json(
        { error: "Failed to generate report" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const imageUrl = formData.get("imageUrl") as string;

    if (!imageFile && !imageUrl) {
      return NextResponse.json(
        { error: "Either image file or image URL is required" },
        { status: 400 }
      );
    }

    const apiUser = process.env.SIGHTENGINE_API_USER;
    const apiSecret = process.env.SIGHTENGINE_API_SECRET;

    if (!apiUser || !apiSecret) {
      return NextResponse.json(
        { error: "Sightengine API credentials not configured" },
        { status: 500 }
      );
    }

    let response;
    let imageUrlForReport = imageUrl;

    if (imageUrl) {
      // Option 1: Send image URL
      response = await axios.get("https://api.sightengine.com/1.0/check.json", {
        params: {
          url: imageUrl,
          models: "genai",
          api_user: apiUser,
          api_secret: apiSecret,
        },
      });
    } else {
      // Option 2: Send raw image
      const form = new FormData();
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      form.append("media", buffer, {
        filename: imageFile.name,
        contentType: imageFile.type,
      });
      form.append("models", "genai");
      form.append("api_user", apiUser);
      form.append("api_secret", apiSecret);

      response = await axios.post(
        "https://api.sightengine.com/1.0/check.json",
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
        }
      );

      // Upload to Imgur for OpenRouter access
      try {
        imageUrlForReport = await uploadToImgur(buffer, imageFile.name);
      } catch (imgurError) {
        console.error("Imgur upload failed:", imgurError);
        // Continue without the report if Imgur fails
      }
    }

    const result = response.data;

    if (result.status === "success") {
      const aiGeneratedScore = result.type?.ai_generated || 0;

      // Determine the result based on the score
      let verdict = "unverified";
      let confidence = "low";
      let explanation = "";

      if (aiGeneratedScore >= 0.8) {
        verdict = "true";
        confidence = "high";
        explanation = "এই ছবিটি AI দ্বারা তৈরি হওয়ার সম্ভাবনা খুব বেশি।";
      } else if (aiGeneratedScore >= 0.6) {
        verdict = "true";
        confidence = "medium";
        explanation = "এই ছবিটি AI দ্বারা তৈরি হওয়ার সম্ভাবনা বেশি।";
      } else if (aiGeneratedScore >= 0.4) {
        verdict = "misleading";
        confidence = "medium";
        explanation = "এই ছবিটি AI দ্বারা তৈরি হওয়ার কিছু লক্ষণ দেখা যাচ্ছে।";
      } else if (aiGeneratedScore >= 0.2) {
        verdict = "false";
        confidence = "medium";
        explanation = "এই ছবিটি AI দ্বারা তৈরি হওয়ার সম্ভাবনা কম।";
      } else {
        verdict = "false";
        confidence = "high";
        explanation = "এই ছবিটি AI দ্বারা তৈরি হওয়ার সম্ভাবনা খুব কম।";
      }

      // Don't generate report automatically - only when requested

      return NextResponse.json({
        success: true,
        verdict,
        confidence,
        explanation,
        aiGeneratedScore,
        requestId: result.request?.id,
        mediaId: result.media?.id,
        imageUrl: imageUrlForReport, // Include image URL for report generation
      });
    } else {
      return NextResponse.json(
        { error: "API request failed", details: result },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Image check error:", error);

    if (error.response) {
      return NextResponse.json(
        { error: "API request failed", details: error.response.data },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
