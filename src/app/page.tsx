
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MCQForm } from '@/components/mcq/MCQForm';
import { QuizView } from '@/components/mcq/QuizView';
import { LoadingModal } from '@/components/mcq/LoadingModal'; 
import { generateMCQsAction } from '@/app/actions/generateMCQsAction';
import type { MCQ, MCQFormInput, UserAnswer, MarkedReview, QuizState } from '@/types/mcq';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Brain, BookOpen, ListChecksIcon, ZapIcon } from "lucide-react";
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

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const resetQuizState = useCallback(() => {
    setQuestions(null);
    setError(null);
    setCurrentTestParams(null);
    setQuizState('form');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setMarkedForReview([]);
    setShowLoadingModal(false);
    setTimeLeft(null);
    setIsTimerRunning(false);
  }, []);

  const handleSubmitTest = useCallback(() => {
    setQuizState('submitted');
    setIsTimerRunning(false);
    toast({
      title: "Test Submitted!",
      description: "You can now review your answers or start a new test.",
    });
  }, [toast]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft !== null && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prevTime => (prevTime !== null ? prevTime - 1 : null));
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      handleSubmitTest();
      toast({
        variant: "destructive",
        title: "Time's Up!",
        description: "Your test has been automatically submitted.",
      });
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isTimerRunning, timeLeft, handleSubmitTest, toast]);


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
      if (data.timeLimitMinutes && data.timeLimitMinutes > 0) {
        setTimeLeft(data.timeLimitMinutes * 60);
        setIsTimerRunning(true);
      } else {
        setTimeLeft(null);
        setIsTimerRunning(false);
      }
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
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleNavigateToQuestion = (index: number) => {
    if (questions && index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
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
    if (currentTestParams.timeLimitMinutes && currentTestParams.timeLimitMinutes > 0) {
      const timeTaken = (currentTestParams.timeLimitMinutes * 60) - (timeLeft ?? 0);
      const minutes = Math.floor(timeTaken / 60);
      const seconds = timeTaken % 60;
      textContent += `Time Limit: ${currentTestParams.timeLimitMinutes} minutes\n`;
      if (quizState === 'submitted' || quizState === 'reviewing') {
         textContent += `Time Taken: ${minutes}m ${seconds}s\n`;
      }
    }
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


  const featureCards = [
    {
      icon: <BookOpen className="h-10 w-10 text-accent" />,
      title: "Enter Subject",
      description: "Input your desired topic or subject area for the quiz.",
    },
    {
      icon: <ListChecksIcon className="h-10 w-10 text-accent" />,
      title: "Set Parameters",
      description: "Choose number of questions, difficulty, and time limit. Add optional notes.",
    },
    {
      icon: <ZapIcon className="h-10 w-10 text-accent" />,
      title: "Get Your Quiz!",
      description: "Our AI crafts a unique, tailored quiz just for you in seconds.",
    },
  ];


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 sm:py-20">
        <LoadingModal isOpen={showLoadingModal} />
        {quizState === 'form' && (
          <>
            <section className="mb-16 md:mb-24 text-center">
              <Brain className="mx-auto h-24 w-24 text-primary mb-8 animate-pulse" />
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-headline font-bold mb-8 text-foreground">
                Welcome to ScholarQuiz!
              </h2>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
                Generate custom multiple-choice quizzes on any subject to supercharge your learning.
                Just pick your topic, number of questions, and difficulty level to get started.
              </p>
            </section>
            
            <div className="mb-16 md:mb-24">
                <MCQForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </div>

            <section className="text-center py-16 md:py-24 bg-muted/50 dark:bg-muted/30 rounded-xl mb-16 md:mb-20">
                <h3 className="text-4xl font-headline font-semibold mb-16 text-foreground">How it Works</h3>
                <div className="max-w-5xl mx-auto grid sm:grid-cols-1 md:grid-cols-3 gap-10 px-6">
                    {featureCards.map((feature, index) => (
                       <div key={index} className="flex flex-col items-center p-8 bg-card rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                           <div className="p-5 rounded-full mb-6 bg-primary/10">
                              {feature.icon}
                           </div>
                           <h4 className="text-2xl font-semibold mb-3 text-foreground">{feature.title}</h4>
                           <p className="text-lg text-muted-foreground text-center leading-relaxed">{feature.description}</p>
                       </div>
                    ))}
                </div>
            </section>

            {error && !isLoading && (
              <Alert variant="destructive" className="my-12 max-w-2xl mx-auto p-6 shadow-lg">
                <Terminal className="h-6 w-6" />
                <AlertTitle className="text-xl font-semibold">Generation Error</AlertTitle>
                <AlertDescription className="text-lg mt-2">{error}</AlertDescription>
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
            timeLeft={timeLeft}
            isTimerRunning={isTimerRunning}
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
           <Alert variant="destructive" className="my-10 p-6 shadow-lg">
             <Terminal className="h-5 w-5" />
             <AlertTitle className="text-xl font-semibold">Error</AlertTitle>
             <AlertDescription className="text-lg mt-2">{error} Please try starting a new test.</AlertDescription>
             <Button onClick={handleStartNewTest} variant="outline" size="lg" className="mt-8 h-12 text-lg">Start New Test</Button>
           </Alert>
         )}
      </main>
      <Footer />
    </div>
  );
}
