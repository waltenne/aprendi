"use client";
import { CoursesPageClient } from '@/components/courses';
import { FirstAccessModal } from '@/components/profile/FirstAccessModal';
import { Suspense } from 'react';

interface CursosPageClientProps {
  courses: any;
  areas: any;
  tags: any;
  levels: any;
  instructors: any;
}

export function CursosPageClient({ courses, areas, tags, levels, instructors }: CursosPageClientProps) {
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center">Carregando cursos...</div>}>
    <div className="container mx-auto px-4 py-6 md:py-8">
      <FirstAccessModal />
      <CoursesPageClient
        courses={courses}
        areas={areas}
        tags={tags}
        levels={levels}
        instructors={instructors}
      />
    </div>
    </Suspense>
  );
}
