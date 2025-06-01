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

const FileEntrySchema = z.object({
  path: z.string().describe("The full path of the file, including directories and the file name with extension (e.g., 'app/src/main/java/com/example/MainActivity.java'). This path should be relative to the project root."),
  content: z.string().describe("The complete, raw text content of the file. Ensure all necessary imports, package declarations, and syntax are correct and complete."),
});

const GenerateAndroidProjectOutputSchema = z.object({
  projectFiles: z.array(FileEntrySchema)
    .min(1, "The project must contain at least one file.")
    .describe('A list of all files in the generated Android Studio project. Each item in the list must be an object containing the file path and its corresponding content.'),
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
