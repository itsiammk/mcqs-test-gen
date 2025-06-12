
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
    <Card className="w-full shadow-lg border-border/50 p-4 sm:p-6">
      <CardHeader className="pb-3 pt-2 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start mb-2">
            <Zap className="h-7 w-7 text-primary mr-2.5" />
            <CardTitle className="text-xl sm:text-2xl font-headline">
            Quiz Parameters
            </CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Fill in the details to generate MCQs.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
            
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-5">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="flex items-center text-sm font-medium">
                      <BookText className="mr-2 h-4 w-4 text-primary/90" />
                      Subject *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Organic Chemistry"
                        {...field}
                        className="text-xs h-10 px-3"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium">
                      <ListChecks className="mr-2 h-4 w-4 text-primary/90" />
                      Questions *
                    </FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger className="text-xs h-10 px-3">
                          <SelectValue placeholder="Select num" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {numQuestionOptions.map((option) => (
                          <SelectItem key={option.value} value={String(option.value)} className="text-xs py-1.5">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-5">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium">
                      <BarChart3 className="mr-2 h-4 w-4 text-primary/90" />
                      Difficulty *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-xs h-10 px-3">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {difficultyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-xs py-1.5">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeLimitMinutes"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium">
                        <Timer className="mr-2 h-4 w-4 text-primary/90" />
                        Time Limit
                      </FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value || 0)}>
                        <FormControl>
                        <SelectTrigger className="text-xs h-10 px-3">
                            <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {timeLimitOptions.map((option) => (
                            <SelectItem key={option.value} value={String(option.value)} className="text-xs py-1.5">
                            {option.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="specificExam"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium">
                        <FileText className="mr-2 h-4 w-4 text-primary/90" />
                        Specific Exam
                      </FormLabel>
                    <FormControl>
                        <Input
                        placeholder="e.g., SAT Math"
                        {...field}
                        className="text-xs h-10 px-3"
                        />
                    </FormControl>
                    <FormMessage className="text-xs" />
                    </FormItem>
                )}
                />
            </div>

            {/* Row 3 */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium">
                    <Edit className="mr-2 h-4 w-4 text-primary/90" />
                     Notes / Instructions (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Focus on definitions, One-word answers only"
                      className="text-xs min-h-[80px] p-2.5"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full text-sm py-2.5 !h-11 mt-5" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate MCQs
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
