
'use server';
/**
 * @fileOverview A Text-to-Speech (TTS) AI flow for audio instructions.
 *
 * - textToSpeech - A function that converts text to a base64 audio data URI.
 * - TTSInput - The input type for the textToSpeech function.
 * - TTSOutput - The return type for the textToSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const TTSInputSchema = z.string();
export type TTSInput = z.infer<typeof TTSInputSchema>;

const TTSOutputSchema = z.object({
  media: z.string().describe('Base64 encoded WAV audio data URI'),
});
export type TTSOutput = z.infer<typeof TTSOutputSchema>;

export async function textToSpeech(input: TTSInput): Promise<TTSOutput> {
  return ttsFlow(input);
}

const ttsFlow = ai.defineFlow(
  {
    name: 'ttsFlow',
    inputSchema: TTSInputSchema,
    outputSchema: TTSOutputSchema,
  },
  async (query) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      system: "You are a high-fidelity Text-to-Speech engine. Your ONLY task is to convert the provided text into audio. DO NOT generate any text response or explanations. Speak the input exactly as provided.",
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, // Puck is friendly and playful for kids
          },
        },
      },
      prompt: query,
    });

    if (!media || !media.url) {
      throw new Error('No audio media returned from Genkit');
    }

    // Extract the PCM data from the base64 URL
    const pcmBase64 = media.url.substring(media.url.indexOf(',') + 1);
    const pcmData = Buffer.from(pcmBase64, 'base64');

    // Convert raw PCM to WAV format so it can be played by browsers
    const wavBase64 = await toWav(pcmData);

    return {
      media: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

/**
 * Converts raw PCM data to WAV format using the wav package.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
