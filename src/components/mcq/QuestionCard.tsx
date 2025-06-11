'use client';

import type { MCQ, UserAnswer } from '@/types/mcq';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, MessageSquareText, AlertTriangle, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface QuestionCardProps {
  question: MCQ;
  questionNumber: number;
  selectedAnswerProp: UserAnswer;
  onSelectAnswer: (answerIndex: number) => void;
  isReviewMode: boolean;
  isDisabled: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  selectedAnswerProp,
  onSelectAnswer,
  isReviewMode,
  isDisabled,
}: QuestionCardProps) {
  const getOptionLabel = (index: number) => String.fromCharCode(65 + index);

  const difficultyBadgeVariant = (difficulty: MCQ['difficulty']) => {
    switch (difficulty) {
      case 'low':
        return 'secondary';
      case 'moderate':
        return 'default';
      case 'high':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="mb-6 shadow-lg border-border/60">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-2 mb-1">
          <CardTitle className="font-headline text-xl sm:text-2xl">
            Question {questionNumber}
          </CardTitle>
          <Badge 
            variant={difficultyBadgeVariant(question.difficulty)} 
            className="capitalize text-xs sm:text-sm px-2.5 py-1"
          >
            {question.difficulty} Difficulty
          </Badge>
        </div>
        <p className="text-lg sm:text-xl pt-2 leading-relaxed">{question.questionText}</p>
      </CardHeader>
      <CardContent className="pt-2">
        <RadioGroup
          value={selectedAnswerProp !== null ? String(selectedAnswerProp) : undefined}
          onValueChange={(value) => onSelectAnswer(Number(value))}
          disabled={isDisabled || isReviewMode}
          className="space-y-3 sm:space-y-4"
        >
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctAnswer;
            const isSelected = selectedAnswerProp === index;
            let optionClass = "border-muted hover:border-primary/70";
            let indicatorIcon = null;

            if (isReviewMode) {
              if (isCorrect) {
                optionClass = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 dark:border-green-600";
                indicatorIcon = <CheckCircle className="h-5 w-5 text-green-500" />;
              } else if (isSelected && !isCorrect) {
                optionClass = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 dark:border-red-600";
                indicatorIcon = <XCircle className="h-5 w-5 text-red-500" />;
              } else {
                optionClass = "border-muted opacity-70";
              }
            } else if (isSelected && !isDisabled) {
                optionClass = "border-primary bg-primary/10 ring-2 ring-primary/80";
            } else if (isDisabled) {
                optionClass = "border-muted opacity-80 cursor-not-allowed";
            }
            
            return (
              <Label
                key={index}
                htmlFor={`q${questionNumber}-option${index}`}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-150 ease-in-out",
                  isDisabled || isReviewMode ? "cursor-default" : "cursor-pointer hover:shadow-md",
                  optionClass
                )}
              >
                <RadioGroupItem
                  value={String(index)}
                  id={`q${questionNumber}-option${index}`}
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isReviewMode && isCorrect ? "border-green-500 text-green-500 dark:text-green-400" : "",
                    isReviewMode && isSelected && !isCorrect ? "border-red-500 text-red-500 dark:text-red-400" : ""
                  )}
                  disabled={isDisabled || isReviewMode}
                />
                <span className="flex-grow text-base">{getOptionLabel(index)}. {option}</span>
                {isReviewMode && indicatorIcon && <span className="ml-auto shrink-0">{indicatorIcon}</span>}
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
      {isReviewMode && (
        <>
          <Separator className="my-4" />
          <CardFooter className="flex flex-col items-start space-y-4 p-6 pt-2">
            <div className="w-full p-4 bg-muted/30 dark:bg-muted/20 rounded-md border border-dashed border-border/70">
              <h4 className="font-headline text-lg mb-2 flex items-center">
                <Brain className="mr-2 h-5 w-5 text-accent" />
                Explanation
              </h4>
              <p className="text-sm sm:text-base leading-relaxed text-foreground/90">{question.explanation}</p>
              
              <div className="mt-3 pt-3 border-t border-border/50 text-sm">
                {selectedAnswerProp !== null ? (
                    selectedAnswerProp === question.correctAnswer ? (
                        <p className="font-medium text-green-600 dark:text-green-400 flex items-center">
                            <CheckCircle className="mr-1.5 h-4 w-4 shrink-0"/> Your answer ({getOptionLabel(selectedAnswerProp)}) was correct!
                        </p>
                    ) : (
                        <p className="font-medium text-red-600 dark:text-red-400 flex items-center">
                            <XCircle className="mr-1.5 h-4 w-4 shrink-0"/> Your answer ({getOptionLabel(selectedAnswerProp)}) was incorrect. 
                            The correct answer was {getOptionLabel(question.correctAnswer)}.
                        </p>
                    )
                ) : (
                  <p className="font-medium text-amber-600 dark:text-amber-400 flex items-center">
                    <AlertTriangle className="mr-1.5 h-4 w-4 shrink-0"/> You did not answer this question. 
                    The correct answer was {getOptionLabel(question.correctAnswer)}.
                  </p>
                )}
              </div>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
