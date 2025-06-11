
'use client';

import type { MCQ, MCQFormInput, UserAnswer, MarkedReview, QuizState } from '@/types/mcq';
import { QuestionCard } from './QuestionCard';
import { QuestionNavigationPanel } from './QuestionNavigationPanel';
import { QuizControls } from './QuizControls';
import { Button } from '@/components/ui/button';
import { Download, ListRestart, Eye, Info, Award, Clock, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuizViewProps {
  questions: MCQ[];
  testParams: MCQFormInput;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  markedForReview: MarkedReview[];
  quizState: QuizState;
  timeLeft: number | null;
  isTimerRunning: boolean;
  onSelectAnswer: (questionIndex: number, answerIndex: number) => void;
  onMarkForReview: (questionIndex: number) => void;
  onClearChoice: (questionIndex: number) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onNavigateToQuestion: (questionIndex: number) => void;
  onSubmitTest: () => void;
  onStartReview: () => void;
  onStartNewTest: () => void;
  onExportResults: () => void;
}

function formatTime(totalSeconds: number | null): string {
  if (totalSeconds === null || totalSeconds < 0) return "--:--";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function QuizView({
  questions,
  testParams,
  currentQuestionIndex,
  userAnswers,
  markedForReview,
  quizState,
  timeLeft,
  isTimerRunning,
  onSelectAnswer,
  onMarkForReview,
  onClearChoice,
  onNextQuestion,
  onPreviousQuestion,
  onNavigateToQuestion,
  onSubmitTest,
  onStartReview,
  onStartNewTest,
  onExportResults,
}: QuizViewProps) {
  const currentQuestion = questions[currentQuestionIndex];

  let score = 0;
  let scorePercentage = 0;
  if (quizState === 'reviewing' || quizState === 'submitted') {
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });
    scorePercentage = questions.length > 0 ? (score / questions.length) * 100 : 0;
  }

  const quizTitle =
    quizState === 'reviewing' ? 'Review Your Answers' :
    quizState === 'submitted' ? 'Test Submitted!' :
    `Quiz in Progress`;

  return (
    <div className="mt-2 sm:mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-semibold text-center sm:text-left">
          {quizTitle}
        </h2>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          {quizState === 'submitted' && (
            <Button onClick={onStartReview} variant="default" size="default" className="h-10 text-sm px-5">
              <Eye className="mr-2 h-4 w-4" /> Review Answers
            </Button>
          )}
          {(quizState === 'reviewing' || quizState === 'submitted') && (
             <Button onClick={onExportResults} variant="outline" size="default" className="h-10 text-sm px-5">
                <Download className="mr-2 h-4 w-4" /> Export Results
             </Button>
          )}
          <Button onClick={onStartNewTest} variant="destructive" size="default" className="h-10 text-sm px-5">
            <ListRestart className="mr-2 h-4 w-4" /> Start New Test
          </Button>
        </div>
      </div>

      {/* Sticky Test Details and Timer Bar */}
       <div className={cn(
          "sticky top-[calc(var(--header-height,80px)_-_1px)] z-30 bg-background/80 backdrop-blur-md mb-6 shadow-sm",
          "lg:top-[calc(var(--header-height,80px)_-_1px)]" // Adjust based on actual header height
        )}>
        <Alert className="p-4 border-x-0 border-t-0 rounded-none sm:rounded-lg sm:border">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
                <div className="flex-grow">
                    <div className="flex items-center mb-1">
                        <Info className="h-5 w-5 text-primary mr-2" />
                        <AlertTitle className="font-headline text-primary text-lg">Test Details</AlertTitle>
                    </div>
                    <AlertDescription className="text-xs text-muted-foreground space-y-0.5">
                    <div>Subject: <span className="font-semibold text-foreground">{testParams.subject}</span>
                        {testParams.specificExam && <> | Exam: <span className="font-semibold text-foreground">{testParams.specificExam}</span></>}
                    </div>
                    <div>Questions: <span className="font-semibold text-foreground">{questions.length}</span> | Difficulty: <span className="font-semibold capitalize text-foreground">{testParams.difficulty}</span>
                        {(quizState === 'reviewing' || quizState === 'submitted') && (
                            <> | Score: <span className="font-semibold text-foreground">{score}/{questions.length} ({scorePercentage.toFixed(1)}%)</span></>
                        )}
                    </div>
                    </AlertDescription>
                </div>
                {testParams.timeLimitMinutes && testParams.timeLimitMinutes > 0 && (
                    <div className="text-center sm:text-right shrink-0">
                        <div className="text-xs text-muted-foreground mb-0.5">Time Remaining</div>
                        <div className={cn(
                            "font-mono text-2xl font-bold",
                            timeLeft !== null && timeLeft <= 60 && timeLeft > 0 ? "text-destructive animate-pulse" : "text-primary"
                            )}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                )}
            </div>
        </Alert>
      </div>


      {quizState === 'submitted' && (
         <Card className="text-center p-6 sm:p-10 shadow-xl my-10 bg-gradient-to-br from-card to-muted/30">
           <CardHeader className="pb-3">
            <Award className="mx-auto h-20 w-20 text-yellow-500 mb-6" />
            <CardTitle className="text-3xl sm:text-4xl font-semibold mb-3">Test Completed!</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              You've successfully finished the quiz.
            </CardDescription>
           </CardHeader>
           <CardContent className="pt-3">
            <p className="text-xl text-foreground mb-8">
              Your score is <strong className="text-2xl">{score} out of {questions.length}</strong> ({scorePercentage.toFixed(1)}%).
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button onClick={onStartReview} size="lg" className="h-12 text-md px-6">
                    <Eye className="mr-2.5 h-5 w-5" /> Review Answers
                </Button>
                <Button onClick={onStartNewTest} variant="outline" size="lg" className="h-12 text-md px-6">
                    <ListRestart className="mr-2.5 h-5 w-5" /> Start Another Test
                </Button>
            </div>
           </CardContent>
        </Card>
      )}

      {(quizState === 'taking' || quizState === 'reviewing') && currentQuestion && (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <div className="lg:flex-grow order-2 lg:order-1 min-w-0 w-full">
            {quizState === 'taking' &&
              <div className="text-md font-medium text-muted-foreground mb-4 text-center lg:text-left">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            }
            <QuestionCard
              key={`${currentQuestionIndex}-${quizState}-${currentQuestion.questionText.slice(0,10)}`}
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswerProp={userAnswers[currentQuestionIndex]}
              onSelectAnswer={(answerIndex) => onSelectAnswer(currentQuestionIndex, answerIndex)}
              isReviewMode={quizState === 'reviewing'}
              isDisabled={quizState !== 'taking'}
            />
            <QuizControls
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              onNext={onNextQuestion}
              onPrevious={onPreviousQuestion}
              onMarkForReview={() => onMarkForReview(currentQuestionIndex)}
              onClearChoice={() => onClearChoice(currentQuestionIndex)}
              onSubmitTest={onSubmitTest}
              isMarked={markedForReview[currentQuestionIndex]}
              quizState={quizState}
              canClearChoice={userAnswers[currentQuestionIndex] !== null && quizState === 'taking'}
            />
          </div>
          <div className="lg:w-[20rem] xl:w-[22rem] order-1 lg:order-2 flex-shrink-0 w-full lg:sticky lg:top-[calc(var(--header-height,80px)_+_var(--test-details-height,110px)_-_1px)]"> {/* Adjust top based on header and sticky alert */}
            <QuestionNavigationPanel
              questions={questions}
              totalQuestions={questions.length}
              currentQuestionIndex={currentQuestionIndex}
              userAnswers={userAnswers}
              markedForReview={markedForReview}
              onNavigateToQuestion={onNavigateToQuestion}
              quizState={quizState}
            />
          </div>
        </div>
      )}
    </div>
  );
}
