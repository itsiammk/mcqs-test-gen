'use server';

import dbConnect from '@/lib/db';
import { getSession } from '@/lib/session';
import Quiz from '@/models/Quiz';
import type { MCQ, UserAnswer, MCQFormInput } from '@/types/mcq';
import { revalidatePath } from 'next/cache';
import { analyzeQuizResults, type AIAnalysis } from '@/ai/flows/analyze-quiz-results';

interface SaveQuizData {
  testParams: MCQFormInput;
  questions: MCQ[];
  userAnswers: UserAnswer[];
  score: number;
  timeTaken?: number;
  questionTimings: number[];
}

export async function saveQuizAction({
  testParams,
  questions,
  userAnswers,
  score,
  timeTaken,
  questionTimings,
}: SaveQuizData): Promise<{ success: boolean; saved: boolean; error?: string }> {
  const session = await getSession();
  
  // If user is not logged in, do not attempt to save.
  // Return success but indicate that it was not saved to the DB.
  if (!session) {
    return { success: true, saved: false };
  }

  try {
    await dbConnect();

    // Call AI analysis flow, but don't let it block saving.
    let aiAnalysis: AIAnalysis | null = null;
    try {
        aiAnalysis = await analyzeQuizResults({
            questions,
            userAnswers,
            questionTimings,
            subject: testParams.subject,
        });
    } catch (aiError) {
        console.error("AI analysis failed:", aiError);
        // Log the error but continue, so quiz is saved anyway
        aiAnalysis = null; 
    }

    const newQuiz = new Quiz({
      userId: session.userId,
      subject: testParams.subject,
      difficulty: testParams.difficulty,
      numQuestions: testParams.numQuestions,
      timeLimitMinutes: testParams.timeLimitMinutes,
      specificExam: testParams.specificExam,
      notes: testParams.notes,
      questions,
      userAnswers,
      score,
      timeTaken,
      questionTimings,
      aiAnalysis,
    });

    await newQuiz.save();
    revalidatePath('/history');
    revalidatePath('/dashboard');
    return { success: true, saved: true };
  } catch (error) {
    console.error('Failed to save quiz:', error);
    return { success: false, saved: false, error: 'Failed to save quiz to the database.' };
  }
}
