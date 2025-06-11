
import { BookOpenCheck } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <BookOpenCheck className="h-10 w-10 sm:h-12 sm:w-12 text-primary transition-transform group-hover:scale-110" />
          <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary group-hover:text-primary/90">
            ScholarQuiz
          </h1>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
