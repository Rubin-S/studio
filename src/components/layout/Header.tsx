'use client';

import Link from 'next/link';
import { Car, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const navLinks = [
    { href: '/', label: { en: 'Home', ta: 'முகப்பு' } },
    { href: '/courses', label: { en: 'Courses', ta: 'படிப்புகள்' } },
    { href: '/contact', label: { en: 'Contact Us', ta: 'தொடர்புக்கு' } },
    { href: '/about', label: { en: 'About Us', ta: 'எங்களை பற்றி' } },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <Car className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold">SMDS</span>
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeSwitcher />
           <Button asChild>
            <Link href="/login">Admin Login</Link>
          </Button>
        </div>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-lg font-medium transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {t(link.label)}
              </Link>
            ))}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
             <Button asChild className="mt-2" onClick={() => setIsMenuOpen(false)}>
              <Link href="/login">Admin Login</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
