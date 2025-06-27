'use client';
import { useState } from 'react';
import Link from 'next/link';
import { logout } from '@/app/actions/authActions';
import type { SessionPayload } from '@/lib/session';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';
import { BookOpenCheck, LogOut, LogIn, UserPlus } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function HeaderUI({ session }: { session: SessionPayload | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = session
    ? [
        { name: 'Dashboard', link: '/dashboard' },
        { name: 'History', link: '/history' },
        { name: 'New Quiz', link: '/quiz/new' },
      ]
    : [
        { name: 'Features', link: '/#features' },
        { name: 'How It Works', link: '/#how-it-works' },
      ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const LoggedInDesktopButtons = () => (
    <div className="flex items-center gap-4">
      <form action={logout}>
        <NavbarButton as="button" variant="secondary" className="!px-3 !py-1.5">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </NavbarButton>
      </form>
      <ThemeToggle />
    </div>
  );

  const LoggedOutDesktopButtons = () => (
    <div className="flex items-center gap-4">
       <Link href="/login">
            <NavbarButton as="button" variant="secondary">
                Login
            </NavbarButton>
       </Link>
       <Link href="/register">
            <NavbarButton as="button" variant="primary">
                Sign Up
            </NavbarButton>
       </Link>
       <ThemeToggle />
    </div>
  );

  const LoggedInMobileMenu = () => (
     <div className="flex w-full flex-col gap-4">
        <Link href="/dashboard" onClick={handleLinkClick} className="w-full">
             <NavbarButton as="button" variant="primary" className="w-full">
                Dashboard
             </NavbarButton>
        </Link>
        <Link href="/history" onClick={handleLinkClick} className="w-full">
            <NavbarButton as="button" variant="primary" className="w-full">
                History
            </NavbarButton>
        </Link>
        <Link href="/quiz/new" onClick={handleLinkClick} className="w-full">
             <NavbarButton as="button" variant="primary" className="w-full">
                New Quiz
            </NavbarButton>
        </Link>
        <form action={logout} className="w-full">
             <NavbarButton as="button" variant="secondary" className="w-full">
                Logout
            </NavbarButton>
        </form>
    </div>
  );

  const LoggedOutMobileMenu = () => (
    <div className="flex w-full flex-col gap-4">
        <Link href="/login" onClick={handleLinkClick} className="w-full">
            <NavbarButton as="button" variant="primary" className="w-full">
                Login
            </NavbarButton>
        </Link>
        <Link href="/register" onClick={handleLinkClick} className="w-full">
             <NavbarButton as="button" variant="primary" className="w-full">
                Sign Up
            </NavbarButton>
        </Link>
    </div>
  );


  return (
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo>
            <BookOpenCheck className="h-7 w-7 text-primary" />
            <span className="font-headline font-semibold text-xl text-primary">ScholarQuiz</span>
          </NavbarLogo>
          <NavItems items={navItems} onItemClick={handleLinkClick} />
          {session ? <LoggedInDesktopButtons /> : <LoggedOutDesktopButtons />}
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo>
                <BookOpenCheck className="h-7 w-7 text-primary" />
                <span className="font-headline font-semibold text-xl text-primary">ScholarQuiz</span>
            </NavbarLogo>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={handleLinkClick}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            {session ? <LoggedInMobileMenu /> : <LoggedOutMobileMenu />}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
  );
}
