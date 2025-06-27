'use server';
/**
 * @fileOverview An AI agent for summarizing a user's entire quiz history analysis.
 *
 * - summarizeHistoricalAnalyses - A function that performs a meta-analysis on a series of quiz analyses.
 * - OverallAIAnalysis - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { AIAnalysis } from './analyze-quiz-results';

const SummarizeHistoricalAnalysesInputSchema = z.array(z.any());

const OverallAIAnalysisSchema = z.object({
  longTermSummary: z.string().describe("A comprehensive but concise paragraph (3-4 sentences) summarizing the user's long-term learning journey, progress, overall habits, and key takeaways from their entire quiz history."),
  persistentStrengths: z.array(z.string()).describe("A list of 2-4 consistent topics or skills where the user has repeatedly demonstrated strong performance across multiple quizzes."),
  criticalAreasForImprovement: z.array(
    z.object({
      topic: z.string().describe("A specific, recurring topic or concept that needs the most attention."),
      reason: z.string().describe("A synthesized reason for this being a critical area, e.g., 'Consistently incorrect across multiple quizzes' or 'Shows slow completion times and mixed accuracy, indicating a foundational gap'."),
    })
  ).describe("A list of the 2-4 most critical topics where the user consistently struggles, with actionable reasons based on recurring patterns."),
  evolvingTrends: z.string().describe("A brief analysis of trends over time. Mention if the user is getting faster, if accuracy is improving in certain subjects, or if new weaknesses are appearing. For example: 'Noticeable improvement in 'Algebra' speed, but 'Geometry' accuracy has recently declined.'"),
});
export type OverallAIAnalysis = z.infer<typeof OverallAIAnalysisSchema>;


export async function summarizeHistoricalAnalyses(input: AIAnalysis[]): Promise<OverallAIAnalysis> {
  // Ensure we don't call the flow with an empty array.
  if (!input || input.length === 0) {
    throw new Error("Input array cannot be empty.");
  }
  return summarizeHistoricalAnalysesFlow(input);
}

const SummarizePromptInputSchema = z.object({
    analysesJson: z.string()
});

const summaryPrompt = ai.definePrompt({
  name: 'summarizeHistoricalAnalysesPrompt',
  input: { schema: SummarizePromptInputSchema },
  output: { schema: OverallAIAnalysisSchema },
  prompt: `You are an expert learning coach who analyzes a user's progress over time.
You have been given a JSON array containing several past AI-powered performance analyses from a series of quizzes a user has taken. Each analysis in the array corresponds to a single quiz.

**Your Task:**
Perform a meta-analysis on this entire history of feedback. Identify long-term trends, recurring patterns, and evolving habits. Synthesize this information into a single, high-level "Overall AI Analysis" in the specified JSON format. Do not just repeat information from a single analysis; your value is in identifying the patterns *across* all of them.

**Analysis Guidelines:**
1.  **Long-Term Summary:** Read through all the feedback. What's the big picture? Is the user generally improving? What are their core study habits (e.g., fast but sometimes careless, slow but methodical)? Write a 3-4 sentence summary of their entire journey.
2.  **Persistent Strengths:** Find topics or skills that are mentioned as "strengths" repeatedly across different analyses. These are the user's most solid areas of knowledge. List the top 2-4.
3.  **Critical Areas for Improvement:** This is the most crucial part. Identify the topics or skills that appear as "areas for improvement" or have negative comments (slow, incorrect) again and again. These are not just one-off mistakes; they are significant, recurring knowledge gaps or bad habits. List the 2-4 most critical ones and synthesize a reason for their importance.
4.  **Evolving Trends:** Look at the data chronologically (the array is sorted from most recent quiz to oldest). Is the user's time management getting better or worse? Are they improving in a weakness you identified earlier? Are new weaknesses cropping up in recent quizzes? Provide a sentence or two on these dynamics.

**IMPORTANT:** Your output must be a synthesis. For example, if "Photosynthesis" is a weakness in 3 out of 5 analyses, that's a "Critical Area for Improvement." If "Cellular Respiration" was a strength in 4 out of 5, that's a "Persistent Strength."

Here is the JSON data of past analyses (sorted from most recent to oldest):
{{{analysesJson}}}

Based on this historical data, provide your structured overall analysis in the specified JSON format.
`,
});

const summarizeHistoricalAnalysesFlow = ai.defineFlow(
  {
    name: 'summarizeHistoricalAnalysesFlow',
    inputSchema: SummarizeHistoricalAnalysesInputSchema,
    outputSchema: OverallAIAnalysisSchema,
  },
  async (analyses) => {
    const analysesJson = JSON.stringify(analyses, null, 2);
    const {output} = await summaryPrompt({ analysesJson });
    return output!;
  }
);
