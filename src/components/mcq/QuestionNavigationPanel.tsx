
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { UserAnswer, MarkedReview, QuizState, MCQ } from '@/types/mcq';
import { Eye, CheckCircle, XCircle, Circle, HelpCircle, Edit3, FileQuestion, CheckSquare, AlertTriangle } from 'lucide-react';

interface QuestionNavigationPanelProps {
  questions: MCQ[];
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

  const getStatusIconAndStyle = (index: number) => {
    const isCurrent = index === currentQuestionIndex;
    const isAnswered = userAnswers[index] !== null;
    const isMarked = markedForReview[index];
    const question = questions[index];
    const userAnswer = userAnswers[index];

    let statusStyle = "border-border hover:bg-accent/10 dark:hover:bg-accent/20";
    let icon = null;
    let srText = `Question ${index + 1}`;

    if (quizState === 'reviewing') {
      if (userAnswer === question.correctAnswer) { // Correct
        statusStyle = "bg-green-100 border-green-500 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-800/40";
        icon = <CheckCircle className="h-3.5 w-3.5" />;
        srText += ", Correct";
      } else if (isAnswered && userAnswer !== question.correctAnswer) { // Incorrect
        statusStyle = "bg-red-100 border-red-500 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-800/40";
        icon = <XCircle className="h-3.5 w-3.5" />;
        srText += ", Incorrect";
      } else { // Not Answered in review
         statusStyle = "bg-amber-100 border-amber-500 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-800/40";
         icon = <AlertTriangle className="h-3.5 w-3.5 opacity-80" />;
         srText += ", Not Answered";
      }
      if (isCurrent) {
         statusStyle = `${statusStyle} ring-2 ring-primary ring-offset-1 dark:ring-offset-background shadow-md`;
         srText += ", Currently Viewing";
      }
    } else { // Taking quiz
      if (isCurrent) {
        statusStyle = "bg-primary text-primary-foreground hover:bg-primary/90 ring-2 ring-primary/50 ring-offset-1 dark:ring-offset-background shadow-md";
        srText += ", Currently Viewing";
        icon = <Edit3 className="h-3.5 w-3.5"/>;
      } else if (isMarked) {
        statusStyle = "bg-yellow-400/30 border-yellow-500 text-yellow-700 hover:bg-yellow-400/50 dark:bg-yellow-500/20 dark:border-yellow-600 dark:text-yellow-400 dark:hover:bg-yellow-500/30";
        srText += ", Marked for Review";
        icon = <Eye className="h-3.5 w-3.5" />;
      } else if (isAnswered) {
        statusStyle = "bg-green-100 border-green-500 text-green-700 hover:bg-green-200/70 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-800/40";
        srText += ", Answered";
        icon = <CheckSquare className="h-3.5 w-3.5" />;
      } else { // Unanswered
        statusStyle = "border-border hover:bg-muted/50 dark:hover:bg-muted/40";
        srText += ", Unanswered";
        icon = <FileQuestion className="h-3.5 w-3.5 opacity-60"/>;
      }
    }
    return { statusStyle, icon, srText };
  };

  const legendItems = quizState === 'reviewing' ? [
    { label: "Correct", icon: <CheckCircle className="h-3.5 w-3.5 text-green-500" />, style: "bg-green-100/80 dark:bg-green-900/50 border-green-500" },
    { label: "Incorrect", icon: <XCircle className="h-3.5 w-3.5 text-red-500" />, style: "bg-red-100/80 dark:bg-red-900/50 border-red-500" },
    { label: "Not Answered", icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />, style: "bg-amber-100/80 dark:bg-amber-900/50 border-amber-500" },
    { label: "Current", icon: <Edit3 className="h-3.5 w-3.5 text-primary" />, style: "ring-1 ring-primary" },
  ] : [
    { label: "Current", icon: <Edit3 className="h-3.5 w-3.5 text-primary-foreground"/>, style: "bg-primary text-primary-foreground" },
    { label: "Answered", icon: <CheckSquare className="h-3.5 w-3.5 text-green-700 dark:text-green-400"/>, style: "bg-green-100 dark:bg-green-900/30 border-green-500" },
    { label: "Marked", icon: <Eye className="h-3.5 w-3.5 text-yellow-700 dark:text-yellow-400" />, style: "bg-yellow-400/30 border-yellow-500" },
    { label: "Unanswered", icon: <FileQuestion className="h-3.5 w-3.5 text-muted-foreground opacity-70"/>, style: "border-border" },
  ];

  return (
    <Card className="shadow-lg border-border/60 max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-15rem)] flex flex-col"> {/* Adjusted max-height */}
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-lg font-headline text-center">Question Palette</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow overflow-hidden flex flex-col">
        <ScrollArea className="flex-grow pr-2 -mr-2">
          <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-2.5">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const { statusStyle, icon, srText } = getStatusIconAndStyle(index);
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "h-10 w-10 sm:h-11 sm:w-11 p-0 relative flex items-center justify-center text-sm font-medium rounded-md aspect-square transition-all",
                    statusStyle
                  )}
                  onClick={() => onNavigateToQuestion(index)}
                  aria-label={srText}
                >
                  {/* Always render the number */}
                  <span>{index + 1}</span>
                  {/* If an icon exists, render it overlaid */}
                  {icon && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      {icon}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        <div className="mt-4 border-t border-border/50 pt-3">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2.5 text-center">Legend</h4>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            {legendItems.map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={cn("h-4 w-4 rounded inline-flex items-center justify-center shrink-0 border text-xs", item.style, 'p-0.5')}>
                  {item.icon && item.icon}
                </span>
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

