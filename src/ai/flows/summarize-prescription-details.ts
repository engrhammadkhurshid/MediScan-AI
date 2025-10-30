'use server';
/**
 * @fileOverview Summarizes the doctor's prescription details extracted from the OCR scan.
 *
 * - summarizePrescriptionDetails - A function that handles the summarization process.
 * - SummarizePrescriptionDetailsInput - The input type for the summarizePrescriptionDetails function.
 * - SummarizePrescriptionDetailsOutput - The return type for the summarizePrescriptionDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePrescriptionDetailsInputSchema = z.object({
  prescriptionText: z
    .string()
    .describe('The extracted text from the doctor handwritten prescription.'),
});
export type SummarizePrescriptionDetailsInput = z.infer<
  typeof SummarizePrescriptionDetailsInputSchema
>;

const SummarizePrescriptionDetailsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the prescription details.'),
});
export type SummarizePrescriptionDetailsOutput = z.infer<
  typeof SummarizePrescriptionDetailsOutputSchema
>;

export async function summarizePrescriptionDetails(
  input: SummarizePrescriptionDetailsInput
): Promise<SummarizePrescriptionDetailsOutput> {
  return summarizePrescriptionDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePrescriptionDetailsPrompt',
  input: {schema: SummarizePrescriptionDetailsInputSchema},
  output: {schema: SummarizePrescriptionDetailsOutputSchema},
  prompt: `You are a medical expert. Summarize the following doctor's prescription details into a concise and easy-to-understand summary:\n\nPrescription Details: {{{prescriptionText}}}`,
});

const summarizePrescriptionDetailsFlow = ai.defineFlow(
  {
    name: 'summarizePrescriptionDetailsFlow',
    inputSchema: SummarizePrescriptionDetailsInputSchema,
    outputSchema: SummarizePrescriptionDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
