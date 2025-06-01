
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
  prompt: `You are an expert Android Studio code generator. Your task is to generate a complete Android Studio project based on the user's command.
The output MUST be a JSON object matching the specified schema. Specifically, you must provide a 'projectFiles' array.
Each element in the 'projectFiles' array MUST be an object containing:
1.  A 'path' field: A non-empty string representing the full relative path of the file (e.g., 'app/src/main/java/com/example/MainActivity.java'). This field is mandatory.
2.  A 'content' field: A non-empty string containing the complete, raw text content of the file. This field is mandatory. Ensure the content is not truncated and includes all necessary imports, package declarations, and is syntactically correct.

Generate all necessary files: Java/Kotlin source files, XML layouts, AndroidManifest.xml, and Gradle build files (build.gradle, settings.gradle, etc.).
Ensure each file is logically structured and complete. Do not leave any missing references, variables, or unresolved components.
Pay close attention to providing BOTH 'path' and 'content' for EVERY file entry. Do not omit 'path' for any file. Do not truncate any file content.

User Command: {{{command}}}
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
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
