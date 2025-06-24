'use server';

import dbConnect from '@/lib/db';
import { getSession } from '@/lib/session';
import Quiz from '@/models/Quiz';
import type { MCQ, UserAnswer, MCQFormInput } from '@/types/mcq';
import { revalidatePath } from 'next/cache';

interface SaveQuizData {
  testParams: MCQFormInput;
  questions: MCQ[];
  userAnswers: UserAnswer[];
  score: number;
  timeTaken?: number;
}

export async function saveQuizAction({
  testParams,
  questions,
  userAnswers,
  score,
  timeTaken,
}: SaveQuizData): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    await dbConnect();

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
    });

    await newQuiz.save();
    revalidatePath('/history');
    return { success: true };
  } catch (error) {
    console.error('Failed to save quiz:', error);
    return { success: false, error: 'Failed to save quiz to database.' };
  }
}
