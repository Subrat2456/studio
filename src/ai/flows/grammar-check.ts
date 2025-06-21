'use server';

/**
 * @fileOverview Implements automatic grammar and spell check using Genkit.
 *
 * - grammarCheck - A function that checks and corrects grammar and spelling in a given text.
 * - GrammarCheckInput - The input type for the grammarCheck function.
 * - GrammarCheckOutput - The return type for the grammarCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GrammarCheckInputSchema = z.object({
  text: z.string().describe('The text to check for grammar and spelling errors.'),
});
export type GrammarCheckInput = z.infer<typeof GrammarCheckInputSchema>;

const GrammarCheckOutputSchema = z.object({
  correctedText: z.string().describe('The text with grammar and spelling corrections applied.'),
  correctionsProposed: z
    .boolean()
    .describe('Whether or not the AI proposes any corrections to the text.'),
});
export type GrammarCheckOutput = z.infer<typeof GrammarCheckOutputSchema>;

export async function grammarCheck(input: GrammarCheckInput): Promise<GrammarCheckOutput> {
  return grammarCheckFlow(input);
}

const grammarCheckPrompt = ai.definePrompt({
  name: 'grammarCheckPrompt',
  input: {schema: GrammarCheckInputSchema},
  output: {schema: GrammarCheckOutputSchema},
  prompt: `You are an AI that automatically identifies grammar and spelling errors in a given text and suggest corrections.

  Original Text: {{{text}}}

  Apply necessary corrections and return the corrected text. Also, specify whether corrections were proposed or not.`,
});

const grammarCheckFlow = ai.defineFlow(
  {
    name: 'grammarCheckFlow',
    inputSchema: GrammarCheckInputSchema,
    outputSchema: GrammarCheckOutputSchema,
  },
  async input => {
    const {output} = await grammarCheckPrompt(input);
    return output!;
  }
);
