'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { UserAnswer, MarkedReview, QuizState, MCQ } from '@/types/mcq';
import { Eye, CheckCircle, XCircle, Circle, HelpCircle, Edit3 } from 'lucide-react';

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
      if (isAnswered) {
        if (userAnswer === question.correctAnswer) {
          statusStyle = "bg-green-100 border-green-500 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-800/40";
          icon = <CheckCircle className="h-3.5 w-3.5" />;
          srText += ", Correct";
        } else {
          statusStyle = "bg-red-100 border-red-500 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-800/40";
          icon = <XCircle className="h-3.5 w-3.5" />;
          srText += ", Incorrect";
        }
      } else { 
         statusStyle = "bg-gray-100 border-gray-400 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/30 dark:border-gray-500 dark:text-gray-400 dark:hover:bg-gray-600/40";
         icon = <HelpCircle className="h-3.5 w-3.5 opacity-70" />;
         srText += ", Not Answered";
      }
      if (isCurrent) {
         statusStyle = `${statusStyle} ring-2 ring-primary ring-offset-2 dark:ring-offset-background`;
         srText += ", Currently Viewing";
      }
    } else { // Taking quiz
      if (isCurrent) {
        statusStyle = "bg-primary text-primary-foreground hover:bg-primary/90 ring-2 ring-primary/50 ring-offset-2 dark:ring-offset-background";
        srText += ", Currently Viewing";
      } else if (isMarked) {
        statusStyle = "bg-yellow-400/30 border-yellow-500 text-yellow-700 hover:bg-yellow-400/50 dark:bg-yellow-500/20 dark:border-yellow-600 dark:text-yellow-400 dark:hover:bg-yellow-500/30";
        srText += ", Marked for Review";
      } else if (isAnswered) {
        statusStyle = "bg-muted border-muted-foreground/30 text-muted-foreground hover:bg-muted/80 dark:bg-muted/50";
        srText += ", Answered";
      } else { 
        statusStyle = "border-border hover:bg-accent/10 dark:hover:bg-accent/20";
        srText += ", Unanswered";
      }
    }
    return { statusStyle, icon, srText };
  };

  const legendItems = quizState === 'reviewing' ? [
    { label: "Correct", icon: <CheckCircle className="h-4 w-4 text-green-500" />, style: "bg-green-100 border-green-500" },
    { label: "Incorrect", icon: <XCircle className="h-4 w-4 text-red-500" />, style: "bg-red-100 border-red-500" },
    { label: "Not Answered", icon: <HelpCircle className="h-4 w-4 text-gray-500" />, style: "bg-gray-100 border-gray-400" },
    { label: "Current", icon: <Edit3 className="h-4 w-4 text-primary" />, style: "ring-2 ring-primary" },
  ] : [
    { label: "Current", style: "bg-primary text-primary-foreground" },
    { label: "Answered", style: "bg-muted text-muted-foreground" },
    { label: "Marked", icon: <Eye className="h-3 w-3 text-yellow-700 dark:text-yellow-300" />, style: "bg-yellow-400/30 border-yellow-500" },
    { label: "Unanswered", style: "border-border" },
  ];

  return (
    <Card className="sticky top-20 shadow-lg border-border/60 max-h-[calc(100vh-6rem)] flex flex-col">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-lg font-headline text-center">Question Palette</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow overflow-hidden flex flex-col">
        <ScrollArea className="flex-grow pr-1 -mr-1"> {/* Adjust pr and -mr for scrollbar visibility */}
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const { statusStyle, icon, srText } = getStatusIconAndStyle(index);
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "h-10 w-10 p-0 relative flex items-center justify-center text-sm font-medium rounded-md aspect-square",
                    statusStyle
                  )}
                  onClick={() => onNavigateToQuestion(index)}
                  aria-label={srText}
                >
                  {icon && <span className="absolute inset-0 flex items-center justify-center">{icon}</span>}
                  <span className={cn(icon ? 'opacity-0' : '')}>{index + 1}</span>
                  {quizState === 'taking' && markedForReview[index] && index !== currentQuestionIndex && (
                     <Eye className="absolute top-0.5 right-0.5 h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400 bg-card p-0.5 rounded-full shadow-md" />
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        <div className="mt-4 border-t border-border/50 pt-3">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 text-center">Legend</h4>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            {legendItems.map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={cn("h-4 w-4 rounded-sm inline-flex items-center justify-center shrink-0 border", item.style, quizState === 'reviewing' ? 'p-0.5' : '')}>
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
