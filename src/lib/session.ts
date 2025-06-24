import 'server-only';
import { cookies } from 'next/headers';
import jwt, { type JwtPayload } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
const cookieName = 'session';

if (!secret) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export type SessionPayload = {
  userId: string;
  email: string;
};

export async function createSession(payload: SessionPayload) {
  const token = jwt.sign(payload, secret, {
    expiresIn: '7d',
  });

  cookies().set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(cookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload & SessionPayload;
    return { userId: payload.userId, email: payload.email };
  } catch (error) {
    // Token verification failed (e.g., expired, invalid)
    return null;
  }
}

export async function deleteSession() {
  cookies().delete(cookieName);
}
