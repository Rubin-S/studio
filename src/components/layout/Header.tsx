
'use client';

import Link from 'next/link';
import { Car, Menu, X, LayoutDashboard, LogOut, UserPlus, LogIn } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, loading, logout } = useAuth();

  const navLinks = [
    { href: '/', label: { en: 'Home', ta: 'முகப்பு' } },
    { href: '/courses', label: { en: 'Courses', ta: 'படிப்புகள்' } },
    { href: '/about', label: { en: 'About Us', ta: 'எங்களை பற்றி' } },
    { href: '/contact', label: { en: 'Contact Us', ta: 'தொடர்புக்கு' } },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <Car className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold">SMDS</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
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
          <div className="w-px h-6 bg-border mx-2"></div>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href={user.email === 'rubins022007@gmail.com' ? '/admin' : '/dashboard'}>
                  <LayoutDashboard className="mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login"><LogIn className="mr-2" />Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup"><UserPlus className="mr-2" />Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="absolute w-full border-b bg-background shadow-lg md:hidden">
          <nav className="flex flex-col space-y-2 px-4 py-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'w-full rounded-md py-3 text-center text-lg font-medium transition-colors hover:bg-muted hover:text-primary',
                  pathname === link.href ? 'bg-muted text-primary' : 'text-muted-foreground'
                )}
                onClick={closeMenu}
              >
                {t(link.label)}
              </Link>
            ))}
            <div className="border-t mt-4 pt-4 flex flex-col items-center gap-4">
              {loading ? (
                 <Skeleton className="h-10 w-48" />
              ) : user ? (
                <>
                  <Button asChild className="w-full" variant="outline" onClick={closeMenu}>
                     <Link href={user.email === 'rubins022007@gmail.com' ? '/admin' : '/dashboard'}>
                      <LayoutDashboard className="mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button onClick={() => { logout(); closeMenu(); }} className="w-full">
                    <LogOut className="mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild className="w-full" variant="outline" onClick={closeMenu}>
                    <Link href="/login"><LogIn className="mr-2" />Login</Link>
                  </Button>
                  <Button asChild className="w-full" onClick={closeMenu}>
                    <Link href="/signup"><UserPlus className="mr-2" />Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center justify-center gap-4 pt-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
