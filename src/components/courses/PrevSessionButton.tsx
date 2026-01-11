import React from 'react';
import { useCourseProgressStore } from '@/hooks/useCourseProgressStore';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface PrevSessionButtonProps {
  sessions: Array<{ id: string; title: string }>;
}

export const PrevSessionButton: React.FC<PrevSessionButtonProps> = ({ sessions }) => {
  const activeSessionId = useCourseProgressStore((s) => s.activeSessionId);
  const setActiveSession = useCourseProgressStore((s) => s.setActiveSession);

  const currentIdx = sessions.findIndex(s => s.id === activeSessionId);
  // Encontra a sessão anterior com ID diferente (evita loops quando há ids duplicados)
  let prevSession = undefined as { id: string; title: string } | undefined;
  for (let i = currentIdx - 1; i >= 0; i--) {
    if (sessions[i].id !== activeSessionId) {
      prevSession = sessions[i];
      break;
    }
  }

  const handlePrev = () => {
      try {
      // eslint-disable-next-line no-console
      console.log('[ui] PrevSessionButton click', { activeSessionId, prevSessionId: prevSession?.id });
    } catch (e) {}
    if (prevSession) {
      const store = useCourseProgressStore as any;
      const state = store.getState();
      state.setActiveSession(prevSession.id);
      try { // eslint-disable-next-line no-console
        console.log('[ui] forced navigation prev to', prevSession.id);
      } catch (e) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      className="flex items-center gap-2"
      disabled={!prevSession}
      onClick={handlePrev}
      aria-disabled={!prevSession}
      aria-label="Voltar para sessão anterior"
    >
      <ChevronRight className="w-5 h-5 rotate-180" /> Sessão anterior
    </Button>
  );
};
