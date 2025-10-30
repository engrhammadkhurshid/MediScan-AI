'use server';

/**
 * @fileOverview An AI agent that analyzes a photo of a medicine and provides information about it.
 *
 * - analyzeMedicineImage - A function that handles the analysis of a medicine image.
 * - AnalyzeMedicineImageInput - The input type for the analyzeMedicineImage function.
 * - AnalyzeMedicineImageOutput - The return type for the analyzeMedicineImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMedicineImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a medicine, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // prettier-ignore
    ),
  query: z.string().describe('The question about the medicine.'),
});
export type AnalyzeMedicineImageInput = z.infer<typeof AnalyzeMedicineImageInputSchema>;

const AnalyzeMedicineImageOutputSchema = z.object({
  medicineInfo: z.string().describe('Information about the medicine.'),
});
export type AnalyzeMedicineImageOutput = z.infer<typeof AnalyzeMedicineImageOutputSchema>;

export async function analyzeMedicineImage(input: AnalyzeMedicineImageInput): Promise<AnalyzeMedicineImageOutput> {
  return analyzeMedicineImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMedicineImagePrompt',
  input: {schema: AnalyzeMedicineImageInputSchema},
  output: {schema: AnalyzeMedicineImageOutputSchema},
  prompt: `You are a helpful AI assistant. You are provided with a photo of a medicine and a question about the medicine.\nYou will use this information to answer the question about the medicine.

Question: {{{query}}}\nPhoto: {{media url=photoDataUri}}`,
});

const analyzeMedicineImageFlow = ai.defineFlow(
  {
    name: 'analyzeMedicineImageFlow',
    inputSchema: AnalyzeMedicineImageInputSchema,
    outputSchema: AnalyzeMedicineImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
