"use client";

import { InstructorCard } from '@/components/courses';
import { Suspense } from 'react';

interface InstrutoresPageClientProps {
  instructors: any[];
  courseCounts: { id: string; courseCount: number }[];
}

export function InstrutoresPageClient({ instructors, courseCounts }: InstrutoresPageClientProps) {
  const totalCursos = courseCounts.reduce((acc, c) => acc + c.courseCount, 0);
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center">Carregando instrutores...</div>}>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-500">
              Comunidade
            </span>
          </div>
          <h1 className="text-3xl font-bold">Nossos Instrutores</h1>
          <p className="text-muted-foreground max-w-2xl">
            Conheça os especialistas que compartilham seu conhecimento na Aprendi.
          </p>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="text-2xl font-bold text-primary">{instructors.length}</div>
            <div className="text-sm text-muted-foreground">Instrutores</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="text-2xl font-bold text-emerald-500">{totalCursos}</div>
            <div className="text-sm text-muted-foreground">Cursos Criados</div>
          </div>
        </div>
        {/* Lista de instrutores */}
        {instructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instructors.map((instructor) => {
              const count = courseCounts.find((c) => c.id === instructor.id)?.courseCount || 0;
              return (
                <InstructorCard
                  key={instructor.id}
                  instructor={instructor}
                  courseCount={count}
                />
              );
            })}
          </div>
        ) : (
          <div className="p-12 rounded-xl bg-card border border-border text-center">
            <span className="h-12 w-12 text-muted-foreground mx-auto mb-4">?</span>
            <div className="text-lg font-medium">Nenhum instrutor encontrado.</div>
          </div>
        )}
      </div>
    </Suspense>
  );
}
