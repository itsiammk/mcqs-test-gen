import { getSession } from '@/lib/session';
import { redirect, notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Quiz from '@/models/Quiz';
import type { IQuiz } from '@/models/Quiz';
import { ReviewWrapper } from '@/components/mcq/ReviewWrapper';
import type { MCQFormInput } from '@/types/mcq';


async function getQuizData(id: string): Promise<{ quizData: IQuiz; testParams: MCQFormInput }> {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  try {
    await dbConnect();
    const quiz = await Quiz.findOne({ _id: id, userId: session.userId }).lean();
    
    if (!quiz) {
      notFound();
    }
    
    const quizData = JSON.parse(JSON.stringify(quiz)) as IQuiz;

    const testParams: MCQFormInput = {
        subject: quizData.subject,
        numQuestions: quizData.numQuestions,
        difficulty: quizData.difficulty,
        notes: quizData.notes,
        specificExam: quizData.specificExam,
        timeLimitMinutes: quizData.timeLimitMinutes,
    };
    
    return { quizData, testParams };
  } catch (error) {
    console.error("Failed to fetch quiz data:", error);
    notFound();
  }
}

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const { quizData, testParams } = await getQuizData(params.id);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <ReviewWrapper
        initialQuizData={quizData}
        initialTestParams={testParams}
      />
    </div>
  );
}
