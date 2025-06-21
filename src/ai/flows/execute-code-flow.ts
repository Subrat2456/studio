'use server';
/**
 * @fileOverview A Genkit flow for simulating code execution.
 *
 * - executeCode - A function that simulates the execution of code.
 * - ExecuteCodeInput - The input type for the executeCode function.
 * - ExecuteCodeOutput - The return type for the executeCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExecuteCodeInputSchema = z.object({
  code: z.string().describe('The code to execute.'),
  language: z.string().describe('The programming language of the code (e.g., python, bash, javascript).'),
});
export type ExecuteCodeInput = z.infer<typeof ExecuteCodeInputSchema>;

const ExecuteCodeOutputSchema = z.object({
  output: z.string().describe('The simulated output of the code execution.'),
});
export type ExecuteCodeOutput = z.infer<typeof ExecuteCodeOutputSchema>;

export async function executeCode(input: ExecuteCodeInput): Promise<ExecuteCodeOutput> {
  return executeCodeFlow(input);
}

const executeCodePrompt = ai.definePrompt({
  name: 'executeCodePrompt',
  input: {schema: ExecuteCodeInputSchema},
  output: {schema: ExecuteCodeOutputSchema},
  prompt: `You are a code execution simulator. Given the following {{{language}}} code, predict its standard output.
If the code has no output, return an empty string.
Do not provide any explanation, preamble, or markdown formatting. Only return the raw text that would be printed to the console.

Code:
\`\`\`{{{language}}}
{{{code}}}
\`\`\`
`,
});

const executeCodeFlow = ai.defineFlow(
  {
    name: 'executeCodeFlow',
    inputSchema: ExecuteCodeInputSchema,
    outputSchema: ExecuteCodeOutputSchema,
  },
  async input => {
    const {output} = await executeCodePrompt(input);
    return output!;
  }
);
