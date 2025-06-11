'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { UserAnswer, MarkedReview, QuizState, MCQ } from '@/types/mcq';
import { Eye, CheckCircle, XCircle, Circle } from 'lucide-react';

interface QuestionNavigationPanelProps {
  questions: MCQ[]; // Need questions for review mode styling
  totalQuestions: number;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  markedForReview: MarkedReview[];
  onNavigateToQuestion: (index: number) => void;
  quizState: QuizState;
}

export function QuestionNavigationPanel({
  questions,
  totalQuestions,
  currentQuestionIndex,
  userAnswers,
  markedForReview,
  onNavigateToQuestion,
  quizState
}: QuestionNavigationPanelProps) {
  return (
    <Card className="sticky top-24 shadow-lg">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-headline text-center">Question Palette</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ScrollArea className="h-[calc(100vh-20rem)] sm:h-auto sm:max-h-[60vh] md:max-h-[calc(100vh-12rem)] pr-3"> {/* Adjusted height */}
          <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-4 gap-2">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const isCurrent = index === currentQuestionIndex;
              const isAnswered = userAnswers[index] !== null;
              const isMarked = markedForReview[index];
              const question = questions[index];
              const userAnswer = userAnswers[index];
              
              let statusStyle = "border-border hover:bg-accent/20";
              let icon = null;

              if (quizState === 'reviewing') {
                if (isAnswered) {
                  if (userAnswer === question.correctAnswer) {
                    statusStyle = "bg-green-100 border-green-500 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-800/60";
                    icon = <CheckCircle className="h-3 w-3 mr-0.5" />;
                  } else {
                    statusStyle = "bg-red-100 border-red-500 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-800/60";
                    icon = <XCircle className="h-3 w-3 mr-0.5" />;
                  }
                } else { // Not answered in review
                   statusStyle = "bg-gray-100 border-gray-400 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/50 dark:border-gray-500 dark:text-gray-400 dark:hover:bg-gray-600/60";
                   icon = <Circle className="h-3 w-3 mr-0.5 opacity-70" />; // Unanswered
                }
                if (isCurrent) {
                   statusStyle = `${statusStyle} ring-2 ring-primary ring-offset-1`;
                }

              } else { // Taking quiz
                if (isCurrent) {
                  statusStyle = "bg-primary text-primary-foreground hover:bg-primary/90";
                } else if (isMarked) {
                  statusStyle = "bg-yellow-400 border-yellow-500 text-yellow-900 hover:bg-yellow-500/80 dark:bg-yellow-600 dark:border-yellow-700 dark:text-yellow-100 dark:hover:bg-yellow-700";
                } else if (isAnswered) {
                  statusStyle = "bg-muted text-muted-foreground hover:bg-muted/80";
                } else { // Unanswered, not current, not marked
                  statusStyle = "border-border hover:bg-accent/20";
                }
              }
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-9 w-9 relative flex items-center justify-center text-sm font-medium",
                    statusStyle
                  )}
                  onClick={() => onNavigateToQuestion(index)}
                  aria-label={`Go to question ${index + 1}`}
                >
                  {icon}
                  <span>{index + 1}</span>
                  {quizState === 'taking' && isMarked && !isCurrent && (
                     <Eye className="absolute -top-1 -right-1 h-3.5 w-3.5 text-yellow-700 dark:text-yellow-300 bg-card p-0.5 rounded-full shadow" />
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
         {quizState === 'reviewing' && (
          <div className="mt-4 space-y-1 text-xs text-muted-foreground border-t pt-3">
            <p className="flex items-center"><CheckCircle className="h-3 w-3 mr-1.5 text-green-500" /> Correct</p>
            <p className="flex items-center"><XCircle className="h-3 w-3 mr-1.5 text-red-500" /> Incorrect</p>
            <p className="flex items-center"><Circle className="h-3 w-3 mr-1.5 text-gray-500" /> Not Answered</p>
          </div>
        )}
        {quizState === 'taking' && (
          <div className="mt-4 space-y-1 text-xs text-muted-foreground border-t pt-3">
            <p className="flex items-center"><Button variant="outline" size="icon" className="h-4 w-4 mr-1.5 bg-primary text-primary-foreground pointer-events-none"></Button> Current</p>
            <p className="flex items-center"><Button variant="outline" size="icon" className="h-4 w-4 mr-1.5 bg-muted text-muted-foreground pointer-events-none"></Button> Answered</p>
            <p className="flex items-center"><Button variant="outline" size="icon" className="h-4 w-4 mr-1.5 bg-yellow-400 border-yellow-500 pointer-events-none"></Button> Marked</p>
            <p className="flex items-center"><Button variant="outline" size="icon" className="h-4 w-4 mr-1.5 border-border pointer-events-none"></Button> Unanswered</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
