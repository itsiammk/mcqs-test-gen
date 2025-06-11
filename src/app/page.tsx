'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MCQForm } from '@/components/mcq/MCQForm';
import { QuizView } from '@/components/mcq/QuizView'; // Updated import
import { generateMCQsAction } from '@/app/actions/generateMCQsAction';
import type { MCQ, MCQFormInput, UserAnswer, MarkedReview, QuizState } from '@/types/mcq';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Image from 'next/image';

export default function Home() {
  const [questions, setQuestions] = useState<MCQ[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTestParams, setCurrentTestParams] = useState<MCQFormInput | null>(null);
  const { toast } = useToast();

  const [quizState, setQuizState] = useState<QuizState>('form');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [markedForReview, setMarkedForReview] = useState<MarkedReview[]>([]);

  const resetQuizState = () => {
    setQuestions(null);
    setError(null);
    setCurrentTestParams(null);
    setQuizState('form');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setMarkedForReview([]);
  };

  const handleFormSubmit = async (data: MCQFormInput) => {
    setIsLoading(true);
    setError(null);
    setQuestions(null);
    setCurrentTestParams(data);
    setQuizState('form'); // Ensure it's form state during loading

    const result = await generateMCQsAction(data);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      toast({
        variant: "destructive",
        title: "Error Generating Questions",
        description: result.error,
      });
      setQuizState('form');
    } else if (result.data && result.data.length > 0) {
      setQuestions(result.data);
      setUserAnswers(new Array(result.data.length).fill(null));
      setMarkedForReview(new Array(result.data.length).fill(false));
      setCurrentQuestionIndex(0);
      setQuizState('taking');
      toast({
        title: "Success!",
        description: `${result.data.length} questions generated for ${data.subject}.`,
      });
    } else {
      const fallbackError = "No questions were returned or an empty list was generated. Please try again with different parameters or ensure the AI can generate content for the subject.";
      setError(fallbackError);
      toast({
        variant: "destructive",
        title: "Error Generating Questions",
        description: fallbackError,
      });
      setQuizState('form');
    }
  };

  const handleSelectAnswer = (questionIdx: number, answerIdx: number) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIdx] = answerIdx;
      return newAnswers;
    });
  };

  const handleMarkForReview = (questionIdx: number) => {
    setMarkedForReview(prev => {
      const newMarks = [...prev];
      newMarks[questionIdx] = !newMarks[questionIdx];
      return newMarks;
    });
  };

  const handleClearChoice = (questionIdx: number) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIdx] = null;
      return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNavigateToQuestion = (index: number) => {
    if (questions && index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleSubmitTest = () => {
    setQuizState('submitted');
    toast({
      title: "Test Submitted!",
      description: "You can now review your answers.",
    });
  };
  
  const handleStartReview = () => {
    setQuizState('reviewing');
  };

  const handleStartNewTest = () => {
    resetQuizState();
  };

  const handleExportResults = () => {
    if (!questions || !currentTestParams) return;

    let textContent = `ScholarQuiz Results\n`;
    textContent += `Subject: ${currentTestParams.subject}\n`;
    textContent += `Number of Questions: ${currentTestParams.numQuestions}\n`;
    textContent += `Difficulty: ${currentTestParams.difficulty}\n\n`;
    textContent += `----------------------------------------\n\n`;

    let correctAnswersCount = 0;
    questions.forEach((q, index) => {
      const userAnswerIndex = userAnswers[index];
      const isCorrect = userAnswerIndex === q.correctAnswer;
      if (isCorrect) correctAnswersCount++;

      textContent += `Question ${index + 1}: ${q.questionText}\n`;
      textContent += `Options:\n`;
      q.options.forEach((opt, i) => {
        textContent += `${String.fromCharCode(65 + i)}) ${opt}\n`;
      });
      textContent += `Your Answer: ${userAnswerIndex !== null ? String.fromCharCode(65 + userAnswerIndex) + ') ' + q.options[userAnswerIndex] : 'Not Answered'}\n`;
      textContent += `Correct Answer: ${String.fromCharCode(65 + q.correctAnswer)}) ${q.options[q.correctAnswer]}\n`;
      textContent += `Result: ${isCorrect ? 'Correct' : (userAnswerIndex === null ? 'Not Answered' : 'Incorrect')}\n`;
      textContent += `Explanation: ${q.explanation}\n`;
      textContent += `Difficulty: ${q.difficulty}\n`;
      textContent += `----------------------------------------\n\n`;
    });
    
    textContent += `Final Score: ${correctAnswersCount} out of ${questions.length} (${((correctAnswersCount/questions.length)*100).toFixed(2)}%)\n`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${currentTestParams.subject.toLowerCase().replace(/\s+/g, '_')}_quiz_results.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
     toast({
        title: "Results Exported",
        description: "Your quiz results have been downloaded as a text file.",
      });
  };


  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {quizState === 'form' && (
          <>
            <section className="mb-12 text-center">
              <h2 className="text-4xl font-headline font-bold mb-4 text-gray-800 dark:text-gray-100">Welcome to ScholarQuiz!</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Generate custom multiple-choice quizzes on any subject to supercharge your learning.
                Just pick your topic, number of questions, and difficulty level to get started.
              </p>
            </section>
            
            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
              <div className="order-2 md:order-1">
                <MCQForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                 <Image 
                  src="https://placehold.co/600x400.png" 
                  alt="Quiz illustration" 
                  width={500} 
                  height={350}
                  className="rounded-lg shadow-xl"
                  data-ai-hint="education quiz"
                  priority
                />
              </div>
            </div>
            {error && !isLoading && (
              <Alert variant="destructive" className="my-8">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </>
        )}
        
        {(quizState === 'taking' || quizState === 'submitted' || quizState === 'reviewing') && questions && currentTestParams && (
          <QuizView
            questions={questions}
            testParams={currentTestParams}
            currentQuestionIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            markedForReview={markedForReview}
            quizState={quizState}
            onSelectAnswer={handleSelectAnswer}
            onMarkForReview={handleMarkForReview}
            onClearChoice={handleClearChoice}
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            onNavigateToQuestion={handleNavigateToQuestion}
            onSubmitTest={handleSubmitTest}
            onStartReview={handleStartReview}
            onStartNewTest={handleStartNewTest}
            onExportResults={handleExportResults}
          />
        )}
         {quizState !== 'form' && error && !isLoading && (
           <Alert variant="destructive" className="my-8">
             <Terminal className="h-4 w-4" />
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{error}</AlertDescription>
           </Alert>
         )}
      </main>
      <Footer />
    </>
  );
}
