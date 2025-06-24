import mongoose, { Schema, Document } from 'mongoose';
import type { MCQ, UserAnswer } from '@/types/mcq';

export interface IQuiz extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  subject: string;
  difficulty: 'low' | 'moderate' | 'high';
  numQuestions: number;
  timeLimitMinutes?: number;
  specificExam?: string;
  notes?: string;
  questions: MCQ[];
  userAnswers: UserAnswer[];
  score: number;
  timeTaken?: number;
  createdAt: Date;
}

const QuizSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['low', 'moderate', 'high'] },
  numQuestions: { type: Number, required: true },
  timeLimitMinutes: { type: Number },
  specificExam: { type: String },
  notes: { type: String },
  questions: { type: Array, required: true },
  userAnswers: { type: Array, required: true },
  score: { type: Number, required: true },
  timeTaken: { type: Number }, // in seconds
}, { timestamps: true });

export default mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);
