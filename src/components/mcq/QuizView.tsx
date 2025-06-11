
'use client';

import type { MCQ, MCQFormInput, UserAnswer, MarkedReview, QuizState } from '@/types/mcq';
import { QuestionCard } from './QuestionCard';
import { QuestionNavigationPanel } from './QuestionNavigationPanel';
import { QuizControls } from './QuizControls';
import { Button } from '@/components/ui/button';
import { Download, ListRestart, Eye, Info, Award, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
    <div className="mt-4 sm:mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-semibold text-center sm:text-left">
          {quizTitle}
        </h2>
        <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
          {quizState === 'submitted' && (
            <Button onClick={onStartReview} variant="default" size="lg" className="h-12 text-md px-6">
              <Eye className="mr-2 h-5 w-5" /> Review Answers
            </Button>
          )}
          {(quizState === 'reviewing' || quizState === 'submitted') && (
             <Button onClick={onExportResults} variant="outline" size="lg" className="h-12 text-md px-6">
                <Download className="mr-2 h-5 w-5" /> Export Results
             </Button>
          )}
          <Button onClick={onStartNewTest} variant="destructive" size="lg" className="h-12 text-md px-6">
            <ListRestart className="mr-2 h-5 w-5" /> Start New Test
          </Button>
        </div>
      </div>
      
      <Alert className="mb-10 p-6 bg-card border-border/60 text-foreground shadow-lg">
        <Info className="h-6 w-6 text-primary" />
        <AlertTitle className="font-headline text-primary text-xl mb-2">Test Details</AlertTitle>
        <AlertDescription className="text-md text-muted-foreground space-y-1.5">
          <div>Subject: <span className="font-semibold text-foreground">{testParams.subject}</span></div>
          {testParams.specificExam && <div>Exam Focus: <span className="font-semibold text-foreground">{testParams.specificExam}</span></div>}
          <div>Questions: <span className="font-semibold text-foreground">{questions.length}</span> | Difficulty: <span className="font-semibold capitalize text-foreground">{testParams.difficulty}</span></div>
          {testParams.timeLimitMinutes && testParams.timeLimitMinutes > 0 && (
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary/80" />
              Time Limit: <span className="font-semibold text-foreground ml-1">{testParams.timeLimitMinutes} minutes</span>
              {isTimerRunning && timeLeft !== null && (
                <span className="ml-auto font-mono text-lg font-semibold text-primary">{formatTime(timeLeft)}</span>
              )}
            </div>
          )}
          {(quizState === 'reviewing' || quizState === 'submitted') && (
            <div>Score: <span className="font-semibold text-foreground">{score}/{questions.length} ({scorePercentage.toFixed(1)}%)</span></div>
          )}
        </AlertDescription>
      </Alert>

      {quizState === 'submitted' && (
         <Card className="text-center p-8 sm:p-12 shadow-xl my-12 bg-gradient-to-br from-card to-muted/30">
           <CardHeader className="pb-4">
            <Award className="mx-auto h-24 w-24 text-yellow-500 mb-8" />
            <CardTitle className="text-4xl sm:text-5xl font-semibold mb-4">Test Completed!</CardTitle>
            <CardDescription className="text-xl text-muted-foreground">
              You've successfully finished the quiz.
            </CardDescription>
           </CardHeader>
           <CardContent className="pt-4">
            <p className="text-2xl text-foreground mb-10">
              Your score is <strong className="text-3xl">{score} out of {questions.length}</strong> ({scorePercentage.toFixed(1)}%).
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Button onClick={onStartReview} size="xl" className="h-16 text-lg px-8">
                    <Eye className="mr-3 h-6 w-6" /> Review Answers
                </Button>
                <Button onClick={onStartNewTest} variant="outline" size="xl" className="h-16 text-lg px-8">
                    <ListRestart className="mr-3 h-6 w-6" /> Start Another Test
                </Button>
            </div>
           </CardContent>
        </Card>
      )}

      {(quizState === 'taking' || quizState === 'reviewing') && currentQuestion && (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <div className="lg:flex-grow order-2 lg:order-1 min-w-0 w-full">
            {quizState === 'taking' && 
              <div className="text-lg font-medium text-muted-foreground mb-5 text-center lg:text-left">
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
          <div className="lg:w-[24rem] xl:w-[26rem] order-1 lg:order-2 flex-shrink-0 w-full lg:sticky lg:top-24">
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
