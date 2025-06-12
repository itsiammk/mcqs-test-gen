
'use client';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { UserAnswer, MarkedReview, QuizState, MCQ } from '@/types/mcq';
import { Eye, CheckSquare, XCircle, Circle, HelpCircle, Edit3, FileQuestion, CheckCircle, AlertTriangle } from 'lucide-react'; // Added CheckCircle

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

    let statusStyle = "border-input hover:bg-muted dark:hover:bg-muted/80 text-foreground"; // Default for unanswered
    let IconComponent: LucideIcon | null = FileQuestion;
    let iconColor = "text-muted-foreground";
    let srText = `Question ${index + 1}`;

    if (quizState === 'reviewing') {
      if (userAnswer === question.correctAnswer) { // Correct
        statusStyle = "bg-green-500/10 border-green-500 text-green-700 dark:bg-green-700/20 dark:border-green-600 dark:text-green-400 hover:bg-green-500/20 dark:hover:bg-green-700/30";
        IconComponent = CheckCircle;
        iconColor = "text-green-500 dark:text-green-400";
        srText += ", Correct";
      } else if (isAnswered && userAnswer !== question.correctAnswer) { // Incorrect
        statusStyle = "bg-red-500/10 border-red-500 text-red-700 dark:bg-red-700/20 dark:border-red-600 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-700/30";
        IconComponent = XCircle;
        iconColor = "text-red-500 dark:text-red-400";
        srText += ", Incorrect";
      } else { // Not Answered in review
         statusStyle = "bg-amber-500/10 border-amber-500 text-amber-700 dark:bg-amber-700/20 dark:border-amber-600 dark:text-amber-400 hover:bg-amber-500/20 dark:hover:bg-amber-700/30";
         IconComponent = AlertTriangle;
         iconColor = "text-amber-500 dark:text-amber-400";
         srText += ", Not Answered";
      }
      if (isCurrent) {
         statusStyle = cn(statusStyle, "ring-2 ring-offset-1 ring-primary dark:ring-offset-background shadow-md");
         srText += ", Currently Viewing";
      }
    } else { // Taking quiz
      if (isCurrent) {
        statusStyle = "bg-primary text-primary-foreground hover:bg-primary/90 ring-2 ring-primary/50 ring-offset-1 dark:ring-offset-background shadow-md";
        IconComponent = Edit3;
        iconColor = "text-primary-foreground";
        srText += ", Currently Viewing";
      } else if (isMarked) {
        statusStyle = "bg-yellow-400/20 border-yellow-500 text-yellow-600 dark:bg-yellow-500/15 dark:border-yellow-600 dark:text-yellow-400 hover:bg-yellow-400/30 dark:hover:bg-yellow-500/25";
        IconComponent = Eye;
        iconColor = "text-yellow-500 dark:text-yellow-400";
        srText += ", Marked for Review";
      } else if (isAnswered) {
        statusStyle = "bg-green-500/10 border-green-500 text-green-700 dark:bg-green-700/20 dark:border-green-600 dark:text-green-400 hover:bg-green-500/20 dark:hover:bg-green-700/30";
        IconComponent = CheckSquare;
        iconColor = "text-green-500 dark:text-green-400";
        srText += ", Answered";
      } else { // Unanswered
        srText += ", Unanswered";
        // IconComponent is already FileQuestion, iconColor is text-muted-foreground
      }
    }
    return { statusStyle, IconComponent, iconColor, srText };
  };

  const legendItemsTaking = [
    { label: "Current", boxStyle: "bg-primary", icon: Edit3, iconStyle: "text-primary-foreground" },
    { label: "Answered", boxStyle: "bg-green-500/20 border-green-500", icon: CheckSquare, iconStyle: "text-green-500" },
    { label: "Marked", boxStyle: "bg-yellow-400/20 border-yellow-500", icon: Eye, iconStyle: "text-yellow-500" },
    { label: "Unanswered", boxStyle: "border-input", icon: FileQuestion, iconStyle: "text-muted-foreground" },
  ];

  const legendItemsReviewing = [
    { label: "Correct", boxStyle: "bg-green-500/20 border-green-500", icon: CheckCircle, iconStyle: "text-green-500" },
    { label: "Incorrect", boxStyle: "bg-red-500/20 border-red-500", icon: XCircle, iconStyle: "text-red-500" },
    { label: "Not Answered", boxStyle: "bg-amber-500/10 border-amber-500", icon: AlertTriangle, iconStyle: "text-amber-500" },
    { label: "Current", boxStyle: "ring-2 ring-primary ring-offset-1", icon: Edit3, iconStyle: "text-primary" },
  ];
  
  const legendItems = quizState === 'reviewing' ? legendItemsReviewing : legendItemsTaking;

  return (
    <Card className="shadow-lg border-border/60 max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-15rem)] flex flex-col">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-lg font-headline text-center">Question Palette</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow overflow-hidden flex flex-col">
        <ScrollArea className="flex-grow pr-2 -mr-2">
          <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-2.5">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const { statusStyle, IconComponent, iconColor, srText } = getStatusIconAndStyle(index);
              return (
                <Button
                  key={index}
                  variant="outline" // Base variant, actual colors applied by statusStyle
                  className={cn(
                    "h-10 w-10 sm:h-11 sm:w-11 p-0 relative flex items-center justify-center text-sm font-medium rounded-md aspect-square transition-all",
                    statusStyle // Applies background, border, and text colors
                  )}
                  onClick={() => onNavigateToQuestion(index)}
                  aria-label={srText}
                >
                  <span className="text-xs sm:text-sm">{index + 1}</span>
                  {IconComponent && (
                    <span className={cn("absolute top-0.5 right-0.5", iconColor)}>
                       <IconComponent className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        <div className="mt-4 border-t border-border/50 pt-3">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2.5 text-center">Legend</h4>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            {legendItems.map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={cn("h-4 w-4 rounded-sm inline-flex items-center justify-center shrink-0 border p-0.5 relative", item.boxStyle)}>
                   {item.icon && <item.icon className={cn("h-3 w-3", item.iconStyle)} />}
                </span>
                <span className="text-muted-foreground text-[11px] leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
