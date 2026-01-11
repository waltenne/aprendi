'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  type CourseProgress, 
  type SavedQuizResult,
  createEmptyProgress, 
  parseProgressSafe 
} from '@/lib/schemas';

/**
 * Prefixo para chaves do localStorage
 */
const STORAGE_PREFIX = 'pcursos:progress:';
const STORAGE_KEY_ACTIVE_PROFILE = 'pcursos:activeProfileId';

/**
 * Hook para gerenciar progresso do usuário em um curso
 * Persiste dados no localStorage vinculado ao perfil ativo
 */
export function useProgress(courseId: string) {
  const [progress, setProgress] = useState<CourseProgress>(() => 
    createEmptyProgress(courseId)
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Carrega profileId ativo
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE);
    try {
      // debug
      // eslint-disable-next-line no-console
      console.log('[useProgress] loaded activeProfileId ->', activeId);
    } catch (e) {}
    setProfileId(activeId);
  }, []);

  // Carrega progresso do localStorage na montagem
  useEffect(() => {
    if (typeof window === 'undefined' || !profileId) return;

    try {
      const key = `${STORAGE_PREFIX}${profileId}:${courseId}`;
      const stored = localStorage.getItem(key);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        setProgress(parseProgressSafe(parsed, courseId));
      } else {
        setProgress(createEmptyProgress(courseId));
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [courseId, profileId]);

  // Salva progresso no localStorage
  const saveProgress = useCallback((updates: Partial<CourseProgress>) => {
    // allow fallback if profileId wasn't set (use 'default')
    const pid = profileId ?? (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE) : null) ?? 'default';
    try { if (typeof window !== 'undefined' && !profileId) localStorage.setItem(STORAGE_KEY_ACTIVE_PROFILE, pid); } catch (e) {}

    setProfileId(pid);

    setProgress((prev) => {
      const updated: CourseProgress = {
        ...prev,
        ...updates,
        lastAccessedAt: new Date().toISOString(),
      };

      try {
        const key = `${STORAGE_PREFIX}${pid}:${courseId}`;
        // debug: log what we save
        // eslint-disable-next-line no-console
        console.log('[useProgress] saving progress to', key, updated);
        localStorage.setItem(key, JSON.stringify(updated));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erro ao salvar progresso:', error);
      }

      return updated;
    });
  }, [courseId, profileId]);

  // Inicia o curso
  const startCourse = useCallback(() => {
    if (progress.started) return;
    
    saveProgress({
      started: true,
      startedAt: new Date().toISOString(),
    });
  }, [progress.started, saveProgress]);

  // Marca uma seção como lida
  const markSectionRead = useCallback((sectionId: string, totalSections: number) => {
    const sectionsRead = progress.sectionsRead.includes(sectionId)
      ? progress.sectionsRead
      : [...progress.sectionsRead, sectionId];

    const progressPercent = Math.round((sectionsRead.length / totalSections) * 100);
    const contentFinished = sectionsRead.length >= totalSections;

    saveProgress({
      sectionsRead,
      currentSection: sectionId,
      progress: progressPercent,
      contentFinished,
      contentFinishedAt: contentFinished && !progress.contentFinished 
        ? new Date().toISOString() 
        : progress.contentFinishedAt,
    });
  }, [progress.sectionsRead, progress.contentFinished, progress.contentFinishedAt, saveProgress]);

  // Salva resultado do quiz
  const saveQuizResult = useCallback((result: SavedQuizResult) => {
    const currentAttempts = progress.quizResult?.attempts ?? 0;
    
    saveProgress({
      quizCompleted: true,
      quizResult: {
        ...result,
        attempts: currentAttempts + 1,
      },
    });
  }, [progress.quizResult?.attempts, saveProgress]);

  // Marca certificado como gerado
  const generateCertificate = useCallback((userName: string) => {
    saveProgress({
      certificateGenerated: true,
      certificateGeneratedAt: new Date().toISOString(),
      userName,
      completed: true,
      completedAt: new Date().toISOString(),
    });
  }, [saveProgress]);

  // Reseta o progresso do curso
  const resetProgress = useCallback(() => {
    if (!profileId) return;
    
    try {
      const key = `${STORAGE_PREFIX}${profileId}:${courseId}`;
      localStorage.removeItem(key);
      setProgress(createEmptyProgress(courseId));
    } catch (error) {
      console.error('Erro ao resetar progresso:', error);
    }
  }, [courseId, profileId]);

  // Reseta apenas o quiz (mantém progresso do conteúdo)
  const resetQuiz = useCallback(() => {
    saveProgress({
      quizCompleted: false,
      quizResult: undefined,
    });
  }, [saveProgress]);

  return {
    progress,
    isLoaded,
    saveProgress,
    startCourse,
    markSectionRead,
    saveQuizResult,
    generateCertificate,
    resetProgress,
    resetQuiz,
  };
}

/**
 * Retorna todo o progresso de todos os cursos do perfil ativo
 */
export function getAllProgress(): Record<string, CourseProgress> {
  if (typeof window === 'undefined') return {};

  const activeProfileId = localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE);
  if (!activeProfileId) return {};

  const allProgress: Record<string, CourseProgress> = {};
  const prefix = `${STORAGE_PREFIX}${activeProfileId}:`;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        const courseId = key.replace(prefix, '');
        const stored = localStorage.getItem(key);
        if (stored) {
          allProgress[courseId] = parseProgressSafe(JSON.parse(stored), courseId);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao carregar todos os progressos:', error);
  }

  return allProgress;
}

/**
 * Hook para carregar progresso de múltiplos cursos
 */
export function useAllProgress() {
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setProgressMap(getAllProgress());
    setIsLoaded(true);
  }, []);

  return { progressMap, isLoaded };
}
