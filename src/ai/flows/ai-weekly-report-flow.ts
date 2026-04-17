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
  diaryEntries: z.number(),
  healthStatus: z.enum(['excellent', 'good', 'needs_attention']),
});

const WeeklyReportInputSchema = z.object({
  parentName: z.string(),
  children: z.array(ChildSummarySchema),
});
export type WeeklyReportInput = z.infer<typeof WeeklyReportInputSchema>;

const WeeklyReportOutputSchema = z.object({
  emailSubject: z.string().describe('A catchy, warm subject line for the email.'),
  emailBody: z.string().describe('The full HTML or text content of the report email, formatted with headers and bullet points.'),
  formalReportContent: z.string().describe('A formal, structured version of the report suitable for a PDF export.'),
});
export type WeeklyReportOutput = z.infer<typeof WeeklyReportOutputSchema>;

export async function generateWeeklyReport(input: WeeklyReportInput): Promise<WeeklyReportOutput> {
  return weeklyReportFlow(input);
}

const weeklyReportPrompt = ai.definePrompt({
  name: 'weeklyReportPrompt',
  input: { schema: WeeklyReportInputSchema },
  output: { schema: WeeklyReportOutputSchema },
  prompt: `You are the Kidsyee Digital Wellness Assistant. Your job is to write a weekly "Family Wellness Summary" and a formal "Digital Health PDF Report" for a parent named {{{parentName}}}.

You will be provided with a list of children and their stats for the week.

For each child, provide in the emailBody:
1. A warm summary of their digital activity.
2. A "Win of the Week" (e.g., great eye health missions, consistent diary use).
3. A gentle suggestion if their usage is high or missions are low.

For the formalReportContent (PDF Style):
- Header with "KIDSYEE WEEKLY WELLNESS REPORT"
- Date Range: Current Week
- Detailed sections for each child with their metrics.
- A "Parental Guidance" section with actionable advice based on the data.

Keep the tone encouraging, professional, and supportive. Use Markdown-style formatting.

Children Data:
{{#each children}}
- Name: {{name}}
- Screen Time: {{usageMinutes}} minutes
- Missions Done: {{missionsCompleted}}
- Diary Entries: {{diaryEntries}}
- Overall Status: {{healthStatus}}
{{/each}}

Generate the email subject, the warm body, and the formal report content.
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
        emailSubject: "Your Kidsyee Weekly Family Update 🛡️",
        emailBody: `Hi ${input.parentName},\n\nYour children are making great progress with their digital habits! Check your dashboard for the full breakdown.\n\nKeep up the great work!`,
        formalReportContent: "KIDSYEE WEEKLY WELLNESS REPORT\n\nSummary for the family of " + input.parentName + ".\n\nIndividual stats are currently being processed."
      };
    }
  }
);
