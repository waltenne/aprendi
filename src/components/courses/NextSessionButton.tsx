import React from 'react';
import { useCourseProgressStore } from '@/hooks/useCourseProgressStore';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface NextSessionButtonProps {
  sessions: Array<{ id: string; title: string }>;
}

export const NextSessionButton: React.FC<NextSessionButtonProps> = ({ sessions }) => {
  const activeSessionId = useCourseProgressStore((s) => s.activeSessionId);
  const sessionsProgress = useCourseProgressStore((s) => s.sessionsProgress);
  const setActiveSession = useCourseProgressStore((s) => s.setActiveSession);

  const currentIdx = sessions.findIndex(s => s.id === activeSessionId);
  const isCompleted = sessionsProgress[activeSessionId]?.status === 'completed';
  // Encontra a próxima sessão com ID diferente (evita loops quando há ids duplicados)
  let nextSession = undefined as { id: string; title: string } | undefined;
  for (let i = currentIdx + 1; i < sessions.length; i++) {
    if (sessions[i].id !== activeSessionId) {
      nextSession = sessions[i];
      break;
    }
  }

  const markSessionCompleted = useCourseProgressStore((s) => s.markSessionCompleted);
  const handleNext = () => {
    try {
      // eslint-disable-next-line no-console
      console.log('[ui] NextSessionButton click', { activeSessionId, nextSessionId: nextSession?.id, isCompleted });
    } catch (e) {}
    if (nextSession) {
      const store = useCourseProgressStore as any;
      const state = store.getState();
      // Força marcar como concluída a sessão atual se não estiver
      if (!isCompleted) state.markSessionCompleted(activeSessionId);
      state.setActiveSession(nextSession.id);
      // debug
      try { // eslint-disable-next-line no-console
        console.log('[ui] forced navigation to', nextSession.id);
      } catch (e) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Button
      variant="default"
      size="lg"
      className="flex items-center gap-2"
      disabled={!nextSession}
      onClick={handleNext}
      aria-disabled={!nextSession}
      aria-label="Avançar para próxima seção"
    >
      Próxima seção <ChevronRight className="w-5 h-5" />
    </Button>
  );
};
