
'use client';

import { useState, useEffect, useCallback } from 'react';
import { MCQForm } from '@/components/mcq/MCQForm';
import { QuizView } from '@/components/mcq/QuizView';
import { LoadingModal } from '@/components/mcq/LoadingModal';
import { generateMCQsAction } from '@/app/actions/generateMCQsAction';
import { saveQuizAction } from '@/app/actions/quizActions';
import type { MCQ, MCQFormInput, UserAnswer, MarkedReview, QuizState } from '@/types/mcq';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, BookOpen, ListChecksIcon, ZapIcon } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function NewQuizPage() {
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
  
  // State for time tracking
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null); // Quiz start time
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null); // Individual question start time
  const [questionTimings, setQuestionTimings] = useState<number[]>([]);


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
    setStartTime(null);
    setQuestionStartTime(null);
    setQuestionTimings([]);
  }, []);

  const recordTime = useCallback((indexToRecord: number) => {
    if (questionStartTime && quizState === 'taking') {
        const timeSpent = (Date.now() - questionStartTime) / 1000; // in seconds
        setQuestionTimings(prev => {
            const newTimings = [...prev];
            // Add time spent to the question we are leaving
            newTimings[indexToRecord] = (newTimings[indexToRecord] || 0) + timeSpent;
            return newTimings;
        });
    }
    setQuestionStartTime(Date.now());
  }, [questionStartTime, quizState]);

  const handleSubmitTest = useCallback(async () => {
    setIsTimerRunning(false);
    setQuizState('submitted');
    
    // Record time for the final question before submitting
    let finalTimings = [...questionTimings];
    if (questionStartTime && quizState === 'taking') {
        const timeSpent = (Date.now() - questionStartTime) / 1000;
        finalTimings[currentQuestionIndex] = (finalTimings[currentQuestionIndex] || 0) + timeSpent;
        setQuestionTimings(finalTimings);
    }
    
    if (questions && currentTestParams) {
        let score = 0;
        questions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correctAnswer) {
                score++;
            }
        });
        
        const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : undefined;

        // The save action now handles both authenticated and anonymous users
        const result = await saveQuizAction({
            testParams: currentTestParams,
            questions,
            userAnswers,
            score,
            timeTaken,
            questionTimings: finalTimings,
        });

        if (result.success) {
             if (result.saved) {
                toast({
                    title: "Test Submitted & Saved!",
                    description: "Your results and AI analysis have been saved to your history.",
                });
             } else {
                toast({
                    title: "Test Submitted!",
                    description: "Log in to save your results for future analysis.",
                });
             }
        } else {
             toast({
                variant: "destructive",
                title: "Submission Error",
                description: result.error || "Could not save your test results.",
             });
        }
    } else {
         toast({
            title: "Test Submitted!",
            description: "You can now review your answers or start a new test.",
        });
    }

  }, [toast, questions, currentTestParams, userAnswers, startTime, questionTimings, questionStartTime, quizState, currentQuestionIndex]);

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
      setQuestionTimings(new Array(result.data.length).fill(0)); // Initialize timings array
      setCurrentQuestionIndex(0);
      setQuizState('taking');
      setStartTime(Date.now());
      setQuestionStartTime(Date.now()); // Start timer for the first question
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
      recordTime(currentQuestionIndex);
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      recordTime(currentQuestionIndex);
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNavigateToQuestion = (index: number) => {
    if (questions && index >= 0 && index < questions.length) {
      if (index !== currentQuestionIndex) {
        recordTime(currentQuestionIndex);
        setCurrentQuestionIndex(index);
      }
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
      const timeForQuestion = questionTimings[index] ? Math.round(questionTimings[index]) : 0;

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
      icon: <BookOpen className="h-6 w-6 text-accent" />,
      title: "Enter Subject",
      description: "Input topic for quiz.",
    },
    {
      icon: <ListChecksIcon className="h-6 w-6 text-accent" />,
      title: "Set Parameters",
      description: "Choose questions, difficulty, etc.",
    },
    {
      icon: <ZapIcon className="h-6 w-6 text-accent" />,
      title: "Get Your Quiz!",
      description: "AI crafts a unique quiz instantly.",
    },
  ];


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-10">
        <LoadingModal isOpen={showLoadingModal} />
        {quizState === 'form' && (
          <div className="grid md:grid-cols-10 gap-x-8 lg:gap-x-12 items-start">
            {/* Left Column (30%) - Order 2 on mobile, Order 1 on md+ */}
            <div className="order-2 md:order-1 md:col-span-3 space-y-6 md:sticky md:top-[calc(var(--header-height,80px)_+_2rem)]">
              <div className="mb-6">
                
                <p className="text-md text-muted-foreground">
                  Generate custom MCQs on any subject to boost your learning.
                </p>
              </div>
              
              <section className="text-left py-6 bg-muted/30 dark:bg-muted/20 rounded-xl p-5">
                  <h3 className="text-xl font-headline font-semibold mb-4 text-foreground">How it Works</h3>
                  <div className="space-y-4">
                      {featureCards.map((feature, index) => (
                         <div key={index} className="flex items-start p-3 bg-card/50 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out">
                             <div className="p-2 rounded-full mr-3 bg-primary/10 shrink-0">
                                {feature.icon}
                             </div>
                             <div>
                               <h4 className="text-md font-semibold mb-0.5 text-foreground">{feature.title}</h4>
                               <p className="text-xs text-muted-foreground leading-snug">{feature.description}</p>
                             </div>
                         </div>
                      ))}
                  </div>
              </section>
            </div>

            {/* Right Column (70%) - Order 1 on mobile, Order 2 on md+ */}
            <div className="order-1 md:order-2 md:col-span-7">
                <MCQForm onSubmit={handleFormSubmit} isLoading={isLoading} />
                 {error && !isLoading && (
                  <Alert variant="destructive" className="mt-6 p-4 shadow-md">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle className="text-md font-semibold">Generation Error</AlertTitle>
                    <AlertDescription className="text-sm mt-1">{error}</AlertDescription>
                  </Alert>
                )}
            </div>
          </div>
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
           <Alert variant="destructive" className="my-8 p-5 shadow-lg">
             <Terminal className="h-5 w-5" />
             <AlertTitle className="text-lg font-semibold">Error</AlertTitle>
             <AlertDescription className="text-md mt-1">{error} Please try starting a new test.</AlertDescription>
             <Button onClick={handleStartNewTest} variant="outline" size="lg" className="mt-6 h-11 text-md">Start New Test</Button>
           </Alert>
         )}
      </main>
    </div>
  );
}
