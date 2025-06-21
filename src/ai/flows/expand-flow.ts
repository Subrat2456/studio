'use server';
/**
 * @fileOverview A Genkit flow for expanding on a given text or topic.
 *
 * - expandText - A function that expands on the given text.
 * - ExpandTextInput - The input type for the expandText function.
 * - ExpandTextOutput - The return type for the expandText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpandTextInputSchema = z.object({
  text: z.string().describe('The text or topic to expand upon.'),
});
export type ExpandTextInput = z.infer<typeof ExpandTextInputSchema>;

const ExpandTextOutputSchema = z.object({
  expandedText: z.string().describe('The expanded version of the text.'),
});
export type ExpandTextOutput = z.infer<typeof ExpandTextOutputSchema>;

export async function expandText(input: ExpandTextInput): Promise<ExpandTextOutput> {
  return expandTextFlow(input);
}

const expandTextPrompt = ai.definePrompt({
  name: 'expandTextPrompt',
  input: {schema: ExpandTextInputSchema},
  output: {schema: ExpandTextOutputSchema},
  prompt: `You are an AI that expands on a given text or topic, adding more detail and information. Expand on the following.

  Original Text: {{{text}}}`,
});

const expandTextFlow = ai.defineFlow(
  {
    name: 'expandTextFlow',
    inputSchema: ExpandTextInputSchema,
    outputSchema: ExpandTextOutputSchema,
  },
  async input => {
    const {output} = await expandTextPrompt(input);
    return output!;
  }
);
