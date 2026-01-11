'use client';

import { useState, useMemo, useCallback } from 'react';
import { CourseCard } from '@/components/courses';
import { CourseFilters, type FilterState } from './CourseFilters';
import type { CourseWithInstructor } from '@/lib/loaders/courses';

interface CoursesPageClientProps {
  courses: CourseWithInstructor[];
  areas: string[];
  tags: string[];
  levels: string[];
  instructors: { id: string; name: string }[];
}

/**
 * Componente cliente para a página de cursos com filtros
 */
export function CoursesPageClient({
  courses,
  areas,
  tags,
  levels,
  instructors,
}: CoursesPageClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    areas: [],
    instructors: [],
    tags: [],
    levels: [],
  });

  // Filtra os cursos baseado nos filtros ativos
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Filtro de busca por texto
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower) ||
          course.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          course.area.toLowerCase().includes(searchLower) ||
          (course.instructorData?.name.toLowerCase().includes(searchLower) ?? false);
        
        if (!matchesSearch) return false;
      }

      // Filtro por área
      if (filters.areas.length > 0) {
        if (!filters.areas.includes(course.area)) return false;
      }

      // Filtro por nível
      if (filters.levels.length > 0) {
        if (!filters.levels.includes(course.level)) return false;
      }

      // Filtro por instrutor
      if (filters.instructors.length > 0) {
        if (!filters.instructors.includes(course.instructor.id)) return false;
      }

      // Filtro por tags
      if (filters.tags.length > 0) {
        const courseTags = course.tags.map((t) => t.toLowerCase());
        const hasMatchingTag = filters.tags.some((tag) =>
          courseTags.includes(tag.toLowerCase())
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [courses, filters]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="space-y-8">
      {/* Filtros */}
      <CourseFilters
        areas={areas}
        instructors={instructors}
        tags={tags}
        levels={levels}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCourses={courses.length}
        filteredCount={filteredCourses.length}
      />

      {/* Lista de cursos */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {filteredCourses.map((course, index) => (
            <div
              key={course.id}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 animate-in fade-in duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-2xl font-semibold mb-3">Nenhum curso encontrado</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Não encontramos cursos com os filtros selecionados. 
            Tente ajustar sua busca ou explorar outras categorias.
          </p>
          <button
            onClick={() => handleFiltersChange({
              search: '',
              areas: [],
              instructors: [],
              tags: [],
              levels: [],
            })}
            className="text-primary hover:underline font-medium"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}
    </div>
  );
}
