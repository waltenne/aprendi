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
  User
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
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    level: true,
    area: true,
  });

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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFiltersCount = filters.levels.length + filters.areas.length;

  // Sidebar content
  const sidebarContent = (
    <div className="space-y-1">
      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-10 pr-10 text-sm rounded-lg border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
      </div>

      {/* Sort */}
      <FilterSection
        title="Ordenar por"
        isExpanded={expandedSections.sort}
        onToggle={() => toggleSection('sort')}
      >
        <div className="space-y-1">
          {SORT_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleFilterChange({ sortBy: option.value })}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                filters.sortBy === option.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                filters.sortBy === option.value ? "border-primary" : "border-muted-foreground/40"
              )}>
                {filters.sortBy === option.value && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Level */}
      <FilterSection
        title="Nível"
        isExpanded={expandedSections.level}
        onToggle={() => toggleSection('level')}
        count={filters.levels.length}
      >
        <div className="space-y-1">
          {levels.map(level => (
            <button
              key={level}
              onClick={() => toggleLevel(level)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                filters.levels.includes(level)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                filters.levels.includes(level)
                  ? getLevelColor(level)
                  : "border-muted-foreground/40"
              )}>
                {filters.levels.includes(level) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {level}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Area */}
      <FilterSection
        title="Área"
        isExpanded={expandedSections.area}
        onToggle={() => toggleSection('area')}
        count={filters.areas.length}
      >
        <div className="space-y-1">
          {areas.map(area => (
            <button
              key={area}
              onClick={() => toggleArea(area)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                filters.areas.includes(area)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                filters.areas.includes(area)
                  ? "bg-primary border-primary"
                  : "border-muted-foreground/40"
              )}>
                {filters.areas.includes(area) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {area}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Clear filters */}
      {activeFiltersCount > 0 && (
        <div className="p-4 pt-2">
          <button
            onClick={clearFilters}
            className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Limpar filtros ({activeFiltersCount})
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex gap-8">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-20 rounded-lg border border-border bg-card overflow-hidden">
          {sidebarContent}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Mobile filter button + View toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-accent transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground hidden sm:block">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'curso' : 'cursos'}
            </p>
            
            {/* View toggle */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "h-9 w-9 flex items-center justify-center transition-colors",
                  viewMode === 'grid' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "h-9 w-9 flex items-center justify-center transition-colors",
                  viewMode === 'list' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile filters */}
        {showMobileFilters && (
          <div className="lg:hidden mb-4 rounded-lg border border-border bg-card overflow-hidden">
            {sidebarContent}
          </div>
        )}

        {/* Course Grid/List */}
        {paginatedCourses.length > 0 ? (
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" 
              : "flex flex-col gap-3"
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
    </div>
  );
}

// ============================================================================
// Filter Section
// ============================================================================

function FilterSection({
  title,
  isExpanded,
  onToggle,
  count,
  children,
}: {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {count !== undefined && count > 0 && (
            <span className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full bg-primary/20 text-primary text-xs">
              {count}
            </span>
          )}
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform duration-200",
          isExpanded && "rotate-180"
        )} />
      </button>
      <div className={cn(
        "grid transition-all duration-200 ease-out",
        isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden">
          <div className="px-4 pb-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Course Cards
// ============================================================================

function CourseCardGrid({ course }: { course: CourseWithInstructor }) {
  return (
    <Link href={`/cursos/${course.id}`}>
      <article className="group h-full p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <span className="text-3xl">{course.icon}</span>
          <LevelBadge level={course.level} />
        </div>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {course.description}
        </p>
        {course.instructorData && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <User className="h-3.5 w-3.5" />
            <span>{course.instructorData.name}</span>
          </div>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{course.sections?.length || 0} seções</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function CourseCardList({ course }: { course: CourseWithInstructor }) {
  return (
    <Link href={`/cursos/${course.id}`}>
      <article className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200">
        <span className="text-3xl flex-shrink-0">{course.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {course.description}
              </p>
            </div>
            <LevelBadge level={course.level} />
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
            {course.instructorData && (
              <>
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span>{course.instructorData.name}</span>
                </div>
                <span className="text-border">•</span>
              </>
            )}
            <span>{course.area}</span>
            <span className="text-border">•</span>
            <span>{course.duration}</span>
            <span className="text-border">•</span>
            <span>{course.sections?.length || 0} seções</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function LevelBadge({ level }: { level: string }) {
  const getVariant = () => {
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
  };

  return (
    <Badge variant="secondary" className={cn('text-xs font-medium border-0', getVariant())}>
      {level}
    </Badge>
  );
}

function getLevelColor(level: string): string {
  switch (level) {
    case 'Iniciante':
      return 'bg-emerald-500 border-emerald-500';
    case 'Intermediário':
      return 'bg-amber-500 border-amber-500';
    case 'Avançado':
      return 'bg-rose-500 border-rose-500';
    default:
      return 'bg-primary border-primary';
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
    <nav className="flex items-center justify-center gap-1 pt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/20 disabled:opacity-40 disabled:pointer-events-none transition-all"
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
                "h-9 min-w-9 px-3 flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                currentPage === page
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/20"
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
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/20 disabled:opacity-40 disabled:pointer-events-none transition-all"
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
