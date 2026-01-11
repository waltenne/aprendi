'use client';

import { useState, useMemo, useDeferredValue } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  X, 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  BookOpen,
  Grid3X3,
  List,
  SlidersHorizontal,
  Heart,
  MoreHorizontal,
  Bookmark,
  Star,
  Tag,
  ArrowUpDown,
} from 'lucide-react';
import type { CourseWithInstructor } from '@/lib/loaders/courses';

// ============================================================================
// Types & Constants
// ============================================================================

interface FilterState {
  levels: string[];
  areas: string[];
  sortBy: 'popular' | 'recent' | 'alphabetical' | 'duration';
}

interface CoursesPageClientProps {
  courses: CourseWithInstructor[];
  areas: string[];
  tags: string[];
  levels: string[];
  instructors: { id: string; name: string }[];
}

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: 'popular', label: 'Populares' },
  { value: 'recent', label: 'Recentes' },
  { value: 'alphabetical', label: 'A-Z' },
  { value: 'duration', label: 'Duração' },
] as const;

// ============================================================================
// Main Component
// ============================================================================

export function CoursesPageClient({
  courses,
  areas,
  levels,
}: CoursesPageClientProps) {
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    levels: [],
    areas: [],
    sortBy: 'popular',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const deferredSearch = useDeferredValue(searchInput);

  // Filter and sort
  const filteredCourses = useMemo(() => {
    let result = courses.filter((course) => {
      if (deferredSearch) {
        const searchLower = deferredSearch.toLowerCase();
        const matchesSearch =
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower) ||
          course.area.toLowerCase().includes(searchLower) ||
          course.tags.some((tag) => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      if (filters.levels.length > 0 && !filters.levels.includes(course.level)) {
        return false;
      }

      if (filters.areas.length > 0 && !filters.areas.includes(course.area)) {
        return false;
      }

      return true;
    });

    switch (filters.sortBy) {
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'duration':
        result.sort((a, b) => {
          const getDuration = (d: string) => parseInt(d.replace(/\D/g, '')) || 0;
          return getDuration(a.duration) - getDuration(b.duration);
        });
        break;
      case 'recent':
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [courses, filters, deferredSearch]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const toggleLevel = (level: string) => {
    handleFilterChange({
      levels: filters.levels.includes(level)
        ? filters.levels.filter(l => l !== level)
        : [...filters.levels, level]
    });
  };

  const toggleArea = (area: string) => {
    handleFilterChange({
      areas: filters.areas.includes(area)
        ? filters.areas.filter(a => a !== area)
        : [...filters.areas, area]
    });
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({ levels: [], areas: [], sortBy: 'popular' });
    setCurrentPage(1);
  };

  const activeFiltersCount = filters.levels.length + filters.areas.length;

  // Stats
  const stats = [
    { label: 'Total de Cursos', value: courses.length, icon: Bookmark, color: 'text-blue-500' },
    { label: 'Favoritos', value: courses.filter(c => c.featured).length, icon: Star, color: 'text-amber-500' },
    { label: 'Áreas', value: areas.length, icon: Tag, color: 'text-emerald-500' },
    { label: 'Níveis', value: levels.length, icon: ArrowUpDown, color: 'text-purple-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
          >
            <div className={cn('p-2 rounded-lg bg-muted', stat.color)}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header with Title and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Todos os Cursos</h1>
          <p className="text-sm text-muted-foreground">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 pl-9 pr-9 text-sm rounded-lg border border-border bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative hidden sm:block">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="h-9 pl-3 pr-8 text-sm rounded-lg border border-border bg-card appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={cn(
              'flex items-center gap-2 h-9 px-3 rounded-lg border text-sm font-medium transition-colors',
              showMobileFilters
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card hover:bg-accent'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* View Toggle */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden bg-card">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'h-9 w-9 flex items-center justify-center transition-colors',
                viewMode === 'grid' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'h-9 w-9 flex items-center justify-center transition-colors',
                viewMode === 'list' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showMobileFilters && (
        <div className="p-4 rounded-xl border border-border bg-card animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap gap-6">
            {/* Levels */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Nível</p>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => toggleLevel(level)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      filters.levels.includes(level)
                        ? getLevelButtonStyle(level)
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Areas */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Área</p>
              <div className="flex flex-wrap gap-2">
                {areas.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      filters.areas.includes(area)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    )}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* Course Grid/List */}
      {paginatedCourses.length > 0 ? (
        <div className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4' 
            : 'flex flex-col gap-3'
        )}>
          {paginatedCourses.map((course, index) => (
            <div
              key={course.id}
              className="animate-in fade-in duration-200"
              style={{ animationDelay: `${Math.min(index * 30, 150)}ms` }}
            >
              {viewMode === 'grid' ? (
                <CourseCardGrid course={course} />
              ) : (
                <CourseCardList course={course} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState onClear={clearFilters} />
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

function CourseCardGrid({ course }: { course: CourseWithInstructor }) {
  const [isFavorited, setIsFavorited] = useState(course.featured);

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-200">
      {/* Preview Area */}
      <Link href={`/cursos/${course.id}`} className="block">
        <div 
          className="h-36 flex items-center justify-center"
          style={{ backgroundColor: `${course.color}15` }}
        >
          <span className="text-5xl">{course.icon}</span>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className={cn(
            'p-1.5 rounded-lg transition-all',
            isFavorited
              ? 'bg-rose-500 text-white'
              : 'bg-black/40 text-white hover:bg-black/60'
          )}
        >
          <Heart className={cn('h-4 w-4', isFavorited && 'fill-current')} />
        </button>
        <button className="p-1.5 rounded-lg bg-black/40 text-white hover:bg-black/60 transition-all">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3">
        <Link href={`/cursos/${course.id}`}>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {course.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          <Badge 
            variant="secondary" 
            className={cn('text-xs', getLevelBadgeStyle(course.level))}
          >
            {course.level}
          </Badge>
          <Badge 
            variant="secondary"
            className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400"
          >
            {course.area}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function CourseCardList({ course }: { course: CourseWithInstructor }) {
  const [isFavorited, setIsFavorited] = useState(course.featured);

  return (
    <div className="group relative flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-200">
      {/* Icon */}
      <Link href={`/cursos/${course.id}`}>
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${course.color}15` }}
        >
          <span className="text-3xl">{course.icon}</span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link href={`/cursos/${course.id}`}>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {course.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground truncate">
          {course.description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Badge 
            variant="secondary" 
            className={cn('text-xs', getLevelBadgeStyle(course.level))}
          >
            {course.level}
          </Badge>
          <Badge 
            variant="secondary"
            className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400"
          >
            {course.area}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {course.duration}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className={cn(
            'p-2 rounded-lg transition-all',
            isFavorited
              ? 'bg-rose-500/10 text-rose-500'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          )}
        >
          <Heart className={cn('h-4 w-4', isFavorited && 'fill-current')} />
        </button>
        <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-all">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function getLevelBadgeStyle(level: string): string {
  switch (level) {
    case 'Iniciante':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    case 'Intermediário':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    case 'Avançado':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getLevelButtonStyle(level: string): string {
  switch (level) {
    case 'Iniciante':
      return 'bg-emerald-500 text-white';
    case 'Intermediário':
      return 'bg-amber-500 text-white';
    case 'Avançado':
      return 'bg-rose-500 text-white';
    default:
      return 'bg-primary text-primary-foreground';
  }
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-1 pt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20 disabled:opacity-40 disabled:pointer-events-none transition-all"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, i) => (
          page === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="w-9 text-center text-muted-foreground">…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'h-9 min-w-9 px-3 flex items-center justify-center rounded-lg text-sm font-medium transition-all',
                currentPage === page
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20'
              )}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20 disabled:opacity-40 disabled:pointer-events-none transition-all"
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Search className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Nenhum curso encontrado</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        Tente ajustar os filtros ou usar termos diferentes.
      </p>
      <button
        onClick={onClear}
        className="text-sm font-medium text-primary hover:underline"
      >
        Limpar filtros
      </button>
    </div>
  );
}
