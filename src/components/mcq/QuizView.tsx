'use client';

import type { MCQ, MCQFormInput, UserAnswer, MarkedReview, QuizState } from '@/types/mcq';
import { QuestionCard } from './QuestionCard';
import { QuestionNavigationPanel } from './QuestionNavigationPanel';
import { QuizControls } from './QuizControls';
import { Button } from '@/components/ui/button';
import { Download, ListRestart, Eye, Info, CheckCircle, Award } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizViewProps {
  questions: MCQ[];
  testParams: MCQFormInput;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  markedForReview: MarkedReview[];
  quizState: QuizState;
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

export function QuizView({
  questions,
  testParams,
  currentQuestionIndex,
  userAnswers,
  markedForReview,
  quizState,
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
    `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  return (
    <div className="mt-2 sm:mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-headline font-semibold text-center sm:text-left">
          {quizTitle}
        </h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {quizState === 'submitted' && (
            <Button onClick={onStartReview} variant="default" size="sm">
              <Eye className="mr-2 h-4 w-4" /> Review Answers
            </Button>
          )}
          {(quizState === 'reviewing' || quizState === 'submitted') && (
             <Button onClick={onExportResults} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Export Results
             </Button>
          )}
          <Button onClick={onStartNewTest} variant="destructive" size="sm">
            <ListRestart className="mr-2 h-4 w-4" /> Start New Test
          </Button>
        </div>
      </div>
      
      <Alert className="mb-6 bg-card border-border/60 text-foreground shadow-sm">
        <Info className="h-5 w-5 text-primary" />
        <AlertTitle className="font-headline text-primary">Test Details</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          Subject: <span className="font-semibold text-foreground">{testParams.subject}</span> | 
          Questions: <span className="font-semibold text-foreground">{questions.length}</span> | 
          Difficulty: <span className="font-semibold capitalize text-foreground">{testParams.difficulty}</span>
          {(quizState === 'reviewing' || quizState === 'submitted') && (
            <>
              {' | '} Score: <span className="font-semibold text-foreground">{score}/{questions.length} ({scorePercentage.toFixed(1)}%)</span>
            </>
          )}
        </AlertDescription>
      </Alert>

      {quizState === 'submitted' && (
         <Card className="text-center p-6 sm:p-8 shadow-xl my-8 bg-gradient-to-br from-card to-muted/30">
           <CardHeader className="pb-2">
            <Award className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
            <CardTitle className="text-2xl sm:text-3xl font-semibold mb-2">Test Completed!</CardTitle>
           </CardHeader>
           <CardContent>
            <p className="text-muted-foreground text-lg mb-6">
              Great job on finishing the test! Your score is <strong className="text-foreground">{score} out of {questions.length}</strong> ({scorePercentage.toFixed(1)}%).
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={onStartReview} size="lg">
                    <Eye className="mr-2 h-5 w-5" /> Review Answers
                </Button>
                <Button onClick={onStartNewTest} variant="outline" size="lg">
                    <ListRestart className="mr-2 h-5 w-5" /> Start Another Test
                </Button>
            </div>
           </CardContent>
        </Card>
      )}

      {(quizState === 'taking' || quizState === 'reviewing') && currentQuestion && (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-grow order-2 lg:order-1 min-w-0"> {/* Added min-w-0 for flex child issues */}
            <QuestionCard
              key={`${currentQuestionIndex}-${quizState}`} 
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
          <div className="lg:w-72 xl:w-80 order-1 lg:order-2 flex-shrink-0">
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
