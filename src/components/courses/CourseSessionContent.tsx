"use client";
import React, { useEffect, useRef } from 'react';
import { useCourseProgressStore } from '@/hooks/useCourseProgressStore';

interface SessionContentProps {
  sessionId: string;
  children: React.ReactNode;
  minTime?: number; // em segundos
}

export const CourseSessionContent: React.FC<SessionContentProps> = ({ sessionId, children, minTime = 30 }) => {
  const markSessionCompleted = useCourseProgressStore((s) => s.markSessionCompleted);
  const updateSessionScroll = useCourseProgressStore((s) => s.updateSessionScroll);
  const updateSessionTime = useCourseProgressStore((s) => s.updateSessionTime);
  const sessionsProgress = useCourseProgressStore((s) => s.sessionsProgress);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeSpentRef = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    timeSpentRef.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      timeSpentRef.current += 1;
      updateSessionTime(sessionId, timeSpentRef.current);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionId]);

  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log('[session] mounted sessionId ->', sessionId);
    } catch (e) {}
  }, [sessionId]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const el = ref.current;
      const scrollTop = window.scrollY;
      const contentHeight = el.offsetHeight;
      const windowHeight = window.innerHeight;
      const maxScroll = contentHeight - windowHeight;
      const percent = maxScroll > 0 ? Math.min(100, Math.round((scrollTop / maxScroll) * 100)) : 100;
      updateSessionScroll(sessionId, percent);
      // Marcar como concluído se scroll >= 90% e tempo >= minTime
      if (percent >= 90 && timeSpentRef.current >= minTime && sessionsProgress[sessionId]?.status !== 'completed') {
        markSessionCompleted(sessionId);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sessionId, minTime, sessionsProgress, markSessionCompleted, updateSessionScroll]);

  // Fallback: se tempo e scroll já foram atingidos, marca como concluído (corrige bug de atualização)
  useEffect(() => {
    const scrollPercent = sessionsProgress[sessionId]?.scrollPercent ?? 0;
    const timeSpent = sessionsProgress[sessionId]?.timeSpent ?? 0;
    const completed = sessionsProgress[sessionId]?.status === 'completed';
    if (!completed && scrollPercent >= 90 && timeSpent >= minTime) {
      markSessionCompleted(sessionId);
    }
  }, [sessionsProgress, sessionId, minTime, markSessionCompleted]);

  return (
    <div ref={ref} className="prose-course p-4 bg-card text-foreground rounded-lg">
      {children}
    </div>
  );
};
