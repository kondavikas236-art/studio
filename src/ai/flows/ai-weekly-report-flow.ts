'use server';
/**
 * @fileOverview An AI agent that generates a consolidated weekly wellness report for parents.
 *
 * - generateWeeklyReport - A function that generates a comprehensive report for all children.
 * - WeeklyReportInput - The input type for the generateWeeklyReport function.
 * - WeeklyReportOutput - The return type for the generateWeeklyReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChildSummarySchema = z.object({
  name: z.string(),
  usageMinutes: z.number(),
  missionsCompleted: z.number(),
  healthStatus: z.enum(['excellent', 'good', 'needs_attention']),
});

const WeeklyReportInputSchema = z.object({
  parentName: z.string(),
  children: z.array(ChildSummarySchema),
});
export type WeeklyReportInput = z.infer<typeof WeeklyReportInputSchema>;

const WeeklyReportOutputSchema = z.object({
  emailSubject: z.string().describe('A catchy, warm subject line for the email.'),
  emailBody: z.string().describe('A warm, professional summary for the parent.'),
  formalReportContent: z.string().describe('A structured, easy-to-read report suitable for a PDF export.'),
});
export type WeeklyReportOutput = z.infer<typeof WeeklyReportOutputSchema>;

export async function generateWeeklyReport(input: WeeklyReportInput): Promise<WeeklyReportOutput> {
  return weeklyReportFlow(input);
}

const weeklyReportPrompt = ai.definePrompt({
  name: 'weeklyReportPrompt',
  input: { schema: WeeklyReportInputSchema },
  output: { schema: WeeklyReportOutputSchema },
  prompt: `You are the Kidsyee Eye Health Assistant. Your job is to write a weekly "Family Eye Wellness Summary" for a parent named {{{parentName}}}.

For the 'emailBody', write a warm and encouraging summary of the family's eye health progress this week. Address the parent directly and highlight the overall health of the digital environment.

For the 'formalReportContent', generate a structured breakdown for each child. Use clear labels and avoid complex markdown tables. Instead, use bulleted lists and headers.

Structure the 'formalReportContent' like this for each child:

- Child: [Name]
- Screen Time: [Minutes] (Add a short note if this is healthy or needs care)
- Eye Gym Missions: [Count] Completed
- Status: [Status]

Then, add a "Pro Tip" section at the end for the family regarding eye health and the 20-20-20 rule.

Keep the tone encouraging, professional, and supportive.

Children Data:
{{#each children}}
- Name: {{name}}
- Screen Time: {{usageMinutes}} minutes
- Missions Done: {{missionsCompleted}}
- Overall Status: {{healthStatus}}
{{/each}}
`,
});

const weeklyReportFlow = ai.defineFlow(
  {
    name: 'weeklyReportFlow',
    inputSchema: WeeklyReportInputSchema,
    outputSchema: WeeklyReportOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await weeklyReportPrompt(input);
      if (!output) throw new Error('AI output was empty');
      return output;
    } catch (error) {
      console.error('AI Weekly Report failed:', error);
      return {
        emailSubject: "Your Kidsyee Weekly Eye Health Update 🛡️",
        emailBody: `Hi ${input.parentName},\n\nYour children are making great progress with their eye health habits! Check your dashboard for the full breakdown.\n\nKeep up the great work!`,
        formalReportContent: "KIDSYEE WEEKLY EYE WELLNESS REPORT\n\nSummary for the family of " + input.parentName + ".\n\nIndividual stats are currently being processed."
      };
    }
  }
);
