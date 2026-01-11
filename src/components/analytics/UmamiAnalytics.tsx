'use client';

import Script from 'next/script';

/**
 * Componente para integração com Umami Analytics
 * 
 * Para configurar:
 * 1. Crie uma conta em https://cloud.umami.is
 * 2. Adicione seu site e obtenha o Website ID
 * 3. Defina a variável NEXT_PUBLIC_UMAMI_WEBSITE_ID no .env.local
 * 
 * @see https://umami.is/docs
 */
export function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  // Não renderiza em desenvolvimento ou se não houver ID
  if (!websiteId || process.env.NODE_ENV === 'development') {
    return null;
  }

  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}

/**
 * Hook para tracking de eventos customizados
 * 
 * @example
 * const track = useUmamiTrack();
 * track('course_started', { courseId: 'git-basico' });
 */
export function useUmamiTrack() {
  return (eventName: string, eventData?: Record<string, string | number>) => {
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track(eventName, eventData);
    }
  };
}

/**
 * Eventos pré-definidos para o Aprendi
 */
export const ANALYTICS_EVENTS = {
  // Cursos
  COURSE_VIEW: 'course_view',
  COURSE_START: 'course_start',
  COURSE_COMPLETE: 'course_complete',
  SECTION_READ: 'section_read',
  
  // Quiz
  QUIZ_START: 'quiz_start',
  QUIZ_COMPLETE: 'quiz_complete',
  QUIZ_PASS: 'quiz_pass',
  QUIZ_FAIL: 'quiz_fail',
  
  // Certificado
  CERTIFICATE_VIEW: 'certificate_view',
  CERTIFICATE_DOWNLOAD: 'certificate_download',
  CERTIFICATE_SHARE: 'certificate_share',
  
  // Newsletter
  NEWSLETTER_SUBSCRIBE: 'newsletter_subscribe',
  
  // Navegação
  SEARCH: 'search',
  FILTER: 'filter',
} as const;

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];
