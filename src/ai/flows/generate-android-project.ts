'use server';

/**
 * @fileOverview A flow that generates a complete Android Studio project based on a natural language command.
 *
 * - generateAndroidProject - A function that takes a natural language command and returns a complete Android Studio project.
 * - GenerateAndroidProjectInput - The input type for the generateAndroidProject function.
 * - GenerateAndroidProjectOutput - The return type for the generateAndroidProject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAndroidProjectInputSchema = z.object({
  command: z
    .string()
    .describe(
      'A natural language command describing the desired Android app (e.g., \'Create a Kotlin app with a login screen and Firebase Auth\').'
    ),
});
export type GenerateAndroidProjectInput = z.infer<typeof GenerateAndroidProjectInputSchema>;

const GenerateAndroidProjectOutputSchema = z.object({
  projectFiles: z.record(z.string(), z.string()).describe('A map of file paths to file contents for the generated Android Studio project.'),
});
export type GenerateAndroidProjectOutput = z.infer<typeof GenerateAndroidProjectOutputSchema>;

export async function generateAndroidProject(input: GenerateAndroidProjectInput): Promise<GenerateAndroidProjectOutput> {
  return generateAndroidProjectFlow(input);
}

const generateProjectPrompt = ai.definePrompt({
  name: 'generateProjectPrompt',
  input: {schema: GenerateAndroidProjectInputSchema},
  output: {schema: GenerateAndroidProjectOutputSchema},
  prompt: `You are an expert Android Studio code generator. When a user enters a prompt, generate a full Android Studio project using Java or Kotlin with all necessary files: Java/Kotlin source files, XML layouts, Manifest, Gradle files. Ensure each file is syntactically correct, logically structured, and complete.  Do not leave any missing references, variables, or unresolved components.

  User Command: {{{command}}}
  `,
});

const generateAndroidProjectFlow = ai.defineFlow(
  {
    name: 'generateAndroidProjectFlow',
    inputSchema: GenerateAndroidProjectInputSchema,
    outputSchema: GenerateAndroidProjectOutputSchema,
  },
  async input => {
    const {output} = await generateProjectPrompt(input);
    return output!;
  }
);
