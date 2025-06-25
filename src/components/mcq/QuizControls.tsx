
'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Flag, Send } from 'lucide-react';
import type { QuizState } from '@/types/mcq';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface QuizControlsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onNext: () => void;
  onPrevious: () => void;
  onMarkForReview: () => void;
  onClearChoice: () => void;
  onSubmitTest: () => void;
  isMarked: boolean;
  quizState: QuizState;
  canClearChoice: boolean;
}

export function QuizControls({
  currentQuestionIndex,
  totalQuestions,
  onNext,
  onPrevious,
  onMarkForReview,
  onClearChoice,
  onSubmitTest,
  isMarked,
  quizState,
  canClearChoice,
}: QuizControlsProps) {
  
  if (quizState === 'reviewing') {
    return (
      <div className="mt-8 flex justify-between items-center p-5 bg-card rounded-lg shadow-md border border-border/60">
        <Button 
            onClick={onPrevious} 
            disabled={currentQuestionIndex === 0} 
            variant="outline" 
            size="lg"
            className="h-12 px-6 text-md"
        >
          <ChevronLeft className="mr-2 h-5 w-5" /> Previous
        </Button>
        <span className="text-md font-medium text-muted-foreground hidden sm:block">
          Reviewing: Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <Button 
            onClick={onNext} 
            disabled={currentQuestionIndex === totalQuestions - 1} 
            variant="outline" 
            size="lg"
            className="h-12 px-6 text-md"
        >
          Next <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    );
  }

  if (quizState === 'submitted') {
    return null; 
  }

  // Taking quiz controls
  return (
    <div className="mt-8 p-5 bg-card rounded-lg shadow-md border border-border/60">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-5">
        <Button 
          onClick={onPrevious} 
          disabled={currentQuestionIndex === 0} 
          variant="outline"
          className="w-full sm:w-auto h-12 px-6 text-md"
          size="lg"
        >
          <ChevronLeft className="mr-2 h-5 w-5" /> Previous
        </Button>
        
        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button 
            onClick={onNext} 
            variant="default"
            className="w-full sm:w-auto h-12 px-6 text-md"
            size="lg"
          >
            Save & Next <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="default"
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600 h-12 px-6 text-md"
                size="lg"
              >
                <Send className="mr-2 h-5 w-5" /> Submit Test
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                <AlertDialogDescription>
                  You cannot change your answers after submitting. Your results will be saved to your history if you are logged in.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onSubmitTest} className="bg-primary hover:bg-primary/90">
                  Yes, Submit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <div className="flex flex-wrap justify-start items-center gap-4 border-t border-border/50 pt-5">
        <Button 
          onClick={onMarkForReview} 
          variant="outline"
          size="lg"
          className={cn(
            "text-md h-11 px-5",
            isMarked && "bg-primary/20 border-primary/50 text-primary hover:bg-primary/30"
          )}
        >
          <Flag className="mr-2 h-5 w-5" /> {isMarked ? 'Unmark Review' : 'Mark for Review'}
        </Button>
        <Button onClick={onClearChoice} variant="outline" size="lg" className="text-md h-11 px-5" disabled={!canClearChoice}>
          <RotateCcw className="mr-2 h-5 w-5" /> Clear Choice
        </Button>
      </div>
    </div>
  );
}
