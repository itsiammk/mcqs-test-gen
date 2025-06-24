'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login, signup } from '@/app/actions/authActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';

type Mode = 'login' | 'register';

export function AuthForm({ mode }: { mode: Mode }) {
  const action = mode === 'login' ? login : signup;
  const [state, formAction] = useActionState(action, null);

  const isRegister = mode === 'register';

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isRegister ? 'Create an account' : 'Sign In'}
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-sm">
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="text-2xl">{isRegister ? 'Register' : 'Login'}</CardTitle>
            <CardDescription>
              {isRegister ? 'Enter your information to create an account' : 'Enter your email below to login to your account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {!isRegister && (
              <div className="p-3 rounded-md bg-muted/80 text-muted-foreground text-sm space-y-2 border border-dashed">
                <p className="font-semibold text-foreground">Demo Credentials</p>
                <div>Email: <code className="font-mono bg-background/50 px-1.5 py-1 rounded text-xs">test@example.com</code></div>
                <div>Password: <code className="font-mono bg-background/50 px-1.5 py-1 rounded text-xs">password123</code></div>
                <p className="text-xs pt-1">(Note: Please sign up with these credentials first if the account doesn't exist.)</p>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              {state?.errors?.email && <p className="text-xs text-red-500">{state.errors.email[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required minLength={isRegister ? 8 : 1} />
              {state?.errors?.password && <p className="text-xs text-red-500">{state.errors.password[0]}</p>}
            </div>
            {isRegister && (
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} />
                 {state?.errors?.confirmPassword && <p className="text-xs text-red-500">{state.errors.confirmPassword[0]}</p>}
              </div>
            )}
             {state?.message && !state?.errors && <p className="text-sm text-red-500 text-center">{state.message}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton />
            {isRegister ? (
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                  Sign in
                </Link>
              </div>
            ) : (
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="underline">
                  Sign up
                </Link>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
