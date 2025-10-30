'use server';

/**
 * @fileOverview Answers questions about medicines, integrating trusted sources and analyzing user input for security.
 *
 * - answerMedicineQuestion - A function that handles answering questions about medicines.
 * - AnswerMedicineQuestionInput - The input type for the answerMedicineQuestion function.
 * - AnswerMedicineQuestionOutput - The return type for the answerMedicineQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerMedicineQuestionInputSchema = z.object({
  question:
    z.string()
      .describe('The question about a medicine.'),
});
export type AnswerMedicineQuestionInput = z.infer<typeof AnswerMedicineQuestionInputSchema>;

const AnswerMedicineQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the medicine.'),
});
export type AnswerMedicineQuestionOutput = z.infer<typeof AnswerMedicineQuestionOutputSchema>;

export async function answerMedicineQuestion(input: AnswerMedicineQuestionInput): Promise<AnswerMedicineQuestionOutput> {
  return answerMedicineQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerMedicineQuestionPrompt',
  input: {schema: AnswerMedicineQuestionInputSchema},
  output: {schema: AnswerMedicineQuestionOutputSchema},
  prompt: `You are a helpful chatbot that answers questions about medicines. You must only provide information related to medicines. If a user asks a question that is not related to medicines, you must deny the request.

Question: {{{question}}}`,
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

const answerMedicineQuestionFlow = ai.defineFlow(
  {
    name: 'answerMedicineQuestionFlow',
    inputSchema: AnswerMedicineQuestionInputSchema,
    outputSchema: AnswerMedicineQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
