import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'ScholarQuiz',
  description: 'Generate MCQs for your study needs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get('next-url') || "";

  // Hide the global header/footer on auth pages.
  const isSpecialLayout = pathname === '/login' || pathname === '/register';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="https://i.ibb.co/LdJj12Mh/image.png" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isSpecialLayout ? (
            children
          ) : (
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow pt-20">
                {children}
              </main>
              <Footer />
            </div>
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
