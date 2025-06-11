
import type { GenerateMCQsOutput } from '@/ai/flows/generate-mcqs';

export type MCQ = GenerateMCQsOutput extends (infer U)[] ? U : never;

export type Difficulty = 'low' | 'moderate' | 'high';

export interface MCQFormInput {
  subject: string;
  numQuestions: number;
  difficulty: Difficulty;
  notes?: string;
  specificExam?: string;
}

// User's selected answer for a question (index of the option, or null if unanswered)
export type UserAnswer = number | null;

// Whether a question is marked for review
export type MarkedReview = boolean;

export type QuizState = 'form' | 'taking' | 'submitted' | 'reviewing';
