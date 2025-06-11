'use client';

import type { MCQ, MCQFormInput } from '@/types/mcq';
import { QuestionCard } from './QuestionCard';
import { Button } from '@/components/ui/button';
import { Download, ListRestart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from "lucide-react";

interface QuestionListProps {
  questions: MCQ[];
  testParams: MCQFormInput;
  onClear: () => void;
}

export function QuestionList({ questions, testParams, onClear }: QuestionListProps) {
  const handleExportToText = () => {
    let textContent = `ScholarQuiz MCQs\n`;
    textContent += `Subject: ${testParams.subject}\n`;
    textContent += `Number of Questions: ${testParams.numQuestions}\n`;
    textContent += `Difficulty: ${testParams.difficulty}\n\n`;
    textContent += `----------------------------------------\n\n`;

    questions.forEach((q, index) => {
      textContent += `Question ${index + 1}: ${q.questionText}\n`;
      textContent += `Options:\n`;
      q.options.forEach((opt, i) => {
        textContent += `${String.fromCharCode(65 + i)}) ${opt}\n`;
      });
      textContent += `Correct Answer: ${String.fromCharCode(65 + q.correctAnswer)}) ${q.options[q.correctAnswer]}\n`;
      textContent += `Explanation: ${q.explanation}\n`;
      textContent += `Difficulty: ${q.difficulty}\n`;
      textContent += `----------------------------------------\n\n`;
    });

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${testParams.subject.toLowerCase().replace(/\s+/g, '_')}_mcqs.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  if (!questions || questions.length === 0) {
    return (
      <Alert variant="destructive" className="mt-8">
        <Terminal className="h-4 w-4" />
        <AlertTitle>No Questions Generated</AlertTitle>
        <AlertDescription>
          The AI could not generate questions based on the provided parameters. Please try adjusting the subject or try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-headline font-semibold">Generated Questions</h2>
        <div className="flex gap-2">
          <Button onClick={handleExportToText} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export to Text
          </Button>
          <Button onClick={onClear} variant="destructive">
            <ListRestart className="mr-2 h-4 w-4" /> Start New Test
          </Button>
        </div>
      </div>
      <Alert className="mb-6 bg-primary/10 border-primary/30 text-primary-foreground">
        <AlertTitle className="font-headline text-primary">Test Details</AlertTitle>
        <AlertDescription className="text-primary/80">
          Subject: <span className="font-semibold">{testParams.subject}</span> | 
          Questions: <span className="font-semibold">{testParams.numQuestions}</span> | 
          Difficulty: <span className="font-semibold capitalize">{testParams.difficulty}</span>
        </AlertDescription>
      </Alert>
      <div>
        {questions.map((q, index) => (
          <QuestionCard key={index} question={q} questionNumber={index + 1} />
        ))}
      </div>
    </div>
  );
}
