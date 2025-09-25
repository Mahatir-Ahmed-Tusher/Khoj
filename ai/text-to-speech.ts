'use server';
/**
 * @fileOverview A Genkit flow to convert text to speech using a Gemini model.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import wav from 'wav';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audio: z.string().describe("Base64 encoded WAV audio data as a data URI."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeechFlow(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  const { media } = await ai.generate({
    model: googleAI.model('gemini-2.5-flash-preview-tts'),
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Algenib' },
        },
      },
    },
    prompt: input.text,
  });

  if (!media) {
    throw new Error('No media was returned from the TTS model.');
  }

  // The audio data is returned as a base64 encoded string in a data URI.
  // We need to extract the base64 part and convert the raw PCM data to WAV format.
  const audioBuffer = Buffer.from(
    media.url.substring(media.url.indexOf(',') + 1),
    'base64'
  );

  const wavBuffer = await toWav(audioBuffer);
  const audioDataUri = `data:audio/wav;base64,${wavBuffer.toString('base64')}`;
  
  return { audio: audioDataUri };
}

/**
 * Converts raw PCM audio data to WAV format.
 * @param pcmData The raw PCM audio data as a Buffer.
 * @returns A promise that resolves to the WAV data as a Buffer.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (chunk) => {
      bufs.push(chunk);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs));
    });

    writer.write(pcmData);
    writer.end();
  });
}
