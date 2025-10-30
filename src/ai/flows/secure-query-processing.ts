'use server';

/**
 * @fileOverview A flow for securely processing user queries related to medicine information.
 *
 * - secureQueryProcessing - A function that analyzes user queries and prevents answering unrelated queries, providing only medicine-related information.
 * - SecureQueryProcessingInput - The input type for the secureQueryProcessing function.
 * - SecureQueryProcessingOutput - The return type for the secureQueryProcessing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SecureQueryProcessingInputSchema = z.object({
  query: z.string().describe('The user query to be processed.'),
});

export type SecureQueryProcessingInput = z.infer<typeof SecureQueryProcessingInputSchema>;

const SecureQueryProcessingOutputSchema = z.object({
  response: z.string().describe('The processed response to the user query.'),
});

export type SecureQueryProcessingOutput = z.infer<typeof SecureQueryProcessingOutputSchema>;

export async function secureQueryProcessing(input: SecureQueryProcessingInput): Promise<SecureQueryProcessingOutput> {
  return secureQueryProcessingFlow(input);
}

const secureQueryProcessingPrompt = ai.definePrompt({
  name: 'secureQueryProcessingPrompt',
  input: {schema: SecureQueryProcessingInputSchema},
  output: {schema: SecureQueryProcessingOutputSchema},
  prompt: `You are a helpful chatbot assistant designed to ONLY provide information related to medicines and medical prescriptions. If the user's query is not related to medicines, prescriptions, or medical information, you should respond with a default message saying, "I am designed to provide information only about medicines and medical prescriptions. Please ask a relevant question.".  Do not provide any other information or engage in any other type of conversation.

User Query: {{{query}}}`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const secureQueryProcessingFlow = ai.defineFlow(
  {
    name: 'secureQueryProcessingFlow',
    inputSchema: SecureQueryProcessingInputSchema,
    outputSchema: SecureQueryProcessingOutputSchema,
  },
  async input => {
    const {output} = await secureQueryProcessingPrompt(input);
    return output!;
  }
);
