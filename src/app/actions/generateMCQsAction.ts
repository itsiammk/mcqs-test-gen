'use server';

import { generateMCQs, type GenerateMCQsInput, type GenerateMCQsOutput } from '@/ai/flows/generate-mcqs';
import { z } from 'zod';

const ActionInputSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  numQuestions: z.coerce.number().min(1, "Number of questions must be at least 1"),
  difficulty: z.enum(['low', 'moderate', 'high']),
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
    return { data: null, error: "An unexpected error occurred while generating questions. Please try again." };
  }
}
