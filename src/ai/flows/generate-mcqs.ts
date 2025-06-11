
'use server';

/**
 * @fileOverview A multiple-choice question (MCQ) generation AI agent.
 *
 * - generateMCQs - A function that handles the MCQ generation process.
 * - GenerateMCQsInput - The input type for the generateMCQs function.
 * - GenerateMCQsOutput - The return type for the generateMCQs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMCQsInputSchema = z.object({
  subject: z.string().describe('The subject for which to generate MCQs (e.g., Reasoning, Mathematics, Biology).'),
  numQuestions: z.number().describe('The number of MCQs to generate (e.g., 10, 20, 30, or 50).'),
  difficulty: z.enum(['low', 'moderate', 'high']).describe('The difficulty level of the MCQs.'),
});
export type GenerateMCQsInput = z.infer<typeof GenerateMCQsInputSchema>;

const MCQSchema = z.object({
  questionText: z.string().describe('The text of the multiple-choice question.'),
  options: z.string().array().length(4).describe('An array of four possible answer options.'),
  correctAnswer: z.number().min(0).max(3).describe('The index of the correct answer in the options array (0, 1, 2, or 3).'),
  explanation: z.string().describe('A brief explanation of why the correct answer is correct and, if relevant, why others are incorrect.'),
  difficulty: z.enum(['low', 'moderate', 'high']).describe('The difficulty level of the MCQ.'),
});

const GenerateMCQsOutputSchema = MCQSchema.array();
export type GenerateMCQsOutput = z.infer<typeof GenerateMCQsOutputSchema>;

export async function generateMCQs(input: GenerateMCQsInput): Promise<GenerateMCQsOutput> {
  return generateMCQsFlow(input);
}

const generateMCQsPrompt = ai.definePrompt({
  name: 'generateMCQsPrompt',
  input: {schema: GenerateMCQsInputSchema},
  output: {schema: GenerateMCQsOutputSchema},
  prompt: `You are an expert in creating high-quality multiple-choice questions (MCQs) for educational purposes. Generate exactly {{numQuestions}} MCQs for the subject "{{subject}}" with "{{difficulty}}" difficulty in the specified JSON format.

Each question must have:
- A clear and concise question text relevant to the subject.
- Exactly 4 answer options, labeled as strings.
- A correct answer indicated by the index of the correct option (0, 1, 2, or 3).
- A brief explanation (1–2 sentences) explaining why the correct answer is correct and, if relevant, why others are incorrect.

Ensure the questions are appropriate for the specified difficulty:
- Low: Basic concepts, foundational knowledge, simple application.
- Moderate: Intermediate concepts, requiring some reasoning or application.
- High: Advanced concepts, complex reasoning, or multi-step problem-solving.

Crucially, ensure all questions are factually accurate, clearly worded, and unambiguous. Double-check that the provided correct answer and explanation are verifiably true for the given subject and difficulty.

The output must be in valid JSON format, with the following structure:
\`\`\`json
[
  {
    "questionText": "Question text here",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of the correct answer.",
    "difficulty": "{{difficulty}}"
  }
]
\`\`\`
Ensure the JSON is properly formatted, with no missing fields or syntax errors.
Avoid overly ambiguous or subjective questions; focus on clear, objective content suitable for a test environment.
If the subject is broad (e.g., Reasoning), cover a variety of relevant topics within it (e.g., logical reasoning, analytical reasoning, verbal reasoning).
`,
});

const generateMCQsFlow = ai.defineFlow(
  {
    name: 'generateMCQsFlow',
    inputSchema: GenerateMCQsInputSchema,
    outputSchema: GenerateMCQsOutputSchema,
  },
  async input => {
    const {output} = await generateMCQsPrompt(input);
    return output!;
  }
);

    