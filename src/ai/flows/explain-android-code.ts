'use server';

/**
 * @fileOverview A code explanation AI agent for Android code.
 *
 * - explainAndroidCode - A function that handles the explanation of Android code.
 * - ExplainAndroidCodeInput - The input type for the explainAndroidCode function.
 * - ExplainAndroidCodeOutput - The return type for the explainAndroidCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainAndroidCodeInputSchema = z.object({
  code: z.string().describe('The Android code to explain.'),
  language: z.enum(['java', 'kotlin', 'xml', 'gradle', 'manifest']).describe('The language of the code.'),
});
export type ExplainAndroidCodeInput = z.infer<typeof ExplainAndroidCodeInputSchema>;

const ExplainAndroidCodeOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the code.'),
});
export type ExplainAndroidCodeOutput = z.infer<typeof ExplainAndroidCodeOutputSchema>;

export async function explainAndroidCode(input: ExplainAndroidCodeInput): Promise<ExplainAndroidCodeOutput> {
  return explainAndroidCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainAndroidCodePrompt',
  input: {schema: ExplainAndroidCodeInputSchema},
  output: {schema: ExplainAndroidCodeOutputSchema},
  prompt: `You are an expert Android code explainer. You will be given a section of Android code and your job is to explain what the code does.

  The code is written in the following language: {{{language}}}

  Here is the code:
  \`\`\`{{{language}}}
  {{{code}}}
  \`\`\`

  Explain the code in detail, describing what each part of the code does.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const explainAndroidCodeFlow = ai.defineFlow(
  {
    name: 'explainAndroidCodeFlow',
    inputSchema: ExplainAndroidCodeInputSchema,
    outputSchema: ExplainAndroidCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
