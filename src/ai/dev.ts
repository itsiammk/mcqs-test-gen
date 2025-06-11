import { config } from 'dotenv';
config();

import '@/ai/flows/generate-mcqs.ts';
import '@/ai/flows/summarize-and-extract-mcq-text.ts';