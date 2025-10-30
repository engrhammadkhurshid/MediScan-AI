'use server'

import { z } from 'zod'
import {
  analyzeMedicineImage,
  type AnalyzeMedicineImageInput,
  type AnalyzeMedicineImageOutput,
} from '@/ai/flows/analyze-medicine-image'
import {
  summarizePrescriptionDetails,
  type SummarizePrescriptionDetailsInput,
  type SummarizePrescriptionDetailsOutput,
} from '@/ai/flows/summarize-prescription-details'
import {
  secureQueryProcessing,
  type SecureQueryProcessingInput,
} from '@/ai/flows/secure-query-processing'
import {
  answerMedicineQuestion,
  type AnswerMedicineQuestionInput,
} from '@/ai/flows/answer-medicine-questions'

// Helper to check if error is related to API key
function isApiKeyError(error: any): boolean {
  const errorMessage = error.message?.toLowerCase() || ''
  return (
    errorMessage.includes('api key') ||
    errorMessage.includes('authentication') ||
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('invalid api key') ||
    errorMessage.includes('api_key_invalid') ||
    !process.env.GOOGLE_GENAI_API_KEY ||
    !process.env.GEMINI_API_KEY
  )
}

// Helper to convert File to Data URI
async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return `data:${file.type};base64,${buffer.toString('base64')}`
}

const ScanResultSchema = z.object({
  transcription: z.string().optional(),
  summary: z.string().optional(),
  error: z.string().optional(),
  isApiKeyError: z.boolean().optional(),
})
type ScanResult = z.infer<typeof ScanResultSchema>

export async function scanPrescription(
  prevState: any,
  formData: FormData
): Promise<ScanResult> {
  const file = formData.get('image') as File
  if (!file || file.size === 0) {
    return { error: 'Please provide an image of a prescription.' }
  }

  try {
    const photoDataUri = await fileToDataUri(file)

    // Step 1: Transcribe the prescription
    const transcriptionInput: AnalyzeMedicineImageInput = {
      photoDataUri,
      query:
        "Transcribe all text from this handwritten prescription. Focus on medicine names, dosages, and instructions. If the image is not a prescription, state that clearly. The output should be only the transcribed text.",
    }
    const transcriptionResult: AnalyzeMedicineImageOutput = await analyzeMedicineImage(transcriptionInput)
    const transcriptionText = transcriptionResult.medicineInfo

    // Step 2: Summarize the transcribed text
    const summaryInput: SummarizePrescriptionDetailsInput = {
      prescriptionText: transcriptionText,
    }
    const summaryResult: SummarizePrescriptionDetailsOutput = await summarizePrescriptionDetails(summaryInput)
    const summaryText = summaryResult.summary

    return { transcription: transcriptionText, summary: summaryText }
  } catch (e: any) {
    if (isApiKeyError(e)) {
      return { error: 'API_KEY_MISSING', isApiKeyError: true }
    }
    return { error: e.message || 'An unknown error occurred during the scan.' }
  }
}

const IdentifyResultSchema = z.object({
  analysis: z.string().optional(),
  error: z.string().optional(),
  isApiKeyError: z.boolean().optional(),
})
type IdentifyResult = z.infer<typeof IdentifyResultSchema>

export async function identifyMedicine(
  prevState: any,
  formData: FormData
): Promise<IdentifyResult> {
  const file = formData.get('image') as File
  const query = formData.get('query') as string

  if (!file || file.size === 0) {
    return { error: 'Please provide an image of the medicine.' }
  }
  if (!query) {
    return { error: 'Please provide a question about the medicine.' }
  }
  
  try {
    const photoDataUri = await fileToDataUri(file)
    const input: AnalyzeMedicineImageInput = { photoDataUri, query }
    const result = await analyzeMedicineImage(input)

    return { analysis: result.medicineInfo }
  } catch (e: any) {
    if (isApiKeyError(e)) {
      return { error: 'API_KEY_MISSING', isApiKeyError: true }
    }
    return { error: e.message || 'An unknown error occurred during analysis.' }
  }
}

const AskResultSchema = z.object({
  answer: z.string().optional(),
  error: z.string().optional(),
  isApiKeyError: z.boolean().optional(),
})
type AskResult = z.infer<typeof AskResultSchema>

export async function askQuestion(query: string): Promise<AskResult> {
  if (!query) {
    return { error: 'Please enter a question.' }
  }
  try {
    // Step 1: Securely process the query
    const secureInput: SecureQueryProcessingInput = { query }
    const secureResult = await secureQueryProcessing(secureInput)

    const rejectionMessage = "I am designed to provide information only about medicines and medical prescriptions."
    if(secureResult.response.includes(rejectionMessage)) {
      return { answer: secureResult.response }
    }

    // Step 2: If the query is safe, get the answer
    const questionInput: AnswerMedicineQuestionInput = { question: query }
    const answerResult = await answerMedicineQuestion(questionInput)

    return { answer: answerResult.answer }
  } catch (e: any) {
    if (isApiKeyError(e)) {
      return { error: 'API_KEY_MISSING', isApiKeyError: true }
    }
    return { error: e.message || 'An unknown error occurred while getting an answer.' }
  }
}
