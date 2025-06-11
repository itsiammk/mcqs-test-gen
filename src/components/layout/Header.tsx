import { BookOpenCheck } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="py-4 px-6 shadow-md bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BookOpenCheck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-headline font-semibold text-primary">
            ScholarQuiz
          </h1>
        </Link>
      </div>
    </header>
  );
}
