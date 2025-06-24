'use server';
/**
 * @fileOverview An AI agent for analyzing quiz results.
 *
 * - analyzeQuizResults - A function that analyzes quiz performance based on answers and time taken.
 * - AnalyzeQuizResultsInput - The input type for the function.
 * - AIAnalysis - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeQuizResultsInputSchema = z.object({
  questions: z.array(z.any()).describe("The array of quiz questions."),
  userAnswers: z.array(z.number().nullable()).describe("The array of user's answers (index or null)."),
  questionTimings: z.array(z.number()).describe("Array of time taken in seconds for each question."),
  subject: z.string().describe("The subject of the quiz."),
});
export type AnalyzeQuizResultsInput = z.infer<typeof AnalyzeQuizResultsInputSchema>;

const AIAnalysisSchema = z.object({
  overallFeedback: z.string().describe("A concise, encouraging paragraph (2-3 sentences) summarizing the user's overall performance, including score, time management, and general observations."),
  strengths: z.array(z.string()).describe("A list of 2-3 specific topics or concepts where the user performed well (correct and reasonably fast answers)."),
  areasForImprovement: z.array(
    z.object({
      topic: z.string().describe("A specific topic or concept that needs improvement."),
      reason: z.string().describe("The reason for flagging this topic, e.g., 'Slow but correct, focus on speed' or 'Incorrect and slow, needs concept review' or 'Incorrect and fast, watch for careless mistakes'."),
    })
  ).describe("A list of 2-3 specific topics or concepts where the user struggled, with actionable reasons."),
  timeManagementAnalysis: z.string().describe("A brief analysis of the user's pacing. Mention if they were generally fast, slow, or well-paced. Highlight questions that took an unusually long time (e.g., over 2 minutes) and suggest strategies if needed."),
});
export type AIAnalysis = z.infer<typeof AIAnalysisSchema>;

export async function analyzeQuizResults(input: AnalyzeQuizResultsInput): Promise<AIAnalysis> {
  return analyzeQuizResultsFlow(input);
}


const AnalysisPromptInputSchema = z.object({
    subject: z.string(),
    analysisData: z.string()
});

const analysisPrompt = ai.definePrompt({
  name: 'analyzeQuizResultsPrompt',
  input: { schema: AnalysisPromptInputSchema },
  output: { schema: AIAnalysisSchema },
  prompt: `You are an expert educational coach. Analyze the following quiz results for the subject "{{subject}}". Provide a detailed, constructive, and encouraging analysis of the user's performance.

Your analysis is based on a summary of the user's answers. For each question, you get the text, their result (Correct, Incorrect, or Unanswered), the time they took, and a hint about the topic from the question's explanation.

**Your Task:**
Based on the provided data, generate a structured analysis in the specified JSON format.

**Analysis Guidelines:**
1.  **Overall Feedback:** Start with a positive and summary statement. Mention the final score (you'll have to infer this from the counts of correct/incorrect) and give a high-level comment on their performance and pacing.
2.  **Strengths:** Identify topics or question types where the user was both **correct** and **reasonably fast**. These are areas of mastery. List 2-3 key strengths based on the topic hints.
3.  **Areas for Improvement:** This is the most important part. Identify topics where the user struggled. Categorize the reasons for the struggle using the topic hints:
    *   **Knowledge Gap (Slow & Incorrect):** The user took a long time and still got it wrong. This indicates a need for foundational review of the topic.
    *   **Speed & Efficiency (Slow & Correct):** The user knows the material but is slow. This suggests a need for practice to improve speed. A question taking more than 120 seconds (2 minutes) is a strong indicator.
    *   **Carelessness/Misconception (Fast & Incorrect):** The user answered quickly but incorrectly. This could be a careless mistake or a fundamental misunderstanding. Advise them to slow down and read carefully on these topics.
    *   List the top 2-3 areas that need the most attention.
4.  **Time Management Analysis:** Comment on the user's overall pacing. Were they consistent? Did any questions act as significant time sinks? Point out the question number(s) that took the longest.

**IMPORTANT:** Be specific. Instead of saying "you struggled with some questions," refer to the concepts in the topic hints. For example, if a question about "photosynthesis" was slow and incorrect, list "Photosynthesis" as an area for improvement.

Here is the data for analysis:
{{{analysisData}}}

Based on this data, provide your structured analysis in the specified JSON format.
`,
});

const analyzeQuizResultsFlow = ai.defineFlow(
  {
    name: 'analyzeQuizResultsFlow',
    inputSchema: AnalyzeQuizResultsInputSchema,
    outputSchema: AIAnalysisSchema,
  },
  async (input) => {
    // 1. Pre-process data into a string for the prompt
    let analysisText = '';
    input.questions.forEach((q, index) => {
        const userAnswer = input.userAnswers[index];
        const timeTaken = Math.round(input.questionTimings[index] || 0);
        const isCorrect = userAnswer === q.correctAnswer;
        const result = isCorrect ? 'Correct' : (userAnswer === null ? 'Unanswered' : 'Incorrect');

        analysisText += `Question ${index + 1}:\n`;
        analysisText += `- Text: "${q.questionText}"\n`;
        analysisText += `- Result: ${result}\n`;
        analysisText += `- Time Taken: ${timeTaken} seconds\n`;
        analysisText += `- Topic Hint (from explanation): "${q.explanation}"\n---\n`;
    });

    // 2. Call the prompt with the processed text
    const {output} = await analysisPrompt({
        subject: input.subject,
        analysisData: analysisText
    });
    return output!;
  }
);
