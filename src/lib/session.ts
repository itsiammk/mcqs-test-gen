import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secret = process.env.JWT_SECRET;
const cookieName = 'session';

if (!secret) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const key = new TextEncoder().encode(secret);

export type SessionPayload = {
  userId: string;
  email: string;
  expires: Date;
};

export async function createSession(payload: { userId: string; email: string }) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);

  cookies().set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(cookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    
    return {
        userId: payload.userId as string,
        email: payload.email as string,
        expires: new Date((payload.exp as number) * 1000),
    };
  } catch (error) {
    // Token verification failed (e.g., expired, invalid)
    return null;
  }
}

export async function deleteSession() {
  cookies().set(cookieName, '', { expires: new Date(0), path: '/' });
}
