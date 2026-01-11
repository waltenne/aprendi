 'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { CourseSection } from '@/lib/schemas';
import { CheckCircle, Circle, ChevronRight, Lock } from 'lucide-react';

interface CourseSidebarProps {
  sections: CourseSection[];
  currentSectionId?: string;
  sessionsProgress: Record<string, { status: string }>; // minimal shape
  onSectionClick: (sectionId: string) => void;
  className?: string;
}

/**
 * Sidebar de navegação do curso com lista de seções
 */
export function CourseSidebar({
  sections,
  currentSectionId,
  sessionsProgress,
  onSectionClick,
  className,
}: CourseSidebarProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  return (
    <nav className={cn('space-y-1', className)}>
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
        Conteúdo do Curso
      </h3>
      
      <ul className="space-y-1">
        {sections.map((section, index) => {
          const status = sessionsProgress?.[section.id]?.status ?? 'not_started';
          const isRead = status === 'completed';
          const isCurrent = section.id === currentSectionId;
          const isLocked = status === 'not_started' && !isCurrent;
          // Garante chave única mesmo se houver ids duplicados
          const key = section.id + '-' + index;
          return (
            <li key={key}>
              <button
                onClick={() => {
                  try { // eslint-disable-next-line no-console
                    console.log('[ui] CourseSidebar click', { clickedId: section.id });
                  } catch (e) {}
                    if (hydrated) {
                      if (!isLocked) onSectionClick(section.id);
                    } else {
                      // during SSR/hydration avoid interactive changes
                      if (!isLocked) onSectionClick(section.id);
                    }
                }}
                  disabled={hydrated ? isLocked : undefined}
                className={cn(
                  'w-full flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors text-left group',
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : isRead
                    ? 'text-success hover:bg-muted'
                    : isLocked
                    ? 'text-muted-foreground opacity-60 cursor-not-allowed'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <span className="flex-shrink-0 mt-0.5">
                  {hydrated ? (
                    isRead ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isLocked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )
                  ) : (
                    <span className="inline-block h-4 w-4" />
                  )}
                </span>
                <span className="flex-1 leading-relaxed break-words">
                  <span className="font-medium">{index + 1}.</span> {section.title}
                </span>
                {isCurrent && (
                  hydrated ? (
                    <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5 transition-transform group-hover:translate-x-1" />
                  ) : (
                    <span className="inline-block h-4 w-4 flex-shrink-0 mt-0.5" />
                  )
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
