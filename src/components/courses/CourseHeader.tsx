"use client";

import React, { useEffect, useState } from 'react';
import { useCourseProgressStore } from '@/hooks/useCourseProgressStore';

interface CourseHeaderProps {
  sessions: Array<{ id: string; title: string }>;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ sessions }) => {
  const activeSessionId = useCourseProgressStore((s) => s.activeSessionId);
  const courseProgress = useCourseProgressStore((s) => s.courseProgress);
  const currentSession = sessions.find(s => s.id === activeSessionId);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const safeProgress = Math.max(0, Math.min(100, courseProgress || 0));

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border rounded-md">
      <div>
        <h2 className="text-lg font-bold text-foreground">{!hydrated ? 'Selecione uma sessão' : (currentSession?.title || 'Selecione uma sessão')}</h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">Progresso: {!hydrated ? '—' : `${safeProgress}%`}</span>
        <div className="w-32 h-2 bg-muted rounded">
          <div
            className="h-2 bg-primary rounded"
            style={{ width: `${!hydrated ? 0 : safeProgress}%` }}
          />
        </div>
      </div>
    </header>
  );
};
