"use client";
'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { ProfileSwitcher } from '@/components/profile/ProfileSwitcher';
import { GitHubStats } from '@/components/layout/GitHubStats';
import {
  GraduationCap,
  Search,
  BookOpen,
  Users,
  Info,
  Heart,
  Settings,
  ChevronDown,
  Home,
  FolderOpen,
  Tag,
  Menu,
  X,
  GitBranch,
  Filter,
  CheckCircle2,
  Circle,
  Star,
  GitFork,
  Eye,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface SidebarProps {
  children: React.ReactNode;
  levels?: string[];
  instructors?: { id: string; name: string }[];
  areas?: string[];
  tags?: string[];
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  count?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// ============================================================================
// Navigation Config
// ============================================================================

const mainNav: NavItem[] = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Todos os Cursos', href: '/cursos', icon: BookOpen },
  { name: 'Favoritos', href: '/favoritos', icon: Heart },
  { name: 'Instrutores', href: '/instrutores', icon: Users },
];

const navIconColors: Record<string, string> = {
  '/': 'text-blue-500',
  '/cursos': 'text-emerald-500',
  '/favoritos': 'text-pink-500',
  '/instrutores': 'text-purple-500',
};

const aboutIconColors: Record<string, string> = {
  '/sobre': 'text-cyan-500',
  '/contribuir': 'text-orange-500',
};

const aboutNav: NavItem[] = [
  { name: 'Sobre o Projeto', href: '/sobre', icon: Info },
  { name: 'Como Contribuir', href: '/contribuir', icon: GitBranch },
];

// ============================================================================
// Sidebar Layout Component
// ============================================================================

export function SidebarLayout({ children, levels = [], instructors = [], areas = [], tags = [] }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLevelsExpanded, setIsLevelsExpanded] = useState(true);
  const [isInstructorsExpanded, setIsInstructorsExpanded] = useState(false);
  const [isAreasExpanded, setIsAreasExpanded] = useState(false);
  const [isFilterTagsExpanded, setIsFilterTagsExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Ler filtros dos query params
  const selectedLevels = searchParams.get('levels')?.split(',').filter(Boolean) || [];
  const selectedInstructors = searchParams.get('instructors')?.split(',').filter(Boolean) || [];
  const selectedAreas = searchParams.get('areas')?.split(',').filter(Boolean) || [];
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const searchQuery = searchParams.get('search') || '';
  
  // Mostrar filtros apenas na raiz "Todos os Cursos"
  const isCoursesPage = pathname === '/cursos' || pathname === '/cursos/';
  
  // Fechar menu mobile ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  // Atalho de teclado Cmd+K / Ctrl+K para focar na busca (apenas na página de cursos)
  useEffect(() => {
    if (!isCoursesPage) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Captura Cmd+K (Mac) ou Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        e.stopPropagation();
        
        const input = searchInputRef.current;
        if (input) {
          input.focus();
          input.select();
        }
      }
    };
    
    // Usa capture phase para interceptar antes de outros handlers
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [isCoursesPage]);
  
  // Função para atualizar filtros
  const toggleFilter = (type: 'levels' | 'instructors' | 'areas' | 'tags', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(type)?.split(',').filter(Boolean) || [];

    let newValues: string[];
    if (current.includes(value)) {
      newValues = current.filter(v => v !== value);
    } else {
      newValues = [...current, value];
    }

    if (newValues.length > 0) {
      params.set(type, newValues.join(','));
    } else {
      params.delete(type);
    }

    const nextUrl = `${pathname}?${params.toString()}`;
    startTransition(() => router.replace(nextUrl, { scroll: false }));
  };


  const clearAllFilters = () => {
    startTransition(() => router.replace(pathname, { scroll: false }));
  };
  
  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set('search', value.trim());
    } else {
      params.delete('search');
    }
    const nextUrl = `${pathname}?${params.toString()}`;
    startTransition(() => router.replace(nextUrl, { scroll: false }));
  };
  
  const activeFiltersCount = selectedLevels.length + selectedInstructors.length + selectedAreas.length + selectedTags.length;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header com Logo e Theme Toggle */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Aprendi"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg">Aprendi</span>
        </div>
        <div className="transition-all duration-300 hover:scale-110 active:scale-95">
          <ThemeToggle />
        </div>
      </div>
      <ProfileSwitcher />

      {/* Search - apenas na página de cursos */}
      {isCoursesPage && (
        <div className="px-3 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar cursos..."
              defaultValue={searchQuery}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchChange(e.currentTarget.value);
                }
              }}
              onBlur={(e) => handleSearchChange(e.currentTarget.value)}
              className="w-full h-9 pl-9 pr-16 text-sm rounded-lg bg-sidebar-accent border-0 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-6">
        {/* Main Navigation */}
        <div>
          <div className="px-3 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navegação
            </span>
          </div>
          <div className="space-y-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              const iconColor = navIconColors[item.href] || 'text-muted-foreground';
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <item.icon className={cn('h-4 w-4', !isActive && iconColor)} />
                  <span>{item.name}</span>
                  {item.count !== undefined && (
                    <span className="ml-auto text-xs bg-sidebar-accent px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* About Section */}
        <div>
          <div className="px-3 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sobre
            </span>
          </div>
          <div className="space-y-1">
            {aboutNav.map((item) => {
              const isActive = pathname === item.href;
              const iconColor = aboutIconColors[item.href] || 'text-muted-foreground';
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <item.icon className={cn('h-4 w-4', !isActive && iconColor)} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
          
          {/* GitHub Stats */}
          <GitHubStats />
        </div>

        {/* Filtros - apenas na página de cursos */}
        {isCoursesPage && (
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Filter className="h-3 w-3" />
                Filtros
              </span>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Limpar
                </button>
              )}
            </div>
            
            {levels.length === 0 && instructors.length === 0 && areas.length === 0 && tags.length === 0 ? (
              <p className="px-3 text-xs text-muted-foreground">Carregando filtros...</p>
            ) : (
              <>
            {/* Níveis */}
            {levels.length > 0 && (
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => setIsLevelsExpanded(!isLevelsExpanded)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-sm hover:bg-sidebar-accent rounded-lg transition-colors"
                >
                  <span className="font-medium text-muted-foreground">Nível</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform',
                      isLevelsExpanded && 'rotate-180'
                    )}
                  />
                </button>
                {isLevelsExpanded && (
                  <div className="mt-1 space-y-0.5 px-3">
                    {levels.map((level) => {
                      const isSelected = selectedLevels.includes(level);
                      return (
                        <button
                          type="button"
                          key={level}
                          onClick={() => toggleFilter('levels', level)}
                          className={cn(
                            'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors',
                            isSelected
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                          )}
                        >
                          {isSelected ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                          <span>{level}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* Áreas */}
            {areas.length > 0 && (
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => setIsAreasExpanded(!isAreasExpanded)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-sm hover:bg-sidebar-accent rounded-lg transition-colors"
                >
                  <span className="font-medium text-muted-foreground">Área</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform',
                      isAreasExpanded && 'rotate-180'
                    )}
                  />
                </button>
                {isAreasExpanded && (
                  <div className="mt-1 space-y-0.5 px-3">
                    {areas.map((area) => {
                      const isSelected = selectedAreas.includes(area);
                      return (
                        <button
                          type="button"
                          key={area}
                          onClick={() => toggleFilter('areas', area)}
                          className={cn(
                            'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors',
                            isSelected
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                          )}
                        >
                          {isSelected ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                          <span className="truncate">{area}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* Tags de Filtro - apenas quando área ou nível estão selecionados */}
            {tags.length > 0 && (selectedAreas.length > 0 || selectedLevels.length > 0) && (
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => setIsFilterTagsExpanded(!isFilterTagsExpanded)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-sm hover:bg-sidebar-accent rounded-lg transition-colors"
                >
                  <span className="font-medium text-muted-foreground">Tags</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform',
                      isFilterTagsExpanded && 'rotate-180'
                    )}
                  />
                </button>
                {isFilterTagsExpanded && (
                  <div className="mt-1 space-y-0.5 px-3 max-h-48 overflow-y-auto">
                    {tags.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => toggleFilter('tags', tag)}
                          className={cn(
                            'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors',
                            isSelected
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                          )}
                        >
                          {isSelected ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                          <span className="truncate">{tag}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* Instrutores */}
            {instructors.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setIsInstructorsExpanded(!isInstructorsExpanded)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-sm hover:bg-sidebar-accent rounded-lg transition-colors"
                >
                  <span className="font-medium text-muted-foreground">Instrutor</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform',
                      isInstructorsExpanded && 'rotate-180'
                    )}
                  />
                </button>
                {isInstructorsExpanded && (
                  <div className="mt-1 space-y-0.5 px-3">
                    {instructors.map((instructor) => {
                      const isSelected = selectedInstructors.includes(instructor.id);
                      return (
                        <button
                          type="button"
                          key={instructor.id}
                          onClick={() => toggleFilter('instructors', instructor.id)}
                          className={cn(
                            'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors',
                            isSelected
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                          )}
                        >
                          {isSelected ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                          <span className="truncate">{instructor.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
              </>
            )}
          </div>
        )}
      </nav>

      {/* Footer - Removido Favoritos e Tema */}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
        {sidebarContent}
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Aprendi"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold">Aprendi</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-out',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <div className="pt-14 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
