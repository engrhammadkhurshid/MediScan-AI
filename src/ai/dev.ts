import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-medicine-image.ts';
import '@/ai/flows/answer-medicine-questions.ts';
import '@/ai/flows/secure-query-processing.ts';
import '@/ai/flows/summarize-prescription-details.ts';