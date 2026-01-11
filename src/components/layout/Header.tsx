"use client";
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GraduationCap, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

const contentSubmenu = [
  { name: 'Cursos', href: '/cursos' },
  { name: 'Instrutores', href: '/instrutores' },
];

const aboutSubmenu = [
  { name: 'Sobre o Projeto', href: '/sobre' },
  { name: 'Como Contribuir', href: '/contribuir' },
];

/**
 * Header/Navbar do site
 */
export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContentMenuOpen, setIsContentMenuOpen] = useState(false);
  const [isMobileContentOpen, setIsMobileContentOpen] = useState(false);
  const contentMenuRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contentMenuRef.current && !contentMenuRef.current.contains(event.target as Node)) {
        setIsContentMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isContentActive = pathname.startsWith('/cursos') || pathname.startsWith('/instrutores');
  const isAboutActive = pathname === '/sobre' || pathname === '/contribuir';
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const aboutMenuRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown Sobre ao clicar fora
  useEffect(() => {
    function handleClickOutsideAbout(event: MouseEvent) {
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(event.target as Node)) {
        setIsAboutMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutsideAbout);
    return () => document.removeEventListener('mousedown', handleClickOutsideAbout);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg">Aprendi</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {/* Início */}
          <Link
            href="/"
            className={cn(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent',
              pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Início
          </Link>

          {/* Conteúdo - Dropdown */}
          <div className="relative" ref={contentMenuRef}>
            <button
              onClick={() => setIsContentMenuOpen(!isContentMenuOpen)}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent',
                isContentActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Conteúdo
              <ChevronDown className={cn(
                'h-4 w-4 transition-transform duration-200',
                isContentMenuOpen && 'rotate-180'
              )} />
            </button>

            {/* Dropdown Menu */}
            {isContentMenuOpen && (
              <div className="absolute top-full left-0 mt-1 py-1 w-40 rounded-lg border border-border bg-popover shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
                {contentSubmenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsContentMenuOpen(false)}
                    className={cn(
                      'block px-4 py-2 text-sm transition-colors hover:bg-accent',
                      pathname === item.href ? 'text-primary bg-accent/50' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sobre - Dropdown */}
          <div className="relative" ref={aboutMenuRef}>
            <button
              onClick={() => setIsAboutMenuOpen(!isAboutMenuOpen)}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent',
                isAboutActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Sobre
              <ChevronDown className={cn(
                'h-4 w-4 transition-transform duration-200',
                isAboutMenuOpen && 'rotate-180'
              )} />
            </button>

            {/* Dropdown Menu */}
            {isAboutMenuOpen && (
              <div className="absolute top-full left-0 mt-1 py-1 w-44 rounded-lg border border-border bg-popover shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
                {aboutSubmenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsAboutMenuOpen(false)}
                    className={cn(
                      'block px-4 py-2 text-sm transition-colors hover:bg-accent',
                      pathname === item.href ? 'text-primary bg-accent/50' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Theme Toggle e Mobile Menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background animate-in slide-in-from-top-2 duration-200">
          <nav className="container mx-auto px-4 py-2">
            {/* Início */}
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'block py-3 text-sm font-medium transition-colors',
                pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Início
            </Link>

            {/* Conteúdo - Accordion */}
            <div className="border-t border-border">
              <button
                onClick={() => setIsMobileContentOpen(!isMobileContentOpen)}
                className={cn(
                  'flex items-center justify-between w-full py-3 text-sm font-medium transition-colors',
                  isContentActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Conteúdo
                <ChevronDown className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isMobileContentOpen && 'rotate-180'
                )} />
              </button>
              
              {isMobileContentOpen && (
                <div className="pl-4 pb-2 space-y-1 animate-in fade-in duration-150">
                  {contentSubmenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'block py-2 text-sm transition-colors',
                        pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sobre - Accordion */}
            <div className="border-t border-border">
              <button
                onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
                className={cn(
                  'flex items-center justify-between w-full py-3 text-sm font-medium transition-colors',
                  isAboutActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Sobre
                <ChevronDown className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isMobileAboutOpen && 'rotate-180'
                )} />
              </button>
              
              {isMobileAboutOpen && (
                <div className="pl-4 pb-2 space-y-1 animate-in fade-in duration-150">
                  {aboutSubmenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'block py-2 text-sm transition-colors',
                        pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
