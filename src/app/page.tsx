
'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MCQForm } from '@/components/mcq/MCQForm';
import { QuizView } from '@/components/mcq/QuizView';
import { LoadingModal } from '@/components/mcq/LoadingModal'; 
import { generateMCQsAction } from '@/app/actions/generateMCQsAction';
import type { MCQ, MCQFormInput, UserAnswer, MarkedReview, QuizState } from '@/types/mcq';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Brain } from "lucide-react";
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [questions, setQuestions] = useState<MCQ[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
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
    setShowLoadingModal(false);
  };

  const handleFormSubmit = async (data: MCQFormInput) => {
    setIsLoading(true);
    setShowLoadingModal(true);
    setError(null);
    setQuestions(null);
    setCurrentTestParams(data);
    setQuizState('form'); 

    const result = await generateMCQsAction(data);
    
    setIsLoading(false);
    setShowLoadingModal(false);

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
        description: `${result.data.length} questions generated for ${data.subject}. Good luck!`,
        className: "bg-green-500 text-white dark:bg-green-600 dark:text-white"
      });
    } else {
      const fallbackError = "No questions were returned. The AI might be having trouble with this subject or parameters. Please try adjusting your request or try again later.";
      setError(fallbackError);
      toast({
        variant: "destructive",
        title: "No Questions Generated",
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
      description: "You can now review your answers or start a new test.",
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

    let textContent = `ScholarQuiz Results\n=====================\n\n`;
    textContent += `Subject: ${currentTestParams.subject}\n`;
    if (currentTestParams.specificExam) {
      textContent += `Exam Focus: ${currentTestParams.specificExam}\n`;
    }
    if (currentTestParams.notes) {
      textContent += `User Notes: ${currentTestParams.notes}\n`;
    }
    textContent += `Number of Questions: ${questions.length} (Requested: ${currentTestParams.numQuestions})\n`;
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
        textContent += `  ${String.fromCharCode(65 + i)}) ${opt}\n`;
      });
      textContent += `Your Answer: ${userAnswerIndex !== null ? String.fromCharCode(65 + userAnswerIndex) + ') ' + q.options[userAnswerIndex] : 'Not Answered'}\n`;
      textContent += `Correct Answer: ${String.fromCharCode(65 + q.correctAnswer)}) ${q.options[q.correctAnswer]}\n`;
      textContent += `Result: ${isCorrect ? 'Correct' : (userAnswerIndex === null ? 'Not Answered' : 'Incorrect')}\n`;
      textContent += `Difficulty: ${q.difficulty}\n`;
      textContent += `Explanation: ${q.explanation}\n`;
      textContent += `----------------------------------------\n\n`;
    });
    
    const scorePercentage = questions.length > 0 ? (correctAnswersCount / questions.length) * 100 : 0;
    textContent += `Final Score: ${correctAnswersCount} out of ${questions.length} (${scorePercentage.toFixed(2)}%)\n`;
    textContent += `=====================\n`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${currentTestParams.subject.toLowerCase().replace(/\s+/g, '_')}_quiz_results_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
     toast({
        title: "Results Exported",
        description: "Your quiz results have been downloaded.",
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16">
        <LoadingModal isOpen={showLoadingModal} />
        {quizState === 'form' && (
          <>
            <section className="mb-16 md:mb-20 text-center">
              <Brain className="mx-auto h-20 w-20 text-primary mb-6 animate-pulse" />
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold mb-6 text-foreground">
                Welcome to ScholarQuiz!
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Generate custom multiple-choice quizzes on any subject to supercharge your learning.
                Just pick your topic, number of questions, and difficulty level to get started.
              </p>
            </section>
            
            <div className="grid md:grid-cols-5 gap-10 lg:gap-16 items-start mb-16 md:mb-20">
              <div className="md:col-span-3 order-2 md:order-1">
                <MCQForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              </div>
              <div className="md:col-span-2 order-1 md:order-2 flex justify-center items-center p-4 md:p-0">
                 <Image 
                  src="https://placehold.co/600x450.png" 
                  alt="Students studying for a quiz" 
                  width={600} 
                  height={450}
                  className="rounded-xl shadow-2xl object-cover aspect-[4/3]"
                  data-ai-hint="education learning"
                  priority
                />
              </div>
            </div>

            <section className="text-center py-12 md:py-16 bg-muted/30 dark:bg-muted/20 rounded-xl mb-16 md:mb-20">
                <h3 className="text-3xl font-headline font-semibold mb-10 text-foreground">How it Works</h3>
                <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8 px-6">
                    <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg">
                        <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                           <span className="text-2xl font-bold">1</span>
                        </div>
                        <h4 className="text-xl font-semibold mb-2">Enter Subject</h4>
                        <p className="text-muted-foreground text-center">Input your desired topic or subject area.</p>
                    </div>
                     <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg">
                        <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                           <span className="text-2xl font-bold">2</span>
                        </div>
                        <h4 className="text-xl font-semibold mb-2">Set Parameters</h4>
                        <p className="text-muted-foreground text-center">Choose number of questions & difficulty. Add optional notes.</p>
                    </div>
                     <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg">
                        <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                           <span className="text-2xl font-bold">3</span>
                        </div>
                        <h4 className="text-xl font-semibold mb-2">Get Quiz!</h4>
                        <p className="text-muted-foreground text-center">Our AI crafts a unique quiz just for you.</p>
                    </div>
                </div>
            </section>

            {error && !isLoading && (
              <Alert variant="destructive" className="my-10 max-w-2xl mx-auto p-6">
                <Terminal className="h-6 w-6" />
                <AlertTitle className="text-lg">Generation Error</AlertTitle>
                <AlertDescription className="text-base">{error}</AlertDescription>
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
           <Alert variant="destructive" className="my-10 p-6">
             <Terminal className="h-5 w-5" />
             <AlertTitle className="text-lg">Error</AlertTitle>
             <AlertDescription className="text-base">{error} Please try starting a new test.</AlertDescription>
             <Button onClick={handleStartNewTest} variant="outline" className="mt-6">Start New Test</Button>
           </Alert>
         )}
      </main>
      <Footer />
    </div>
  );
}
