"use client";
'use client';

import { useState, useMemo, useDeferredValue, useEffect } from 'react';
import { useAllProgress } from '@/hooks/useProgress';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Grid3X3,
  List,
  Heart,
  MoreHorizontal,
  Bookmark,
  Star,
  Tag,
  User,
  Award,
} from 'lucide-react';
import type { CourseWithInstructor } from '@/lib/loaders/courses';

// ============================================================================
// Types & Constants
// ============================================================================

interface CoursesPageClientProps {
  courses: CourseWithInstructor[];
  areas: string[];
  tags: string[];
  levels: string[];
  instructors: { id: string; name: string }[];
}

const ITEMS_PER_PAGE = 12;

// ============================================================================
// Main Component
// ============================================================================

export function CoursesPageClient({
  courses,
  areas,
  levels,
  instructors,
}: CoursesPageClientProps) {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteCourses, setFavoriteCourses] = useState<Set<string>>(new Set());
  const { progressMap: allProgress, isLoaded: progressLoaded } = useAllProgress();
  const [isLoaded, setIsLoaded] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const selectedLevels = searchParams.get('levels')?.split(',').filter(Boolean) || [];
  const selectedInstructors = searchParams.get('instructors')?.split(',').filter(Boolean) || [];
  const selectedAreas = searchParams.get('areas')?.split(',').filter(Boolean) || [];
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const searchQuery = searchParams.get('search') || '';

  // Carregar profileId ativo
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const activeId = localStorage.getItem('pcursos:activeProfileId');
    setProfileId(activeId);
  }, []);

  // Carregar favoritos do localStorage por perfil
  useEffect(() => {
    if (!profileId) return;
    const key = `pcursos:favorites:${profileId}`;
    const storedFavorites = localStorage.getItem(key);
    if (storedFavorites) {
      try {
        setFavoriteCourses(new Set(JSON.parse(storedFavorites)));
      } catch {
        setFavoriteCourses(new Set());
      }
    } else {
      setFavoriteCourses(new Set());
    }
    setIsLoaded(true);
  }, [profileId]);

  // Salvar favoritos no localStorage quando mudam
  useEffect(() => {
    if (isLoaded && profileId) {
      const key = `pcursos:favorites:${profileId}`;
      localStorage.setItem(key, JSON.stringify(Array.from(favoriteCourses)));
    }
  }, [favoriteCourses, isLoaded, profileId]);
  
  // Função para alternar favorito
  const toggleFavorite = (courseId: string) => {
    setFavoriteCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };
  // (Removido: efeitos e funções de progresso global não utilizados)

  // Filter courses based on URL params
  const filteredCourses = useMemo(() => {
    let result = courses;

    // Filtro de busca de texto
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.area.toLowerCase().includes(searchLower) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filtro de nível
    if (selectedLevels.length > 0) {
      result = result.filter(course => selectedLevels.includes(course.level));
    }

    // Filtro de instrutor
    if (selectedInstructors.length > 0) {
      result = result.filter(course => selectedInstructors.includes(course.instructor.id));
    }

    // Filtro de área
    if (selectedAreas.length > 0) {
      result = result.filter(course => selectedAreas.includes(course.area));
    }

    // Filtro de tags
    if (selectedTags.length > 0) {
      result = result.filter(course =>
        selectedTags.some(tag => course.tags.includes(tag))
      );
    }

    return result;
  }, [courses, searchQuery, selectedLevels, selectedInstructors, selectedAreas, selectedTags]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  // Stats baseados no progresso real
  const allProgressArr = Object.values(allProgress);
  const inProgressCount = allProgressArr.filter(p => p.progress > 0 && p.progress < 100).length;
  const completedCount = allProgressArr.filter(p => p.progress >= 100 || p.completed).length;
  const stats = [
    { label: 'Total', value: courses.length, icon: Bookmark, color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Favoritos', value: favoriteCourses.size, icon: Star, color: 'bg-amber-500/10 text-amber-500' },
    { label: 'Em Progresso', value: inProgressCount, icon: BookOpen, color: 'bg-purple-500/10 text-purple-500' },
    { label: 'Finalizados', value: completedCount, icon: Tag, color: 'bg-emerald-500/10 text-emerald-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-start gap-3 p-4 rounded-lg bg-card border border-border/50 hover:border-border transition-colors"
          >
            <div className={cn('p-2 rounded-md', stat.color)}>
              <stat.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header with Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Todos os Cursos
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 border border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'h-9 w-9 flex items-center justify-center rounded-lg transition-all',
              viewMode === 'grid' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'h-9 w-9 flex items-center justify-center rounded-lg transition-all',
              viewMode === 'list' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Course Grid/List */}
      {paginatedCourses.length > 0 ? (
        <div className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 auto-rows-fr' 
            : 'flex flex-col gap-4'
        )}>
          {paginatedCourses.map((course, index) => {
            const progressObj = allProgress[course.id];
            const progress = progressObj?.progress || 0;
            const completed = progressObj?.progress >= 100 || progressObj?.completed;
            return (
              <div
                key={course.id}
                className="animate-in fade-in duration-300 h-full"
                style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }}
              >
                {viewMode === 'grid' ? (
                  <CourseCardGrid 
                    course={course} 
                    isFavorited={favoriteCourses.has(course.id)}
                    onToggleFavorite={toggleFavorite}
                    progress={progress}
                    completed={!!completed}
                  />
                ) : (
                  <CourseCardList 
                    course={course} 
                    isFavorited={favoriteCourses.has(course.id)}
                    onToggleFavorite={toggleFavorite}
                    progress={progress}
                    completed={!!completed}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

// ============================================================================
// Course Cards - Square UI Style
// ============================================================================

function CourseCardGrid({ 
  course, 
  isFavorited,
  onToggleFavorite,
  progress,
  completed
}: { 
  course: CourseWithInstructor
  isFavorited: boolean
  onToggleFavorite: (courseId: string) => void
  progress: number
  completed: boolean
}) {
  return (
    <div className="group relative flex flex-col h-full rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 overflow-hidden hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Preview Area with Gradient Overlay */}
      <Link href={`/cursos/${course.id}`} className="block relative">
        <div 
          className="h-40 flex items-center justify-center relative overflow-hidden"
          style={{ 
            background: course.cover 
              ? `linear-gradient(135deg, ${course.color}15 0%, ${course.color}05 100%)`
              : `linear-gradient(135deg, ${course.color}20 0%, ${course.color}05 100%)`
          }}
        >
          {course.cover ? (
            <Image
              src={course.cover}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
              {course.icon}
            </span>
          )}
          
          {/* Gradient Overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {/* Status Badge */}
      {completed && (
        <div className="absolute top-3 left-3 z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-medium shadow-lg">
            <Award className="h-3 w-3" />
            <span>Concluído</span>
          </div>
        </div>
      )}

      {/* Favorite Button */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => onToggleFavorite(course.id)}
          className={cn(
            'p-2 rounded-full transition-all shadow-lg backdrop-blur-sm',
            isFavorited
              ? 'bg-rose-500 text-white hover:bg-rose-600'
              : 'bg-white/90 text-rose-500 hover:bg-rose-500 hover:text-white'
          )}
        >
          <Heart className={cn('h-4 w-4', isFavorited && 'fill-current')} />
        </button>
      </div>

      {/* Content - Fixed height for consistency */}
      <div className="flex-1 flex flex-col p-5 space-y-3">
        {/* Title - Always 2 lines */}
        <Link href={`/cursos/${course.id}`}>
          <h3 className="font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2 h-[2.8rem]">
            {course.title}
          </h3>
        </Link>
        
        {/* Description - Always 3 lines for full text */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 h-[3.75rem]">
          {course.description}
        </p>

        {/* Progress Bar - Fixed height slot */}
        <div className="h-[3.5rem] flex flex-col justify-center">
          {(progress > 0 || completed) ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Progresso</span>
                <span className={cn(
                  "font-bold",
                  completed ? "text-emerald-600" : "text-primary"
                )}>
                  {completed ? '100%' : `${progress}%`}
                </span>
              </div>
              <div className="relative w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                    completed 
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-400" 
                      : "bg-gradient-to-r from-primary to-primary/80"
                  )}
                  style={{ width: `${completed ? 100 : progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              <div className="h-1 flex-1 bg-muted/30 rounded-full" />
            </div>
          )}
        </div>

        {/* Instructor - Fixed height */}
        <div className="h-[1.5rem] flex items-center">
          {course.instructorData && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10">
                <User className="h-3 w-3 text-primary" />
              </div>
              <span className="font-medium truncate">{course.instructorData.name}</span>
            </div>
          )}
        </div>

        {/* Metadata - Fixed at bottom */}
        <div className="mt-auto pt-3 border-t border-border/50">
          <div className="flex items-center justify-between gap-2">
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
              getLevelBadgeStyle(course.level)
            )}>
              {course.level}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Clock className="h-3.5 w-3.5" />
              <span>{course.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseCardList({ 
  course, 
  isFavorited,
  onToggleFavorite,
  progress,
  completed
}: { 
  course: CourseWithInstructor
  isFavorited: boolean
  onToggleFavorite: (courseId: string) => void
  progress: number
  completed: boolean
}) {
  return (
    <div className="group relative flex items-stretch gap-4 p-4 rounded-2xl border border-border/50 bg-gradient-to-r from-card to-card/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
      {/* Icon/Cover with gradient */}
      <Link href={`/cursos/${course.id}`} className="flex-shrink-0">
        <div 
          className="h-24 w-24 rounded-xl flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300"
          style={{ 
            background: `linear-gradient(135deg, ${course.color}20 0%, ${course.color}05 100%)`
          }}
        >
          {course.cover ? (
            <Image
              src={course.cover}
              alt={course.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="text-4xl">{course.icon}</span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <div className="flex items-start gap-2 mb-1">
            <Link href={`/cursos/${course.id}`} className="flex-1 min-w-0">
              <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">
                {course.title}
              </h3>
            </Link>
            {completed && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold whitespace-nowrap">
                <Award className="h-3 w-3" />
                <span>Concluído</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-2">
            {course.description}
          </p>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-3 flex-wrap">
          {course.instructorData && (
            <>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="flex items-center justify-center h-4 w-4 rounded-full bg-primary/10">
                  <User className="h-2.5 w-2.5 text-primary" />
                </div>
                <span className="font-medium">{course.instructorData.name}</span>
              </div>
              <span className="text-muted-foreground/30">•</span>
            </>
          )}
          <span className={cn(
            'px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap',
            getLevelBadgeStyle(course.level)
          )}>
            {course.level}
          </span>
          <span className="text-muted-foreground/30">•</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {(progress > 0 || completed) && (
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="relative flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                    completed 
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-400" 
                      : "bg-gradient-to-r from-primary to-primary/80"
                  )}
                  style={{ width: `${completed ? 100 : progress}%` }}
                />
              </div>
              <span className={cn(
                "text-xs font-bold whitespace-nowrap min-w-[3rem] text-right",
                completed ? "text-emerald-600" : "text-primary"
              )}>
                {completed ? '100%' : `${progress}%`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 justify-center">
        <button
          onClick={() => onToggleFavorite(course.id)}
          className={cn(
            'p-2 rounded-full transition-all',
            isFavorited
              ? 'bg-rose-500 text-white hover:bg-rose-600'
              : 'text-muted-foreground hover:bg-accent hover:text-rose-500'
          )}
        >
          <Heart className={cn('h-4 w-4', isFavorited && 'fill-current')} />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 rounded-full bg-muted mb-4">
        <BookOpen className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Nenhum curso encontrado</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Tente ajustar os filtros ou buscar por outros termos.
      </p>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showPages = pages.filter(page => {
    if (page === 1 || page === totalPages) return true;
    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
    return false;
  });

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {showPages.map((page, index) => {
        const prev = showPages[index - 1];
        const showEllipsis = prev && page - prev > 1;

        return (
          <div key={page} className="flex items-center gap-2">
            {showEllipsis && (
              <span className="px-2 text-muted-foreground">...</span>
            )}
            <button
              onClick={() => onPageChange(page)}
              className={cn(
                'h-9 min-w-[36px] px-3 rounded-lg text-sm font-medium transition-colors',
                page === currentPage
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border hover:bg-accent'
              )}
            >
              {page}
            </button>
          </div>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

function getLevelBadgeStyle(level: string): string {
  const styles: Record<string, string> = {
    'Iniciante': 'bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 text-emerald-600 border border-emerald-500/20',
    'Intermediário': 'bg-gradient-to-r from-amber-500/20 to-amber-400/20 text-amber-600 border border-amber-500/20',
    'Avançado': 'bg-gradient-to-r from-rose-500/20 to-rose-400/20 text-rose-600 border border-rose-500/20',
  };
  return styles[level] || 'bg-muted text-muted-foreground border border-border';
}
