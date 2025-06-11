'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MCQForm } from '@/components/mcq/MCQForm';
import { QuestionList } from '@/components/mcq/QuestionList';
import { generateMCQsAction } from '@/app/actions/generateMCQsAction';
import type { MCQ, MCQFormInput } from '@/types/mcq';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Image from 'next/image';

export default function Home() {
  const [questions, setQuestions] = useState<MCQ[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTestParams, setCurrentTestParams] = useState<MCQFormInput | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (data: MCQFormInput) => {
    setIsLoading(true);
    setError(null);
    setQuestions(null);
    setCurrentTestParams(data);

    const result = await generateMCQsAction(data);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      toast({
        variant: "destructive",
        title: "Error Generating Questions",
        description: result.error,
      });
    } else if (result.data) {
      setQuestions(result.data);
      toast({
        title: "Success!",
        description: `${result.data.length} questions generated for ${data.subject}.`,
      });
    } else {
      const fallbackError = "No questions were returned. Please try again.";
      setError(fallbackError);
      toast({
        variant: "destructive",
        title: "Error Generating Questions",
        description: fallbackError,
      });
    }
  };

  const handleClearQuestions = () => {
    setQuestions(null);
    setError(null);
    setCurrentTestParams(null);
  }

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-headline font-bold mb-4 text-gray-800 dark:text-gray-100">Welcome to ScholarQuiz!</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate custom multiple-choice quizzes on any subject to supercharge your learning.
            Just pick your topic, number of questions, and difficulty level to get started.
          </p>
        </section>
        
        {!questions && (
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div className="order-2 md:order-1">
              <MCQForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </div>
            <div className="order-1 md:order-2 flex justify-center">
               <Image 
                src="https://placehold.co/600x400.png" 
                alt="Quiz illustration" 
                width={500} 
                height={350}
                className="rounded-lg shadow-xl"
                data-ai-hint="education quiz"
                priority
              />
            </div>
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="my-8">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {questions && currentTestParams && (
          <QuestionList 
            questions={questions} 
            testParams={currentTestParams} 
            onClear={handleClearQuestions} 
          />
        )}
      </main>
      <Footer />
    </>
  );
}
