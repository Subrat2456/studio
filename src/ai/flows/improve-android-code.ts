'use server';

/**
 * @fileOverview A flow to provide a code health score for a given Android code file.
 *
 * - improveAndroidCode - A function that takes Android code and returns a health score and suggestions.
 * - ImproveAndroidCodeInput - The input type for the improveAndroidCode function.
 * - ImproveAndroidCodeOutput - The return type for the improveAndroidCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveAndroidCodeInputSchema = z.object({
  code: z.string().describe('The Android code to be analyzed.'),
  fileType: z.enum(['java', 'kotlin', 'xml', 'gradle', 'manifest']).describe('The type of the code file.'),
});
export type ImproveAndroidCodeInput = z.infer<typeof ImproveAndroidCodeInputSchema>;

const ImproveAndroidCodeOutputSchema = z.object({
  healthScore: z.number().describe('A score from 0 to 100 representing the health of the code.'),
  suggestions: z.array(z.string()).describe('Suggestions for improving the code.'),
});
export type ImproveAndroidCodeOutput = z.infer<typeof ImproveAndroidCodeOutputSchema>;

export async function improveAndroidCode(input: ImproveAndroidCodeInput): Promise<ImproveAndroidCodeOutput> {
  return improveAndroidCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveAndroidCodePrompt',
  input: {schema: ImproveAndroidCodeInputSchema},
  output: {schema: ImproveAndroidCodeOutputSchema},
  prompt: `You are an expert Android code reviewer. You will be given a piece of Android code and your task is to provide a health score from 0 to 100 and suggestions for improving the code.

  The health score should be based on code quality, best practices, and potential for errors. It should be lower if there are any of the following:
  - Code smells
  - Potential bugs
  - Inefficient code
  - Poor readability
  - Lack of comments
  - Security vulnerabilities

  Suggestions should be specific and actionable. They should be based on best practices for the language of the given code ({{{fileType}}}), and provide guidance on how to improve the code's health.

  Here is the code:

  \`\`\`{{{fileType}}}
  {{{code}}}
  \`\`\`
  `,
});

const improveAndroidCodeFlow = ai.defineFlow(
  {
    name: 'improveAndroidCodeFlow',
    inputSchema: ImproveAndroidCodeInputSchema,
    outputSchema: ImproveAndroidCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
