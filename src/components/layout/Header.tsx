import { BookOpenCheck, History, LogIn, LogOut, UserPlus, BarChart2, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { getSession } from '@/lib/session';
import { Button } from '../ui/button';
import { logout } from '@/app/actions/authActions';

export async function Header() {
  const session = await getSession();
  const headerHeight = "h-16 sm:h-20";

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${headerHeight}`}
      style={{ '--header-height': '80px' } as React.CSSProperties}
    >
      <div className={`container flex max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8 ${headerHeight}`}>
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <BookOpenCheck className="h-8 w-8 sm:h-10 sm:w-10 text-primary transition-transform group-hover:scale-110" />
          <h1 className="text-2xl sm:text-3xl font-headline font-semibold text-primary group-hover:text-primary/90">
            ScholarQuiz
          </h1>
        </Link>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
             <div className="flex items-center gap-2">
               <Link href="/dashboard">
                 <Button variant="ghost" size="sm">
                   <BarChart2 className="mr-2 h-4 w-4" />
                   Dashboard
                 </Button>
               </Link>
               <Link href="/history">
                 <Button variant="ghost" size="sm">
                   <History className="mr-2 h-4 w-4" />
                   History
                 </Button>
               </Link>
                <Link href="/quiz/new">
                  <Button variant="default" size="sm">
                      <Zap className="mr-2 h-4 w-4" />
                      New Quiz
                  </Button>
                </Link>
                <form action={logout}>
                    <Button variant="outline" size="sm">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </form>
             </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                    <Button variant="ghost" size="sm">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Button>
                </Link>
                <Link href="/register">
                    <Button variant="ghost" size="sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                    </Button>
                </Link>
                 <Link href="/quiz/new">
                    <Button variant="default" size="sm">
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
