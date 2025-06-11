
'use client';

import type { MCQ, UserAnswer } from '@/types/mcq';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, AlertTriangle, Brain } from 'lucide-react';
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
    <Card className="mb-8 shadow-lg border-border/60">
      <CardHeader className="p-6 pb-5">
        <div className="flex justify-between items-start gap-3 mb-2">
          <CardTitle className="font-headline text-xl sm:text-2xl lg:text-3xl">
            Question {questionNumber}
          </CardTitle>
          <Badge 
            variant={difficultyBadgeVariant(question.difficulty)} 
            className="capitalize text-sm sm:text-md px-3 py-1.5"
          >
            {question.difficulty} Difficulty
          </Badge>
        </div>
        <CardDescription className="text-lg sm:text-xl pt-3 leading-relaxed text-foreground/95">{question.questionText}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-3">
        <RadioGroup
          value={selectedAnswerProp !== null ? String(selectedAnswerProp) : undefined}
          onValueChange={(value) => onSelectAnswer(Number(value))}
          disabled={isDisabled || isReviewMode}
          className="space-y-4 sm:space-y-5"
        >
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctAnswer;
            const isSelected = selectedAnswerProp === index;
            let optionClass = "border-muted hover:border-primary/70";
            let indicatorIcon = null;

            if (isReviewMode) {
              if (isCorrect) {
                optionClass = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 dark:border-green-600 ring-2 ring-green-500";
                indicatorIcon = <CheckCircle className="h-6 w-6 text-green-500" />;
              } else if (isSelected && !isCorrect) {
                optionClass = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 dark:border-red-600 ring-2 ring-red-500";
                indicatorIcon = <XCircle className="h-6 w-6 text-red-500" />;
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
                  "flex items-center space-x-4 p-5 rounded-lg border-2 transition-all duration-150 ease-in-out",
                  isDisabled || isReviewMode ? "cursor-default" : "cursor-pointer hover:shadow-md",
                  optionClass
                )}
              >
                <RadioGroupItem
                  value={String(index)}
                  id={`q${questionNumber}-option${index}`}
                  className={cn(
                    "h-5 w-5 sm:h-6 sm:w-6 shrink-0",
                    isReviewMode && isCorrect ? "border-green-500 text-green-500 dark:text-green-400" : "",
                    isReviewMode && isSelected && !isCorrect ? "border-red-500 text-red-500 dark:text-red-400" : ""
                  )}
                  disabled={isDisabled || isReviewMode}
                />
                <span className="flex-grow text-md sm:text-lg">{getOptionLabel(index)}. {option}</span>
                {isReviewMode && indicatorIcon && <span className="ml-auto shrink-0">{indicatorIcon}</span>}
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
      {isReviewMode && (
        <>
          <Separator className="my-6" />
          <CardFooter className="flex flex-col items-start space-y-5 p-6 pt-0">
            <div className="w-full p-5 bg-muted/30 dark:bg-muted/20 rounded-lg border border-dashed border-border/70">
              <h4 className="font-headline text-xl mb-3 flex items-center">
                <Brain className="mr-2.5 h-6 w-6 text-accent" />
                Explanation
              </h4>
              <p className="text-md sm:text-lg leading-relaxed text-foreground/90">{question.explanation}</p>
              
              <div className="mt-4 pt-4 border-t border-border/50 text-md">
                {selectedAnswerProp !== null ? (
                    selectedAnswerProp === question.correctAnswer ? (
                        <p className="font-medium text-green-600 dark:text-green-400 flex items-center">
                            <CheckCircle className="mr-2 h-5 w-5 shrink-0"/> Your answer ({getOptionLabel(selectedAnswerProp)}) was correct!
                        </p>
                    ) : (
                        <p className="font-medium text-red-600 dark:text-red-400 flex items-center">
                            <XCircle className="mr-2 h-5 w-5 shrink-0"/> Your answer ({getOptionLabel(selectedAnswerProp)}) was incorrect. 
                            The correct answer was {getOptionLabel(question.correctAnswer)}.
                        </p>
                    )
                ) : (
                  <p className="font-medium text-amber-600 dark:text-amber-400 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 shrink-0"/> You did not answer this question. 
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

    