'use server';
/**
 * @fileOverview An AI story chain companion that collaboratively guides children to add to a story, fostering imagination.
 *
 * - aiStoryChainCompanion - A function that handles the collaborative story writing process.
 * - StoryChainCompanionInput - The input type for the aiStoryChainCompanion function.
 * - StoryChainCompanionOutput - The return type for the aiStoryChainCompanion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StoryChainCompanionInputSchema = z.object({
  currentStory: z.string().describe('The entire story written so far, including previous AI and user contributions.'),
  userContribution: z.string().optional().describe('The child\'s latest addition to the story. This will be empty for the very first turn.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('easy').describe('The difficulty level, influencing the complexity of the AI\'s prompts and story segments.'),
});
export type StoryChainCompanionInput = z.infer<typeof StoryChainCompanionInputSchema>;

const StoryChainCompanionOutputSchema = z.object({
  nextStorySegment: z.string().describe('The AI\'s continuation of the story or a guiding prompt for the child to add the next part.'),
  isStoryComplete: z.boolean().describe('True if the AI believes the story has reached a natural conclusion and should end.'),
  feedback: z.string().optional().describe('Gentle and encouraging feedback on the child\'s contribution.'),
});
export type StoryChainCompanionOutput = z.infer<typeof StoryChainCompanionOutputSchema>;

export async function aiStoryChainCompanion(input: StoryChainCompanionInput): Promise<StoryChainCompanionOutput> {
  return aiStoryChainCompanionFlow(input);
}

const storyChainCompanionPrompt = ai.definePrompt({
  name: 'storyChainCompanionPrompt',
  input: { schema: StoryChainCompanionInputSchema },
  output: { schema: StoryChainCompanionOutputSchema },
  prompt: `You are an imaginative and encouraging AI assistant designed to collaboratively write stories with a child. Your goal is to foster creativity and provide a fun 'brain fog buster' activity.

Here's how we'll play:
- If the 'currentStory' is empty and 'userContribution' is also empty, you will begin a new, engaging story for the child. Provide only the first segment in 'nextStorySegment', set 'isStoryComplete' to false, and leave 'feedback' empty for this initial response.
- If 'currentStory' exists and 'userContribution' is provided, you will integrate the child's contribution into the ongoing narrative. Then, provide the next segment of the story OR a thoughtful, open-ended prompt for the child to continue.
- If 'userContribution' is provided, always give gentle, positive feedback on it, encouraging their creativity.
- You will decide if the story has reached a natural conclusion. If so, set 'isStoryComplete' to true and provide a concluding segment. Otherwise, set it to false.
- Keep story segments short and engaging, suitable for a child aged 6-12.
- Adjust the complexity of your prompts and story segments based on the 'difficulty' level. 'easy' means very simple, 'hard' means slightly more intricate.

Current Story so far:
{{{currentStory}}}

Child's latest contribution:
{{#if userContribution}}
{{{userContribution}}}
{{else}}
(No new contribution, please start the story)
{{/if}}

Difficulty Level: {{{difficulty}}}

Your turn to continue the story or provide a prompt, and give feedback:
`,
});

const aiStoryChainCompanionFlow = ai.defineFlow(
  {
    name: 'aiStoryChainCompanionFlow',
    inputSchema: StoryChainCompanionInputSchema,
    outputSchema: StoryChainCompanionOutputSchema,
  },
  async (input) => {
    const { output } = await storyChainCompanionPrompt(input);
    if (!output) {
      throw new Error('AI did not provide a story continuation.');
    }
    return output;
  }
);
