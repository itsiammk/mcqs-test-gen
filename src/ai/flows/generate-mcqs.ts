
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
  specificExam: z.string().optional().describe('Optional specific exam to tailor questions for (e.g., "SAT Math", "JEE Physics"). The AI should try to consider common question styles, topics, or patterns relevant to this exam. If direct knowledge of past papers is unavailable, focus on generating high-quality questions typical for this exam\'s scope and subject matter.'),
  notes: z.string().optional().describe('Optional notes or specific instructions for the AI (e.g., "one-word answers", "focus on definitions", "questions should be scenario-based"). Adhere to these notes carefully.'),
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
  prompt: `You are an expert in creating high-quality multiple-choice questions (MCQs) for educational purposes.
Your HIGHEST PRIORITY is factual accuracy. All question stems, options, correct answers, and explanations MUST be verifiably correct and free of errors.
Generate exactly {{numQuestions}} MCQs for the subject "{{subject}}" with "{{difficulty}}" difficulty in the specified JSON format.

{{#if specificExam}}
IMPORTANT: The user has specified that these questions are for the "{{specificExam}}" exam.
Tailor the questions accordingly. Try to consider common question styles, topics, patterns, or frequently asked concepts for the "{{specificExam}}".
If specific knowledge of past papers for "{{specificExam}}" is not available to you, focus on generating high-quality questions that are typical for this exam's general scope, subject matter, and style.
Do NOT invent or hallucinate past paper questions if you don't know them.
Prioritize relevance to this specific exam context based on general knowledge of such exams.
{{/if}}

{{#if notes}}
The user has provided the following notes/instructions, please adhere to them carefully and precisely: "{{notes}}"
{{/if}}

Each question must have:
- A clear and concise question text relevant to the subject. The question itself must be valid, make logical sense, and be unambiguous with only ONE clearly correct answer among the options.
- Exactly 4 answer options, labeled as strings. Options should be plausible distractors but not so similar as to be confusing or rely on trivial distinctions.
- A correct answer indicated by the index of the correct option (0, 1, 2, or 3). This correct answer MUST be verifiably true.
- A brief explanation (1–2 sentences) meticulously justifying why the correct answer is correct and, if relevant, clearly stating why others are incorrect, based on factual information. This explanation must be accurate.

Ensure the questions are appropriate for the specified difficulty:
- Low: Basic concepts, foundational knowledge, simple application.
- Moderate: Intermediate concepts, requiring some reasoning or application.
- High: Advanced concepts, complex reasoning, or multi-step problem-solving.

CRITICAL: Double-check and triple-check all generated content for factual accuracy.
Ensure the question is well-posed, the options are plausible yet distinct, the provided correct answer is verifiably true, and the explanation correctly supports the answer.
Avoid overly ambiguous or subjective questions; focus on clear, objective content suitable for a test environment.
If you are unsure about the factual accuracy of a question or answer you can generate, it is better to NOT generate that specific question and try a different one that meets all quality criteria.
If the subject is broad (e.g., Reasoning), cover a variety of relevant topics within it (e.g., logical reasoning, analytical reasoning, verbal reasoning).

The output must be in valid JSON format, with the following structure. Do not include any text outside this JSON structure.
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
