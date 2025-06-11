
'use server';

import { generateMCQs, type GenerateMCQsInput, type GenerateMCQsOutput } from '@/ai/flows/generate-mcqs';
import { z } from 'zod';

const ActionInputSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  numQuestions: z.coerce.number().min(1, "Number of questions must be at least 1"),
  difficulty: z.enum(['low', 'moderate', 'high']),
  timeLimitMinutes: z.coerce.number().optional(),
  specificExam: z.string().optional(),
  notes: z.string().optional(),
});

export async function generateMCQsAction(
  input: GenerateMCQsInput
): Promise<{ data: GenerateMCQsOutput | null; error: string | null }> {
  try {
    const validatedInput = ActionInputSchema.parse(input);
    const mcqs = await generateMCQs(validatedInput);
    if (!mcqs || mcqs.length === 0) {
      return { data: null, error: "AI failed to generate questions. Please try again with different parameters." };
    }
    return { data: mcqs, error: null };
  } catch (error) {
    console.error("Error generating MCQs:", error);
    if (error instanceof z.ZodError) {
      return { data: null, error: `Invalid input: ${error.errors.map(e => e.message).join(', ')}` };
    }
    // Check for specific Genkit/Gemini error messages if available, e.g., safety blocks
    // This is a generic way to catch potential string errors from the AI or network issues
    if (typeof error === 'string') {
        return { data: null, error: `AI Error: ${error}`};
    }
    if (error instanceof Error && error.message.includes('SAFETY')) {
         return { data: null, error: "The AI was unable to generate questions due to safety filters. This can happen with certain sensitive topics or prompts. Please try rephrasing or adjusting your input."};
    }
    return { data: null, error: "An unexpected error occurred while generating questions. Please try again." };
  }
}
