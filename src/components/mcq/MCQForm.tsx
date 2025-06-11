
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookText, ListChecks, BarChart3, Sparkles, Loader2, Zap, FileText, Edit, Timer } from 'lucide-react';
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
  timeLimitMinutes: z.coerce.number().optional(),
  specificExam: z.string().max(100, {
    message: 'Specific exam name must be 100 characters or less.',
  }).optional(),
  notes: z.string().max(500, {
    message: 'Notes must be 500 characters or less.',
  }).optional(),
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

const timeLimitOptions = [
  { value: 0, label: 'No Limit' },
  { value: 5, label: '5 Minutes' },
  { value: 10, label: '10 Minutes' },
  { value: 15, label: '15 Minutes' },
  { value: 30, label: '30 Minutes' },
  { value: 45, label: '45 Minutes' },
  { value: 60, label: '60 Minutes' },
  { value: 90, label: '90 Minutes' },
  { value: 120, label: '120 Minutes' },
];

export function MCQForm({ onSubmit, isLoading }: MCQFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      numQuestions: 10,
      difficulty: 'moderate',
      timeLimitMinutes: 0,
      specificExam: '',
      notes: '',
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values as MCQFormInput);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-border/60 p-4 sm:p-6">
      <CardHeader className="pb-6 text-center">
        <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
        <CardTitle className="text-3xl sm:text-4xl font-headline">
          Create Your Quiz
        </CardTitle>
        <CardDescription className="text-lg pt-2 text-muted-foreground">
          Fill in the details to generate personalized MCQs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-lg font-medium">
                    <BookText className="mr-3 h-6 w-6 text-primary/90" />
                    Subject *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Organic Chemistry, World War II, Calculus" 
                      {...field} 
                      className="text-base h-12 px-4" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
              <FormField
                control={form.control}
                name="numQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-lg font-medium">
                      <ListChecks className="mr-3 h-6 w-6 text-primary/90" />
                      Number of Questions *
                    </FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger className="text-base h-12 px-4">
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {numQuestionOptions.map((option) => (
                          <SelectItem key={option.value} value={String(option.value)} className="text-base py-2.5">
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
                    <FormLabel className="flex items-center text-lg font-medium">
                      <BarChart3 className="mr-3 h-6 w-6 text-primary/90" />
                      Difficulty Level *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-base h-12 px-4">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {difficultyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-base py-2.5">
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
            
            <FormField
              control={form.control}
              name="timeLimitMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-lg font-medium">
                    <Timer className="mr-3 h-6 w-6 text-primary/90" />
                    Time Limit (Optional)
                  </FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger className="text-base h-12 px-4">
                        <SelectValue placeholder="Select time limit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeLimitOptions.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)} className="text-base py-2.5">
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
              name="specificExam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-lg font-medium">
                    <FileText className="mr-3 h-6 w-6 text-primary/90" />
                    Specific Exam (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., SAT Math, UPSC Prelims, AP Biology" 
                      {...field} 
                      className="text-base h-12 px-4" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-lg font-medium">
                    <Edit className="mr-3 h-6 w-6 text-primary/90" />
                     Notes / Instructions for AI (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Focus on definitions, One-word answers only, Include historical context"
                      className="text-base min-h-[120px] p-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" size="lg" className="w-full text-lg py-7 mt-10 !h-16" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2.5 h-6 w-6 animate-spin" />
              ) : (
                <Sparkles className="mr-2.5 h-6 w-6" />
              )}
              Generate MCQs
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
