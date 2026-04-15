'use server';
/**
 * @fileOverview An AI Diary Buddy that interacts with children about their day.
 *
 * - aiDiaryBuddy - A function that handles the diary interaction.
 * - DiaryBuddyInput - The input type for the aiDiaryBuddy function.
 * - DiaryBuddyOutput - The return type for the aiDiaryBuddy function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiaryBuddyInputSchema = z.object({
  childName: z.string().optional().describe('The name of the child.'),
  diaryEntry: z.string().describe('The content the child has written so far.'),
  userMessage: z.string().optional().describe('A specific message or question from the child.'),
});
export type DiaryBuddyInput = z.infer<typeof DiaryBuddyInputSchema>;

const DiaryBuddyOutputSchema = z.object({
  buddyResponse: z.string().describe('The AI Buddy\'s warm, interactive response.'),
  reflectionPrompt: z.string().describe('A follow-up question to help the child reflect more deeply.'),
  moodEmoji: z.string().describe('An emoji representing the detected mood of the entry.'),
});
export type DiaryBuddyOutput = z.infer<typeof DiaryBuddyOutputSchema>;

export async function aiDiaryBuddy(input: DiaryBuddyInput): Promise<DiaryBuddyOutput> {
  return aiDiaryBuddyFlow(input);
}

const diaryBuddyPrompt = ai.definePrompt({
  name: 'diaryBuddyPrompt',
  input: { schema: DiaryBuddyInputSchema },
  output: { schema: DiaryBuddyOutputSchema },
  prompt: `You are a warm, supportive, and slightly magical AI Diary Buddy for a child named {{#if childName}}{{childName}}{{else}}Explorer{{/if}}. 

Your goal is to be a great listener. When the child writes in their diary:
1. Acknowledge what they shared with kindness.
2. Celebrate their wins, no matter how small.
3. Offer gentle comfort if they seem sad or frustrated.
4. Ask ONE thoughtful follow-up question to keep the conversation going.
5. Keep your language simple and engaging (suitable for ages 6-12).

Diary Entry:
{{{diaryEntry}}}

Child's Message:
{{#if userMessage}}{{{userMessage}}}{{else}}(Just writing in the diary){{/if}}

Provide your response, a reflection prompt, and a fun mood emoji.
`,
});

const aiDiaryBuddyFlow = ai.defineFlow(
  {
    name: 'aiDiaryBuddyFlow',
    inputSchema: DiaryBuddyInputSchema,
    outputSchema: DiaryBuddyOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await diaryBuddyPrompt(input);
      if (!output) throw new Error('AI output was empty');
      return output;
    } catch (error) {
      console.error('AI Diary Buddy failed:', error);
      return {
        buddyResponse: "That sounds like a very interesting day! I'm so glad you shared it with me.",
        reflectionPrompt: "What was the very best part of your whole day?",
        moodEmoji: "✨"
      };
    }
  }
);
