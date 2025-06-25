'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizView } from '@/components/mcq/QuizView';
import type { IQuiz } from '@/models/Quiz';
import type { MCQFormInput, UserAnswer } from '@/types/mcq';
import { useToast } from "@/hooks/use-toast";
import { AIAnalysisCard } from './AIAnalysisCard';
import type { AIAnalysis } from '@/ai/flows/analyze-quiz-results';


interface ReviewWrapperProps {
  initialQuizData: IQuiz;
  initialTestParams: MCQFormInput;
}

export function ReviewWrapper({ initialQuizData, initialTestParams }: ReviewWrapperProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleStartNewTest = () => {
    router.push('/quiz/new');
  };

  const handleExportResults = () => {
    const { questions, userAnswers, score, timeTaken, questionTimings } = initialQuizData;

    let textContent = `ScholarQuiz Results\n=====================\n\n`;
    textContent += `Subject: ${initialTestParams.subject}\n`;
    if (initialTestParams.timeLimitMinutes && initialTestParams.timeLimitMinutes > 0) {
      textContent += `Time Limit: ${initialTestParams.timeLimitMinutes} minutes\n`;
    }
     if (timeTaken) {
      const minutes = Math.floor(timeTaken / 60);
      const seconds = timeTaken % 60;
      textContent += `Time Taken: ${minutes}m ${seconds}s\n`;
    }
    if (initialTestParams.specificExam) {
      textContent += `Exam Focus: ${initialTestParams.specificExam}\n`;
    }
    if (initialTestParams.notes) {
      textContent += `User Notes: ${initialTestParams.notes}\n`;
    }
    textContent += `Number of Questions: ${questions.length}\n`;
    textContent += `Difficulty: ${initialTestParams.difficulty}\n\n`;
    textContent += `----------------------------------------\n\n`;

    questions.forEach((q, index) => {
      const userAnswerIndex = userAnswers[index];
      const isCorrect = userAnswerIndex === q.correctAnswer;
      const timeForQuestion = questionTimings[index] ? Math.round(questionTimings[index]) : 'N/A';

      textContent += `Question ${index + 1}: ${q.questionText}\n`;
      textContent += `Time on question: ${timeForQuestion} seconds\n`;
      textContent += `Options:\n`;
      q.options.forEach((opt, i) => {
        textContent += `  ${String.fromCharCode(65 + i)}) ${opt}\n`;
      });
      textContent += `Your Answer: ${userAnswerIndex !== null ? String.fromCharCode(65 + userAnswerIndex) + ') ' + q.options[userAnswerIndex] : 'Not Answered'}\n`;
      textContent += `Correct Answer: ${String.fromCharCode(65 + q.correctAnswer)}) ${q.options[q.correctAnswer]}\n`;
      textContent += `Result: ${isCorrect ? 'Correct' : (userAnswerIndex === null ? 'Not Answered' : 'Incorrect')}\n`;
      textContent += `Difficulty: ${q.difficulty}\n`;
      textContent += `Explanation: ${q.explanation}\n`;
      textContent += `----------------------------------------\n\n`;
    });

    const scorePercentage = questions.length > 0 ? (score / questions.length) * 100 : 0;
    textContent += `Final Score: ${score} out of ${questions.length} (${scorePercentage.toFixed(2)}%)\n`;
    textContent += `=====================\n`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${initialTestParams.subject.toLowerCase().replace(/\s+/g, '_')}_quiz_results_${new Date(initialQuizData.createdAt).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
     toast({
        title: "Results Exported",
        description: "Your quiz results have been downloaded as a text file.",
      });
  };
  
  const dummyFunction = () => {};

  // Calculate timeLeft for display if time limit was set
  const getTimeLeft = () => {
    if (initialQuizData.timeLimitMinutes && initialQuizData.timeTaken !== undefined) {
        const totalTimeSeconds = initialQuizData.timeLimitMinutes * 60;
        return totalTimeSeconds - initialQuizData.timeTaken;
    }
    return null;
  }

  return (
    <>
      {initialQuizData.aiAnalysis && (
        <AIAnalysisCard analysis={initialQuizData.aiAnalysis as AIAnalysis} />
      )}
      <QuizView
        questions={initialQuizData.questions}
        testParams={initialTestParams}
        currentQuestionIndex={currentQuestionIndex}
        userAnswers={initialQuizData.userAnswers as UserAnswer[]}
        markedForReview={new Array(initialQuizData.questions.length).fill(false)}
        quizState="reviewing"
        timeLeft={getTimeLeft()}
        isTimerRunning={false}
        onSelectAnswer={dummyFunction}
        onMarkForReview={dummyFunction}
        onClearChoice={dummyFunction}
        onNextQuestion={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, initialQuizData.questions.length - 1))}
        onPreviousQuestion={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}
        onNavigateToQuestion={setCurrentQuestionIndex}
        onSubmitTest={dummyFunction}
        onStartReview={dummyFunction}
        onStartNewTest={handleStartNewTest}
        onExportResults={handleExportResults}
      />
    </>
  );
}
