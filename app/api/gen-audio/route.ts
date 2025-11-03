import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import wav from "wav";

// Define types for request/response structures
interface RequestBody {
  text: string;
  voice?: string;
}

interface GenKitResponse {
  media?: {
    url?: string;
  };
}

interface AudioResponse {
  audioContent: string;
  contentType: string;
}

// Initialize Genkit with Google AI plugin
const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    }),
  ],
});

/**
 * Server route: POST /api/gen-audio
 * Accepts { text: string, voice?: string }
 * Uses Genkit / Gemini TTS (gemini-2.5-flash-preview-tts) for free audio generation.
 * Converts returned PCM data to WAV and returns base64 WAV with contentType.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!body?.text || typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `text` in request body" },
        { status: 400 }
      );
    }

    const text = body.text;
    const voiceName = body.voice || "Algenib";

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Google API key not configured on server. Set GEMINI_API_KEY or GOOGLE_API_KEY in env.",
        },
        { status: 501 }
      );
    }

    const modelName = "gemini-2.5-flash-preview-tts";

    // Try GenKit / Gemini TTS first. If it fails or returns no audio, fall back
    // to the classic Google Cloud Text-to-Speech v1 endpoint (MP3) using the
    // same API key. The GenKit/GenAI client may produce payload shapes that
    // mismatch the API; catch errors and continue to fallback.
    let mediaUrl: string | undefined;
    try {
      const response = (await ai.generate({
        model: googleAI.model ? googleAI.model(modelName) : modelName,
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
        prompt: text,
      })) as GenKitResponse;

      mediaUrl = response?.media?.url;
    } catch (genErr: any) {
      // Log and continue to fallback
      console.warn(
        "GenKit TTS attempt failed:",
        genErr instanceof Error ? genErr.message : String(genErr)
      );
      mediaUrl = undefined;
    }

    // If GenKit did not produce a valid media URL, call the Google
    // Text-to-Speech v1 synthesize endpoint (MP3) as a reliable fallback.
    if (!mediaUrl || typeof mediaUrl !== "string") {
      try {
        const fallbackPayload = {
          input: { text },
          voice: { languageCode: "bn-BD", name: voiceName },
          audioConfig: { audioEncoding: "MP3" },
        };

        const resp = await fetch(
          `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fallbackPayload),
          }
        );

        if (!resp.ok) {
          const textErr = await resp.text().catch(() => "");
          return NextResponse.json(
            { error: "TTS provider error", details: textErr },
            { status: resp.status }
          );
        }

        const data = await resp.json();
        return NextResponse.json({
          audioContent: data.audioContent,
          contentType: "audio/mpeg",
        });
      } catch (fallbackErr: any) {
        console.error(
          "Fallback TTS error:",
          fallbackErr instanceof Error
            ? fallbackErr.message
            : String(fallbackErr)
        );
        return NextResponse.json(
          { error: "TTS generation failed" },
          { status: 500 }
        );
      }
    }

    // mediaUrl is a data URL (e.g., data:audio/L16;rate=24000;channels=1;base64,<b64>)
    const comma = mediaUrl.indexOf(",");
    if (comma === -1) {
      return NextResponse.json(
        { error: "Invalid audio data format" },
        { status: 500 }
      );
    }

    const b64 = mediaUrl.substring(comma + 1);
    const pcmBuffer = Buffer.from(b64, "base64");

    // Convert PCM to WAV
    const wavBuffer: Buffer = await new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels: 1,
        sampleRate: 24000,
        bitDepth: 16,
      });
      const bufs: Buffer[] = [];
      writer.on("data", (d: Buffer) => bufs.push(d));
      writer.on("finish", () => resolve(Buffer.concat(bufs)));
      writer.on("error", reject);
      writer.write(pcmBuffer);
      writer.end();
    });

    return NextResponse.json({
      audioContent: wavBuffer.toString("base64"),
      contentType: "audio/wav",
    });
  } catch (err: any) {
    console.error("GenKit TTS error:", err.message || String(err));
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
