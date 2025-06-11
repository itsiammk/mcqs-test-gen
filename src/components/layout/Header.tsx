
import { BookOpenCheck } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  // Using a CSS variable for header height that can be accessed by other components
  // Ensure this variable is also set or accounted for in your global CSS or layout if needed elsewhere
  // For now, we communicate this conceptually via the --header-height var used in QuizView
  const headerHeight = "h-16 sm:h-20"; // Example height, adjust as needed

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${headerHeight}`}
      style={{ '--header-height': '80px' } as React.CSSProperties} // 80px is an example
    >
      <div className={`container flex max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8 ${headerHeight}`}>
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <BookOpenCheck className="h-8 w-8 sm:h-10 sm:w-10 text-primary transition-transform group-hover:scale-110" />
          <h1 className="text-2xl sm:text-3xl font-headline font-semibold text-primary group-hover:text-primary/90">
            ScholarQuiz
          </h1>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
