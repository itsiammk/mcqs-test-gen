import type { GenerateMCQsOutput } from '@/ai/flows/generate-mcqs';

export type MCQ = GenerateMCQsOutput extends (infer U)[] ? U : never;

export type Difficulty = 'low' | 'moderate' | 'high';

export interface MCQFormInput {
  subject: string;
  numQuestions: number;
  difficulty: Difficulty;
}
