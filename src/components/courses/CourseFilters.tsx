'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export interface FilterState {
  search: string;
  areas: string[];
  instructors: string[];
  tags: string[];
  levels: string[];
}

interface CourseFiltersProps {
  areas: string[];
  instructors: { id: string; name: string }[];
  tags: string[];
  levels: string[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalCourses: number;
  filteredCount: number;
}

/**
 * Componente de filtros para cursos
 * Design moderno com chips selecionáveis
 */
export function CourseFilters({
  areas,
  instructors,
  tags,
  levels,
  filters,
  onFiltersChange,
  totalCourses,
  filteredCount,
}: CourseFiltersProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search.length > 0 ||
      filters.areas.length > 0 ||
      filters.instructors.length > 0 ||
      filters.tags.length > 0 ||
      filters.levels.length > 0
    );
  }, [filters]);

  const activeFiltersCount = useMemo(() => {
    return (
      filters.areas.length +
      filters.instructors.length +
      filters.tags.length +
      filters.levels.length
    );
  }, [filters]);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  const toggleArrayFilter = useCallback(
    (key: 'areas' | 'instructors' | 'tags' | 'levels', value: string) => {
      const current = filters[key];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      updateFilter(key, updated);
    },
    [filters, updateFilter]
  );

  const clearAllFilters = useCallback(() => {
    onFiltersChange({
      search: '',
      areas: [],
      instructors: [],
      tags: [],
      levels: [],
    });
  }, [onFiltersChange]);

  // Limita tags exibidas inicialmente
  const visibleTags = showAllTags ? tags : tags.slice(0, 8);
  const hasMoreTags = tags.length > 8;

  return (
    <div className="space-y-6">
      {/* Barra de busca elegante */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Buscar por nome, tecnologia ou instrutor..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-border bg-card/50 backdrop-blur-sm focus:outline-none focus:border-primary/50 focus:bg-card transition-all duration-200 text-base"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-4 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Header dos filtros */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'gap-2 transition-all',
              showFilters && 'bg-primary/10 border-primary/30'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {/* Resultados */}
          <span className="text-sm text-muted-foreground">
            {filteredCount === totalCourses ? (
              <>{totalCourses} {totalCourses === 1 ? 'curso' : 'cursos'}</>
            ) : (
              <>
                <span className="font-semibold text-foreground">{filteredCount}</span> de {totalCourses}
              </>
            )}
          </span>
        </div>

        {/* Limpar filtros */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-destructive gap-1"
          >
            <X className="h-3 w-3" />
            Limpar tudo
          </Button>
        )}
      </div>

      {/* Filtros ativos como badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {filters.areas.map((area) => (
            <Badge
              key={`area-${area}`}
              variant="secondary"
              className="pl-3 pr-2 py-1.5 gap-1 cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors"
              onClick={() => toggleArrayFilter('areas', area)}
            >
              📂 {area}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {filters.levels.map((level) => (
            <Badge
              key={`level-${level}`}
              variant="secondary"
              className="pl-3 pr-2 py-1.5 gap-1 cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors"
              onClick={() => toggleArrayFilter('levels', level)}
            >
              📊 {level}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {filters.instructors.map((id) => {
            const instructor = instructors.find((i) => i.id === id);
            return (
              <Badge
                key={`instructor-${id}`}
                variant="secondary"
                className="pl-3 pr-2 py-1.5 gap-1 cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors"
                onClick={() => toggleArrayFilter('instructors', id)}
              >
                👨‍🏫 {instructor?.name || id}
                <X className="h-3 w-3" />
              </Badge>
            );
          })}
          {filters.tags.map((tag) => (
            <Badge
              key={`tag-${tag}`}
              variant="outline"
              className="pl-3 pr-2 py-1.5 gap-1 cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors"
              onClick={() => toggleArrayFilter('tags', tag)}
            >
              #{tag}
              <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}

      {/* Painel de filtros */}
      {showFilters && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Níveis - sempre visíveis e horizontais */}
          {levels.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="text-base">📊</span> Nível
              </h3>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <Chip
                    key={level}
                    label={level}
                    isActive={filters.levels.includes(level)}
                    onClick={() => toggleArrayFilter('levels', level)}
                    color={getLevelColor(level)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Áreas */}
          {areas.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="text-base">📂</span> Área
              </h3>
              <div className="flex flex-wrap gap-2">
                {areas.map((area) => (
                  <Chip
                    key={area}
                    label={area}
                    isActive={filters.areas.includes(area)}
                    onClick={() => toggleArrayFilter('areas', area)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Instrutores */}
          {instructors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="text-base">👨‍🏫</span> Instrutor
              </h3>
              <div className="flex flex-wrap gap-2">
                {instructors.map((instructor) => (
                  <Chip
                    key={instructor.id}
                    label={instructor.name}
                    isActive={filters.instructors.includes(instructor.id)}
                    onClick={() => toggleArrayFilter('instructors', instructor.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="text-base">🏷️</span> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {visibleTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    isActive={filters.tags.includes(tag)}
                    onClick={() => toggleArrayFilter('tags', tag)}
                    variant="outline"
                  />
                ))}
                {hasMoreTags && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="px-3 py-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    {showAllTags ? 'Ver menos' : `+${tags.length - 8} mais`}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Retorna cor baseada no nível
 */
function getLevelColor(level: string): string {
  switch (level) {
    case 'Iniciante':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20';
    case 'Intermediário':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20';
    case 'Avançado':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20';
    default:
      return '';
  }
}

/**
 * Chip selecionável para filtros
 */
interface ChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: 'default' | 'outline';
  color?: string;
}

function Chip({ label, isActive, onClick, variant = 'default', color }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
        'focus:outline-none focus:ring-2 focus:ring-primary/20',
        isActive
          ? color 
            ? cn(color, 'border-current')
            : 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
          : variant === 'outline'
          ? 'border-border bg-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground'
          : 'border-transparent bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
      )}
    >
      {label}
    </button>
  );
}
