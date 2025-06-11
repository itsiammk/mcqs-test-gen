'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookText, ListChecks, BarChart3, Sparkles, Loader2, Zap } from 'lucide-react';
import type { MCQFormInput, Difficulty } from '@/types/mcq';

const formSchema = z.object({
  subject: z.string().min(2, {
    message: 'Subject must be at least 2 characters long.',
  }).max(100, {
    message: 'Subject must be 100 characters or less.',
  }),
  numQuestions: z.coerce.number().min(1, {
    message: 'Please select at least 1 question.',
  }).max(50, {
    message: 'Maximum 50 questions allowed.',
  }),
  difficulty: z.enum(['low', 'moderate', 'high'], {
    required_error: 'Please select a difficulty level.',
  }),
});

interface MCQFormProps {
  onSubmit: (data: MCQFormInput) => void;
  isLoading: boolean;
}

const numQuestionOptions = [
  { value: 5, label: '5 Questions' },
  { value: 10, label: '10 Questions' },
  { value: 15, label: '15 Questions' },
  { value: 20, label: '20 Questions' },
  { value: 25, label: '25 Questions' },
  { value: 30, label: '30 Questions' },
  { value: 50, label: '50 Questions (Max)' },
];

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: 'low', label: '🌱 Low' },
  { value: 'moderate', label: '🔥 Moderate' },
  { value: 'high', label: '🚀 High' },
];

export function MCQForm({ onSubmit, isLoading }: MCQFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      numQuestions: 10,
      difficulty: 'moderate',
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values as MCQFormInput);
  }

  return (
    <Card className="w-full shadow-xl border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-headline flex items-center">
          <Zap className="mr-2 h-7 w-7 text-primary" />
          Create Your Quiz
        </CardTitle>
        <CardDescription>Fill in the details below to generate your personalized MCQs.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-base font-medium">
                    <BookText className="mr-2 h-5 w-5 text-primary/80" />
                    Subject
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Organic Chemistry, World War II, Calculus" 
                      {...field} 
                      className="text-base py-5" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="numQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-base font-medium">
                      <ListChecks className="mr-2 h-5 w-5 text-primary/80" />
                      Number of Questions
                    </FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger className="text-base py-5">
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {numQuestionOptions.map((option) => (
                          <SelectItem key={option.value} value={String(option.value)} className="text-base">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-base font-medium">
                      <BarChart3 className="mr-2 h-5 w-5 text-primary/80" />
                      Difficulty Level
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-base py-5">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {difficultyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-base">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" size="lg" className="w-full text-lg py-7 mt-8" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-6 w-6" />
              )}
              Generate MCQs
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
