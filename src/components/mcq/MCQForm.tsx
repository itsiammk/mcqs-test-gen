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
import { BookText, ListChecks, BarChart3, Sparkles, Loader2 } from 'lucide-react';
import type { MCQFormInput, Difficulty } from '@/types/mcq';

const formSchema = z.object({
  subject: z.string().min(2, {
    message: 'Subject must be at least 2 characters.',
  }),
  numQuestions: z.coerce.number().min(1, {
    message: 'Please select the number of questions.',
  }),
  difficulty: z.enum(['low', 'moderate', 'high'], {
    message: 'Please select a difficulty level.',
  }),
});

interface MCQFormProps {
  onSubmit: (data: MCQFormInput) => void;
  isLoading: boolean;
}

const numQuestionOptions = [
  { value: 5, label: '5 Questions' },
  { value: 10, label: '10 Questions' },
  { value: 20, label: '20 Questions' },
  { value: 30, label: '30 Questions' },
  { value: 50, label: '50 Questions' },
];

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' },
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 p-6 md:p-8 rounded-lg shadow-xl bg-card">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-lg font-headline">
                <BookText className="mr-2 h-5 w-5 text-primary" />
                Subject
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., Physics, History, Biology" {...field} className="text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="numQuestions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-lg font-headline">
                  <ListChecks className="mr-2 h-5 w-5 text-primary" />
                  Number of Questions
                </FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                  <FormControl>
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Select number of questions" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {numQuestionOptions.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
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
                <FormLabel className="flex items-center text-lg font-headline">
                  <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                  Difficulty
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
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
        
        <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          Generate MCQs
        </Button>
      </form>
    </Form>
  );
}
