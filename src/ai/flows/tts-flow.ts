
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
    try {
      // Use the specialized TTS model. 
      // We pass the query as a single text part to ensure the model treats it as a transcript.
      const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        prompt: query,
        config: {
          responseModalities: ['AUDIO'],
          // Safety settings set to BLOCK_NONE to prevent the model from generating 
          // text-based refusal messages which trigger 400 errors on this model.
          safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' },
          ],
          speechConfig: {
            voiceConfig: {
              // 'Achernar' is a clear, feminine voice suitable for instructions.
              prebuiltVoiceConfig: { voiceName: 'Achernar' }, 
            },
          },
        },
      });

      if (!media || !media.url) {
        throw new Error('No audio media returned from Genkit');
      }

      const pcmBase64 = media.url.substring(media.url.indexOf(',') + 1);
      const pcmData = Buffer.from(pcmBase64, 'base64');
      const wavBase64 = await toWav(pcmData);

      return {
        media: 'data:audio/wav;base64,' + wavBase64,
      };
    } catch (error: any) {
      console.error('Genkit TTS Generation failed:', error);
      throw new Error(`TTS failed: ${error.message || 'Unknown error'}`);
    }
  }
);

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
    writer.on('error', (err) => {
      console.error('Wav Writer Error:', err);
      reject(err);
    });
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
