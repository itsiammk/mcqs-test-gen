'use client';

import type { MCQ, UserAnswer } from '@/types/mcq';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, MessageSquareText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: MCQ;
  questionNumber: number;
  selectedAnswerProp: UserAnswer;
  onSelectAnswer: (answerIndex: number) => void;
  isReviewMode: boolean;
  isDisabled: boolean; // To disable radio group during review/submitted state before review
}

export function QuestionCard({
  question,
  questionNumber,
  selectedAnswerProp,
  onSelectAnswer,
  isReviewMode,
  isDisabled,
}: QuestionCardProps) {
  const getOptionLabel = (index: number) => String.fromCharCode(65 + index); // A, B, C, D

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex justify-between items-start">
          <span>Question {questionNumber}</span>
          <Badge variant={
            question.difficulty === 'low' ? 'secondary' :
            question.difficulty === 'moderate' ? 'default' : 'destructive'
          } className="capitalize text-sm ml-2">
            {question.difficulty}
          </Badge>
        </CardTitle>
        <p className="text-lg pt-2">{question.questionText}</p>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswerProp !== null ? String(selectedAnswerProp) : undefined}
          onValueChange={(value) => onSelectAnswer(Number(value))}
          disabled={isDisabled || isReviewMode} // Disable if review mode or explicitly disabled
          className="space-y-3"
        >
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctAnswer;
            const isSelected = selectedAnswerProp === index;
            let optionStyle = "border-border hover:border-primary";

            if (isReviewMode) {
              if (isCorrect) {
                optionStyle = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
              } else if (isSelected && !isCorrect) {
                optionStyle = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
              } else {
                optionStyle = "border-border opacity-70"; // Non-selected, non-correct options in review
              }
            } else if (isSelected && !isDisabled) { // Only apply selection style if not disabled (i.e. during 'taking' quiz)
                optionStyle = "border-primary bg-primary/10";
            } else if (isDisabled) { // Generic disabled style for options
                optionStyle = "border-border opacity-70 cursor-not-allowed";
            }


            return (
              <Label
                key={index}
                htmlFor={`q${questionNumber}-option${index}`}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-md border-2 transition-all",
                  isDisabled || isReviewMode ? "cursor-default" : "cursor-pointer",
                  optionStyle
                )}
              >
                <RadioGroupItem
                  value={String(index)}
                  id={`q${questionNumber}-option${index}`}
                  className={cn(
                    "h-5 w-5",
                    isReviewMode && isCorrect ? "border-green-500 text-green-500" : "",
                    isReviewMode && isSelected && !isCorrect ? "border-red-500 text-red-500" : ""
                  )}
                  disabled={isDisabled || isReviewMode}
                />
                <span>{getOptionLabel(index)}. {option}</span>
                {isReviewMode && isCorrect && <CheckCircle className="ml-auto h-5 w-5 text-green-500" />}
                {isReviewMode && isSelected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-red-500" />}
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
      {isReviewMode && (
        <CardFooter className="flex flex-col items-start space-y-4">
          <div className="w-full p-4 bg-muted/50 rounded-md border border-dashed">
            <h4 className="font-headline text-md mb-2 flex items-center">
              <MessageSquareText className="mr-2 h-5 w-5 text-accent" />
              Explanation:
            </h4>
            <p className="text-sm">{question.explanation}</p>
            {selectedAnswerProp !== null && selectedAnswerProp !== question.correctAnswer && (
              <p className="text-sm mt-2 text-red-600 dark:text-red-400">
                Your answer ({getOptionLabel(selectedAnswerProp)}) was incorrect. The correct answer is {getOptionLabel(question.correctAnswer)}.
              </p>
            )}
            {selectedAnswerProp !== null && selectedAnswerProp === question.correctAnswer && (
               <p className="text-sm mt-2 text-green-600 dark:text-green-400">
                Your answer ({getOptionLabel(selectedAnswerProp)}) was correct!
              </p>
            )}
             {selectedAnswerProp === null && (
              <p className="text-sm mt-2 text-muted-foreground">
                You did not answer this question. The correct answer is {getOptionLabel(question.correctAnswer)}.
              </p>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
