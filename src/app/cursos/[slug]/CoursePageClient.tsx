'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { 
  CourseSidebar, 
  CourseProgressBar,
  CourseHeader,
  CourseSessionContent,
  NextSessionButton,
  PrevSessionButton
} from '@/components/courses';
import { Giscus } from '@/components/comments';
import { useUmamiTrack, ANALYTICS_EVENTS } from '@/components/analytics';
import { useCourseProgressStore } from '@/hooks/useCourseProgressStore';
import { useToast } from '@/hooks/use-toast';
import { useProgress } from '@/hooks/useProgress';
import { useRouter } from 'next/navigation';
import type { CourseWithInstructor } from '@/lib/loaders/courses';
import { 
  ArrowLeft, 
  Clock, 
  BookOpen,
  Award,
  PlayCircle,
  ChevronRight,
  User,
  Heart,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CourseContent } from '@/components/courses/CourseContent';
import { useState } from 'react';

interface CoursePageClientProps {
  course: CourseWithInstructor;
  quizAvailable: boolean;
}

export function CoursePageClient({ course, quizAvailable }: CoursePageClientProps) {
  // NOVO FLUXO: Zustand para navegação e progresso
  const sections = course.sections ?? [];
  const totalSections = sections.length;
  const activeSessionId = useCourseProgressStore((s) => s.activeSessionId);
  const setActiveSession = useCourseProgressStore((s) => s.setActiveSession);
  const sessionsProgress = useCourseProgressStore((s) => s.sessionsProgress);
  const courseProgress = useCourseProgressStore((s) => s.courseProgress);
  const setTotalSections = useCourseProgressStore((s) => s.setTotalSections);
  const ensureSessions = useCourseProgressStore((s) => s.ensureSessions);
  const setOnCourseComplete = useCourseProgressStore((s) => s.setOnCourseComplete);
  const setCourseCompleted = useCourseProgressStore((s) => s.setCourseCompleted);
  const markSessionCompleted = useCourseProgressStore((s) => s.markSessionCompleted);

  // Inicializa sessão ativa na primeira renderização
  useEffect(() => {
    if (sections.length > 0) {
      // inform store sobre total de sessões e garanta entradas de progresso
      const uniqueCount = new Set(sections.map(s => s.id)).size;
      setTotalSections(uniqueCount);
      ensureSessions(sections.map(s => s.id));
      if (!activeSessionId) {
        // se não há sessão ativa, abre a primeira
        setActiveSession(sections[0].id);
      }
    }
  }, [activeSessionId, setActiveSession, sections, setTotalSections, ensureSessions]);

  // registrar callback de conclusão do curso para desbloquear quiz/certificado
  useEffect(() => {
    setOnCourseComplete(() => {
      try { setCourseCompleted(true); } catch (e) {}
    });
    return () => setOnCourseComplete(null);
  }, [setOnCourseComplete, setCourseCompleted]);

  const currentSectionIndex = sections.findIndex(s => s.id === activeSessionId);
  const isLastSection = currentSectionIndex === sections.length - 1;
  const currentSection = sections.find(s => s.id === activeSessionId);
  const courseCompletedFlag = useCourseProgressStore((s) => s.courseCompleted);
  const isCurrentCompleted = Boolean(activeSessionId && sessionsProgress?.[activeSessionId]?.status === 'completed');
  const router = useRouter();
  const { toast } = useToast();
  const { saveProgress } = useProgress(course.id);
  const [hydrated, setHydrated] = useState(false);

  // marca que já estamos no client para evitar mismatches de hidratação
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Verifica se todas as sessões anteriores à última estão liberadas (não 'not_started')
  const allPreviousUnlocked = sections.length > 0
    ? sections.slice(0, -1).every((s) => (sessionsProgress?.[s.id]?.status ?? 'not_started') !== 'not_started')
    : false;
  const enableFinalize = allPreviousUnlocked;

  // Debug: log sections and active session changes
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log('[page] sections ids ->', sections.map(s => s.id));
      // eslint-disable-next-line no-console
      console.log('[page] activeSessionId ->', activeSessionId, 'currentIndex ->', currentSectionIndex);
      // eslint-disable-next-line no-console
      console.log('[page] currentSection ->', currentSection?.id ?? null);
    } catch (e) {}
  }, [sections, activeSessionId, currentSectionIndex, currentSection]);

  return (
    <div key={hydrated ? 'client' : 'server'} suppressHydrationWarning className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Link 
        href="/cursos" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar aos cursos
      </Link>

      {/* Header do curso */}
      {/* Header pode mostrar todas as sessões, se desejado */}
      <CourseHeader sessions={sections.map(s => ({ id: s.id, title: s.title }))} />

      {/* Ações pós-curso: quiz / certificado (visíveis quando curso finalizado) */}
      {hydrated && courseCompletedFlag && (
        <div className="flex items-center gap-4">
          {quizAvailable && (
            <Button asChild variant="default">
              <Link href={`/cursos/${course.id}/quiz`}>Iniciar Quiz</Link>
            </Button>
          )}
          {/* certificado pode depender de outras regras; mostramos link se disponível */}
          <Button asChild variant={quizAvailable ? 'secondary' : 'outline'}>
            <Link href={`/cursos/${course.id}/certificado`}>Ver Certificado</Link>
          </Button>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="flex gap-6">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 p-4 rounded-xl bg-card border border-border">
            {/* Sidebar lista todas as sessões; somente a atual/ desbloqueadas são clicáveis */}
            <CourseSidebar
              sections={sections}
              currentSectionId={activeSessionId}
              sessionsProgress={sessionsProgress}
              onSectionClick={setActiveSession}
            />
          </div>
        </aside>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          {/* Renderiza SOMENTE a sessão ativa */}
          {activeSessionId && (
            <CourseSessionContent sessionId={activeSessionId} minTime={30}>
              <div>
                <h3 className="text-xl font-bold mb-4">{currentSection?.title}</h3>
                {currentSection?.content ? (
                  <CourseContent content={currentSection.content} />
                ) : (
                  <p>Conteúdo não disponível.</p>
                )}
              </div>
            </CourseSessionContent>
          )}
          {/* Botões de navegação entre sessões */}
          <div className="flex flex-row gap-4 justify-center mt-8">
            <PrevSessionButton sessions={sections} />
            {/* se for última seção, mostrar finalizar curso */}
            {isLastSection ? (
              <Dialog>
                <DialogTrigger asChild>
                      <Button
                        disabled={!enableFinalize}
                        title={!enableFinalize ? 'Aguarde até concluir as demais sessões antes de finalizar' : undefined}
                        className="ml-2"
                      >Finalizar curso</Button>
                    </DialogTrigger>
                <DialogContent>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                        <Award className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <DialogTitle className="text-lg">Finalizar curso</DialogTitle>
                      <DialogDescription className="mt-1 text-sm text-muted-foreground">
                        Tem certeza que deseja finalizar este curso agora? Ao confirmar, a última sessão será marcada como concluída e o quiz e o certificado serão desbloqueados.
                      </DialogDescription>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border pt-4">
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          className="inline-flex items-center gap-2"
                          onClick={() => {
                                try {
                                  // marcar todas as sessões como concluídas para garantir 100%
                                  sections.forEach(s => {
                                    try { markSessionCompleted(s.id); } catch (e) {}
                                  });
                                  setCourseCompleted(true);
                                  try {
                                    toast({ title: 'Curso finalizado', description: 'Quiz e certificado desbloqueados.' });
                                  } catch (e) {}
                                  try {
                                    // também persistir no storage por perfil para o fluxo do quiz
                                    try {
                                      try {
                                        // debug: log before saving
                                        // eslint-disable-next-line no-console
                                        console.log('[course] Finalizar -> saving progress for quiz', {
                                          courseId: course.id,
                                          sectionsCount: sections.length,
                                          sectionsRead: sections.map(s => s.id),
                                        });
                                      } catch (e) {}

                                      saveProgress({
                                        sectionsRead: sections.map(s => s.id),
                                        progress: 100,
                                        contentFinished: true,
                                        contentFinishedAt: new Date().toISOString(),
                                        currentSection: sections[sections.length - 1]?.id ?? activeSessionId,
                                      });
                                      try {
                                        // debug: confirm saved (read from storage key)
                                        const key = `pcursos:progress:${localStorage.getItem('pcursos:activeProfileId') || 'default'}:${course.id}`;
                                        // eslint-disable-next-line no-console
                                        console.log('[course] after save, storage ->', key, JSON.parse(localStorage.getItem(key) || 'null'));
                                      } catch (e) {}
                                    } catch (e) {}
                                    if (quizAvailable) {
                                      router.push(`/cursos/${course.id}/quiz`);
                                    } else {
                                      router.push(`/cursos/${course.id}/certificado`);
                                    }
                                  } catch (e) {}
                                } catch (e) {}
                              }}
                        >
                          <Award className="h-4 w-4 opacity-90" />
                          Confirmar
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button variant="outline" className="ml-2">Cancelar</Button>
                      </DialogClose>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <NextSessionButton sessions={sections} />
            )}
          </div>
          {/* Seção de comentários - sem card branco */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">💬 Comentários e Discussões</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Tem dúvidas ou quer compartilhar algo sobre este curso? 
              Use o espaço abaixo para comentar. Faça login com sua conta do GitHub.
            </p>
            <Giscus 
              term={`Curso: ${course.title}`}
              mapping="specific"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
