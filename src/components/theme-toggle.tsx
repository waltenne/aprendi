'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Componente de toggle de tema
 * Alterna entre tema claro e escuro com melhor UX
 */
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Evita hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-10 w-10">
        <Sun className="h-5 w-5" />
        <span className="sr-only">Alternar tema</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="group relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative h-9 w-9 overflow-hidden hover:bg-sidebar-accent transition-all duration-300 hover:rotate-12 active:scale-90"
        onClick={toggleTheme}
        data-theme-toggle
        aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      >
        {/* Sol */}
        <Sun 
          className={cn(
            'absolute h-[1.1rem] w-[1.1rem] transition-all duration-500 ease-in-out text-amber-500',
            isDark 
              ? 'rotate-90 scale-0 opacity-0' 
              : 'rotate-0 scale-100 opacity-100'
          )} 
        />
        {/* Lua */}
        <Moon 
          className={cn(
            'absolute h-[1.1rem] w-[1.1rem] transition-all duration-500 ease-in-out text-blue-400',
            isDark 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          )} 
        />
        <span className="sr-only">
          {isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
        </span>
      </Button>
      
      {/* Tooltip */}
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-foreground text-background text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
        {isDark ? 'Tema claro' : 'Tema escuro'}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
      </div>
    </div>
  );
}
