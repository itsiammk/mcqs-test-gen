'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing text documents and extracting relevant segments to create multiple-choice questions.
 *
 * - summarizeAndExtractMCQText - A function that takes text content, a subject, the number of questions, and difficulty, and generates a JSON array of MCQs.
 * - SummarizeAndExtractMCQTextInput - The input type for the summarizeAndExtractMCQText function.
 * - SummarizeAndExtractMCQTextOutput - The return type for the summarizeAndExtractMCQText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAndExtractMCQTextInputSchema = z.object({
  textContent: z.string().describe('The text content to summarize and extract MCQs from.'),
  subject: z.string().describe('The subject of the multiple choice questions.'),
  numQuestions: z.number().describe('The number of multiple choice questions to generate.'),
  difficulty: z.string().describe('The difficulty level of the multiple choice questions (low, moderate, high).'),
});
export type SummarizeAndExtractMCQTextInput = z.infer<typeof SummarizeAndExtractMCQTextInputSchema>;

const SummarizeAndExtractMCQTextOutputSchema = z.array(
  z.object({
    questionText: z.string().describe('Question text here'),
    options: z.string().array().length(4).describe('Four answer options'),
    correctAnswer: z.number().min(0).max(3).describe('Index of the correct answer (0, 1, 2, or 3)'),
    explanation: z.string().describe('Brief explanation of the correct answer.'),
    difficulty: z.string().describe('Difficulty level of the question'),
  })
);
export type SummarizeAndExtractMCQTextOutput = z.infer<typeof SummarizeAndExtractMCQTextOutputSchema>;

export async function summarizeAndExtractMCQText(
  input: SummarizeAndExtractMCQTextInput
): Promise<SummarizeAndExtractMCQTextOutput> {
  return summarizeAndExtractMCQTextFlow(input);
}

const summarizeAndExtractMCQTextPrompt = ai.definePrompt({
  name: 'summarizeAndExtractMCQTextPrompt',
  input: {schema: SummarizeAndExtractMCQTextInputSchema},
  output: {schema: SummarizeAndExtractMCQTextOutputSchema},
  prompt: `You are an expert in creating high-quality multiple-choice questions (MCQs) for educational purposes. I need you to generate a set of MCQs based on the following user inputs:

- Subject: {{{subject}}}
- Number of Questions: {{{numQuestions}}}
- Difficulty: {{{difficulty}}}

Instructions:
1. Generate exactly {{{numQuestions}}} MCQs for the specified {{{subject}}} at the {{{difficulty}}} level using the provided text content.
2. Each question must have:
   - A clear and concise question text relevant to the subject, extracted from the text content.
   - Exactly 4 answer options, labeled as strings.
   - A correct answer indicated by the index of the correct option (0, 1, 2, or 3).
   - A brief explanation (1–2 sentences) explaining why the correct answer is correct and, if relevant, why others are incorrect. Use information from the text content.
3. Ensure the questions are appropriate for the specified difficulty:
   - Low: Basic concepts, foundational knowledge, simple application.
   - Moderate: Intermediate concepts, requiring some reasoning or application.
   - High: Advanced concepts, complex reasoning, or multi-step problem-solving.
4. The output must be in valid JSON format, with the following structure:
   ```json
   [
     {
       "questionText": "Question text here",
       "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
       "correctAnswer": 0,
       "explanation": "Brief explanation of the correct answer.",
       "difficulty": "{{{difficulty}}}"
     },
     ...
   ]
   ```
Ensure the JSON is properly formatted, with no missing fields or syntax errors.
Avoid overly ambiguous or subjective questions; focus on clear, objective content suitable for a test environment.
If the subject is broad (e.g., Reasoning), cover a variety of relevant topics within it (e.g., logical reasoning, analytical reasoning, verbal reasoning).

Text Content: {{{textContent}}}
`,
});

const summarizeAndExtractMCQTextFlow = ai.defineFlow(
  {
    name: 'summarizeAndExtractMCQTextFlow',
    inputSchema: SummarizeAndExtractMCQTextInputSchema,
    outputSchema: SummarizeAndExtractMCQTextOutputSchema,
  },
  async input => {
    const {output} = await summarizeAndExtractMCQTextPrompt(input);
    return output!;
  }
);
