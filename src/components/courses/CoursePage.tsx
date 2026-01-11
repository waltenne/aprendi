import React, { useEffect } from 'react';
import { CourseSidebar } from './CourseSidebar';
import { CourseHeader } from './CourseHeader';
import { CourseSessionContent } from './CourseSessionContent';
import { NextSessionButton } from './NextSessionButton';
import { useCourseProgressStore } from '@/hooks/useCourseProgressStore';

// Exemplo de dados de sessões (substitua pelo seu loader real)
const sections = [
  { id: 'intro', title: 'Introdução', level: 1, content: 'Introdução ao curso' },
  { id: 'aprender', title: 'O que você vai aprender?', level: 2, content: 'Objetivos e tópicos' },
  { id: 'cap1', title: 'Capítulo 1: O Mundo Antes dos Containers', level: 2, content: 'Contexto histórico' },
  // ...
];

export const CoursePage: React.FC = () => {
  const activeSessionId = useCourseProgressStore((s) => s.activeSessionId);
  const setActiveSession = useCourseProgressStore((s) => s.setActiveSession);
  const sessionsProgress = useCourseProgressStore((s) => s.sessionsProgress);
  const ensureSessions = useCourseProgressStore((s) => s.ensureSessions);
  const setTotalSections = useCourseProgressStore((s) => s.setTotalSections);

  // Inicializa sessão ativa na primeira renderização
  useEffect(() => {
    if (!activeSessionId && sections.length > 0) {
      setActiveSession(sections[0].id);
    }
    // garante que o estado de progresso conheça todas as sessões
    ensureSessions(sections.map(s => s.id));
    setTotalSections(sections.length);
  }, [activeSessionId, setActiveSession, ensureSessions, setTotalSections]);

  return (
    <div className="flex flex-col min-h-screen">
      <CourseHeader sessions={sections} />
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-white p-4">
          <CourseSidebar
            sections={sections}
            currentSectionId={activeSessionId}
            sessionsProgress={sessionsProgress}
            onSectionClick={(id) => setActiveSession(id)}
          />
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
