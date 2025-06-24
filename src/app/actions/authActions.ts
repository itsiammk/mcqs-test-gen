'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { createSession, deleteSession } from '@/lib/session';

export async function signup(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], 
  });

  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  try {
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { message: 'User already exists with this email.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });

  } catch (e) {
    console.error(e);
    return { message: 'An error occurred during signup.' };
  }

  redirect('/login');
}


export async function login(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
      return { message: 'Invalid credentials' };
  }

  const { email, password } = parsed.data;

  try {
    await dbConnect();
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return { message: 'Invalid credentials' };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return { message: 'Invalid credentials' };
    }

    await createSession({ userId: user._id.toString(), email: user.email });

  } catch (e) {
    console.error(e);
    return { message: 'An error occurred during login.' };
  }

  redirect('/');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
