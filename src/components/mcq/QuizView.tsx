'use client';

import type { MCQ, MCQFormInput, UserAnswer, MarkedReview, QuizState } from '@/types/mcq';
import { QuestionCard } from './QuestionCard';
import { QuestionNavigationPanel } from './QuestionNavigationPanel';
import { QuizControls } from './QuizControls';
import { Button } from '@/components/ui/button';
import { Download, ListRestart, Eye, Info } from 'lucide-react';
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
  if (quizState === 'reviewing' || quizState === 'submitted') {
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-headline font-semibold">
          {quizState === 'reviewing' ? 'Review Your Answers' : 
           quizState === 'submitted' ? 'Test Submitted' : 
           `Question ${currentQuestionIndex + 1} of ${questions.length}`}
        </h2>
        <div className="flex gap-2">
          {quizState === 'submitted' && (
            <Button onClick={onStartReview} variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Eye className="mr-2 h-4 w-4" /> Review Answers
            </Button>
          )}
          {quizState === 'reviewing' && (
             <Button onClick={onExportResults} variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export Results
             </Button>
          )}
          <Button onClick={onStartNewTest} variant="destructive">
            <ListRestart className="mr-2 h-4 w-4" /> Start New Test
          </Button>
        </div>
      </div>
      
      <Alert className="mb-6 bg-card border-border text-foreground shadow">
        <Info className="h-5 w-5 text-primary" />
        <AlertTitle className="font-headline text-primary">Test Details</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Subject: <span className="font-semibold">{testParams.subject}</span> | 
          Questions: <span className="font-semibold">{testParams.numQuestions}</span> | 
          Difficulty: <span className="font-semibold capitalize">{testParams.difficulty}</span>
          {(quizState === 'reviewing' || quizState === 'submitted') && (
            <>
              {' | '} Score: <span className="font-semibold">{score}/{questions.length} ({(score/questions.length * 100).toFixed(1)}%)</span>
            </>
          )}
        </AlertDescription>
      </Alert>

      {quizState === 'submitted' && (
         <Card className="text-center p-8 shadow-xl my-8">
           <CardHeader>
            <CardTitle className="text-2xl font-semibold mb-4">Test Submitted Successfully!</CardTitle>
           </CardHeader>
           <CardContent>
            <p className="text-muted-foreground mb-6">
              You have completed the test. Your score is {score} out of {questions.length}.
              Click "Review Answers" to see the detailed solutions or "Start New Test" to try another quiz.
            </p>
           </CardContent>
        </Card>
      )}

      {(quizState === 'taking' || quizState === 'reviewing') && currentQuestion && (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:flex-grow order-2 md:order-1">
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
          <div className="md:w-64 lg:w-72 order-1 md:order-2 flex-shrink-0">
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
