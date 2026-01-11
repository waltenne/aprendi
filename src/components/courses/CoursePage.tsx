import React, { useEffect } from 'react';
import { CourseSidebar } from './CourseSidebar';
import { CourseHeader } from './CourseHeader';
import { CourseSessionContent } from './CourseSessionContent';
import { NextSessionButton } from './NextSessionButton';
import { useCourseProgressStore } from '@/hooks/useCourseProgressStore';

// Exemplo de dados de sessões (substitua pelo seu loader real)
const sections = [
  { id: 'intro', title: 'Introdução' },
  { id: 'aprender', title: 'O que você vai aprender?' },
  { id: 'cap1', title: 'Capítulo 1: O Mundo Antes dos Containers' },
  // ...
];

export const CoursePage: React.FC = () => {
  const activeSessionId = useCourseProgressStore((s) => s.activeSessionId);
  const setActiveSession = useCourseProgressStore((s) => s.setActiveSession);

  // Inicializa sessão ativa na primeira renderização
  useEffect(() => {
    if (!activeSessionId && sections.length > 0) {
      setActiveSession(sections[0].id);
    }
  }, [activeSessionId, setActiveSession]);

  return (
    <div className="flex flex-col min-h-screen">
      <CourseHeader sessions={sessions} />
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-white p-4">
          <CourseSidebar sections={sections} />
        </aside>
        <main className="flex-1 p-8 relative">
          {activeSessionId && (
            <CourseSessionContent sessionId={activeSessionId} minTime={30}>
              {/* Renderize o conteúdo da sessão ativa aqui (exemplo): */}
              <div>
                <h3 className="text-xl font-bold mb-4">{sections.find(s => s.id === activeSessionId)?.title}</h3>
                <p>Conteúdo da sessão {activeSessionId}...</p>
              </div>
            </CourseSessionContent>
          )}
          <NextSessionButton sessions={sections} />
        </main>
      </div>
    </div>
  );
};
