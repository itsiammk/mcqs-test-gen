'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Trash2, Flag, Send } from 'lucide-react';
import type { QuizState } from '@/types/mcq';

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
      <div className="mt-6 flex justify-between items-center p-4 bg-card rounded-lg shadow">
        <Button onClick={onPrevious} disabled={currentQuestionIndex === 0} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Viewing question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <Button onClick={onNext} disabled={currentQuestionIndex === totalQuestions - 1} variant="outline">
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (quizState === 'submitted') {
    return null; // No controls needed once submitted, actions are on QuizView
  }

  // Taking quiz controls
  return (
    <div className="mt-6 p-4 bg-card rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <Button 
          onClick={onPrevious} 
          disabled={currentQuestionIndex === 0} 
          variant="outline"
          className="w-full sm:w-auto"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button 
            onClick={onNext} 
            variant="default" // Make "Save & Next" more prominent
            className="w-full sm:w-auto"
          >
            Save & Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={onSubmitTest} 
            variant="primary"  // Use primary variant for submit
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="mr-2 h-4 w-4" /> Submit Test
          </Button>
        )}
      </div>
      <div className="flex flex-wrap justify-start items-center gap-3 border-t pt-4">
        <Button 
          onClick={onMarkForReview} 
          variant={isMarked ? "secondary" : "outline"} 
          className={cn(isMarked && "bg-yellow-400 border-yellow-500 text-yellow-900 hover:bg-yellow-500/90 dark:bg-yellow-600 dark:border-yellow-700 dark:text-yellow-100 dark:hover:bg-yellow-700")}
        >
          <Flag className="mr-2 h-4 w-4" /> {isMarked ? 'Unmark Review' : 'Mark for Review'}
        </Button>
        <Button onClick={onClearChoice} variant="outline" disabled={!canClearChoice}>
          <Trash2 className="mr-2 h-4 w-4" /> Clear Choice
        </Button>
      </div>
    </div>
  );
}
