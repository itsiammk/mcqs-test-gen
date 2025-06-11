'use client';

import { useState } from 'react';
import type { MCQ } from '@/types/mcq';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye, MessageSquareText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: MCQ;
  questionNumber: number;
}

export function QuestionCard({ question, questionNumber }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

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
          onValueChange={(value) => setSelectedAnswer(Number(value))}
          disabled={showAnswer}
          className="space-y-3"
        >
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctAnswer;
            const isSelected = selectedAnswer === index;
            let optionStyle = "border-border hover:border-primary";

            if (showAnswer) {
              if (isCorrect) {
                optionStyle = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
              } else if (isSelected && !isCorrect) {
                optionStyle = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
              }
            } else if (isSelected) {
                optionStyle = "border-primary bg-primary/10";
            }

            return (
              <Label
                key={index}
                htmlFor={`q${questionNumber}-option${index}`}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-md border-2 transition-all cursor-pointer",
                  optionStyle
                )}
              >
                <RadioGroupItem
                  value={String(index)}
                  id={`q${questionNumber}-option${index}`}
                  className={cn(
                    "h-5 w-5",
                    showAnswer && isCorrect ? "border-green-500 text-green-500" : "",
                    showAnswer && isSelected && !isCorrect ? "border-red-500 text-red-500" : ""
                  )}
                />
                <span>{getOptionLabel(index)}. {option}</span>
                {showAnswer && isCorrect && <CheckCircle className="ml-auto h-5 w-5 text-green-500" />}
                {showAnswer && isSelected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-red-500" />}
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        {!showAnswer && (
          <Button onClick={handleShowAnswer} disabled={selectedAnswer === null} className="w-full md:w-auto">
            <Eye className="mr-2 h-4 w-4" /> Show Answer
          </Button>
        )}
        {showAnswer && (
          <div className="w-full p-4 bg-muted/50 rounded-md border border-dashed">
            <h4 className="font-headline text-md mb-2 flex items-center">
              <MessageSquareText className="mr-2 h-5 w-5 text-accent" />
              Explanation:
            </h4>
            <p className="text-sm">{question.explanation}</p>
            {selectedAnswer !== null && selectedAnswer !== question.correctAnswer && (
              <p className="text-sm mt-2 text-red-600 dark:text-red-400">
                Your answer ({getOptionLabel(selectedAnswer)}) was incorrect. The correct answer is {getOptionLabel(question.correctAnswer)}.
              </p>
            )}
            {selectedAnswer !== null && selectedAnswer === question.correctAnswer && (
               <p className="text-sm mt-2 text-green-600 dark:text-green-400">
                Your answer ({getOptionLabel(selectedAnswer)}) was correct!
              </p>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
