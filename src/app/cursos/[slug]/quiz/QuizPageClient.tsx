"use client";
'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quiz, type QuizResult } from '@/components/courses';
import { useUmamiTrack, ANALYTICS_EVENTS } from '@/components/analytics';
import { useProgress } from '@/hooks';
import { useQuizTimer } from '@/hooks/useQuizTimer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CourseWithInstructor } from '@/lib/loaders/courses';
import type { Quiz as QuizType } from '@/lib/schemas';
import { ArrowLeft, Award, BookOpen, RotateCcw, Clock, AlertTriangle } from 'lucide-react';

interface QuizPageClientProps {
  course: CourseWithInstructor;
  quiz: QuizType;
}

export function QuizPageClient({ course, quiz }: QuizPageClientProps) {
  const router = useRouter();
  const track = useUmamiTrack();
  const { progress, saveQuizResult, isLoaded, resetQuiz } = useProgress(course.id);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [autoReloadCountdown, setAutoReloadCountdown] = useState(5);
  
  // Inicializa o timer
  const { 
    timeRemaining, 
    timerState, 
    formattedTime, 
    startTimer, 
    resetTimer,
    finishQuiz
  } = useQuizTimer(quiz.time_limit, () => {
    // Callback quando o tempo expira
    setShowExpiredModal(true);
    setAutoReloadCountdown(5);
  });

  // Countdown automático para recarregar quando tempo expira
  useEffect(() => {
    if (showExpiredModal && autoReloadCountdown > 0) {
      const timer = setTimeout(() => {
        setAutoReloadCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showExpiredModal && autoReloadCountdown === 0) {
      window.location.reload();
    }
  }, [showExpiredModal, autoReloadCountdown]);

  // Rastreia início do quiz e inicia o timer
  useEffect(() => {
    if (isLoaded && progress.contentFinished && !progress.quizCompleted) {
      startTimer();
      track(ANALYTICS_EVENTS.QUIZ_START, {
        course_id: course.id,
        quiz_title: quiz.title,
        questions_count: quiz.questions.length
      });
    }
  }, [isLoaded, progress.contentFinished, progress.quizCompleted, startTimer, track, course.id, quiz.title, quiz.questions.length]);

  const handleQuizComplete = useCallback((result: QuizResult) => {
    const currentAttempts = progress.quizResult?.attempts ?? 0;
    
    // Finaliza o timer
    finishQuiz();
    
    // Rastreia conclusão do quiz
    track(ANALYTICS_EVENTS.QUIZ_COMPLETE, {
      course_id: course.id,
      score: result.score,
      passed: result.passed ? 1 : 0,
      attempts: currentAttempts + 1
    });

    saveQuizResult({
      score: result.score,
      passed: result.passed,
      completedAt: new Date().toISOString(),
      attempts: currentAttempts + 1,
    });
  }, [saveQuizResult, progress.quizResult?.attempts, track, course.id, finishQuiz]);
  
  // Handler para refazer o quiz
  const handleRetry = useCallback(() => {
    setShowExpiredModal(false);
    resetTimer();
    resetQuiz();
    // Pequeno delay para garantir que o localStorage foi atualizado
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, [resetTimer, resetQuiz]);

  // Verifica se o curso foi completado antes de permitir acesso ao quiz
  if (isLoaded && !progress.contentFinished) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link 
          href={`/cursos/${course.id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar ao curso
        </Link>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full flex items-center justify-center bg-warning/20 text-warning">
              <BookOpen className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl">Curso não concluído</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Você precisa completar todas as seções do curso antes de fazer o quiz.
            </p>
            <Button asChild className="w-full">
              <Link href={`/cursos/${course.id}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Continuar o curso
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se já completou o quiz com sucesso, mostra resultado
  if (isLoaded && progress.quizCompleted && progress.quizResult) {
    const { quizResult } = progress;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Link 
            href={`/cursos/${course.id}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar ao curso
          </Link>

          <Card className="shadow-2xl border-2">
            <CardHeader className="text-center pb-6">
              <div className={cn(
                'mx-auto mb-6 h-24 w-24 rounded-full flex items-center justify-center shadow-lg',
                quizResult.passed ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-amber-400 to-amber-600'
              )}>
                <Award className="h-14 w-14 text-white" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold mb-2">
                {quizResult.passed ? 'Parabéns! 🎉' : 'Quiz Realizado'}
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                {quizResult.passed 
                  ? 'Você foi aprovado no quiz!' 
                  : `Você precisa de ${quiz.passing_score}% para ser aprovado.`}
              </p>
            </CardHeader>
            <CardContent className="space-y-6 px-6 md:px-8 pb-8">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className={cn(
                  "p-6 rounded-xl shadow-md border-2",
                  quizResult.passed ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800" : "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800"
                )}>
                  <p className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                    {quizResult.score}%
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">Pontuação Final</p>
                </div>
                <div className="p-6 rounded-xl bg-muted/50 shadow-md border-2">
                  <p className="text-4xl md:text-5xl font-bold mb-2 text-primary">
                    {quizResult.attempts || 1}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {quizResult.attempts === 1 ? 'Tentativa' : 'Tentativas'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {quizResult.passed && (
                  <Button asChild className="w-full h-12 text-base shadow-lg hover:shadow-xl transition-all" size="lg">
                    <Link href={`/cursos/${course.id}/certificado`}>
                      <Award className="h-5 w-5 mr-2" />
                      Gerar Certificado
                    </Link>
                  </Button>
                )}
                
                <Button variant="outline" asChild className="w-full h-12 text-base" size="lg">
                  <Link href={`/cursos/${course.id}`}>
                    <BookOpen className="h-5 w-5 mr-2" />
                    Revisar Conteúdo
                  </Link>
                </Button>

                <Button 
                  variant={quizResult.passed ? "outline" : "default"}
                  size="lg"
                  className="w-full h-12 text-base transition-all hover:scale-105"
                  onClick={() => {
                    resetQuiz();
                    setTimeout(() => window.location.reload(), 100);
                  }}
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  {quizResult.passed ? 'Refazer Quiz' : 'Tentar Novamente'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      <div className="container mx-auto px-4 py-3 md:py-4 max-w-5xl flex-1 flex flex-col overflow-hidden">
        <Link 
          href={`/cursos/${course.id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-3 transition-colors animate-in fade-in slide-in-from-left-4 duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar ao curso
        </Link>

        {/* Header do Quiz - Compacto */}
        <div className="bg-card border rounded-xl shadow-lg p-4 md:p-5 mb-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quiz Interativo
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {quiz.title}
            </h1>
            
            {/* Stats do Quiz - Inline */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-xs">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{quiz.questions.length}</span>
                <span className="text-muted-foreground">perguntas</span>
              </div>
              
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-xs">
                <Award className="h-4 w-4 text-amber-500" />
                <span className="font-semibold">{quiz.passing_score}%</span>
                <span className="text-muted-foreground">mínimo</span>
              </div>
              
              {/* Timer Destacado */}
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-base font-bold transition-all duration-300",
                timerState === 'expired' && 'bg-destructive/20 text-destructive animate-pulse',
                timeRemaining < 60 && timerState !== 'expired' && 'bg-destructive/20 text-destructive animate-pulse',
                timeRemaining >= 60 && timeRemaining < 300 && 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
                timeRemaining >= 300 && 'bg-primary/20 text-primary'
              )}>
                <Clock className="h-4 w-4" />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-4">
          <Quiz 
            quiz={quiz} 
            onComplete={handleQuizComplete}
            isExpired={timerState === 'expired'}
          />
        </div>
      
      {/* Modal de tempo expirado */}
      <Dialog open={showExpiredModal} onOpenChange={() => {}}>
        <DialogContent 
          className="sm:max-w-md animate-in zoom-in-95 duration-300"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <div className="mx-auto mb-4 h-20 w-20 rounded-full flex items-center justify-center bg-destructive/20 text-destructive animate-in zoom-in-50 duration-500 relative">
              <AlertTriangle className="h-10 w-10 animate-bounce" />
              {/* Círculo de contagem regressiva */}
              <svg className="absolute -inset-1 w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-destructive/30"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${(autoReloadCountdown / 5) * 283} 283`}
                  className="text-destructive transition-all duration-1000 ease-linear"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <DialogTitle className="text-center text-2xl font-bold animate-in fade-in slide-in-from-top-2 duration-500">
              Tempo Esgotado!
            </DialogTitle>
            <DialogDescription className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
              <p>O tempo para completar o quiz expirou.</p>
              <p className="text-sm text-muted-foreground">Suas respostas não foram salvas.</p>
              <div className="pt-2">
                <p className="text-lg font-semibold text-foreground">
                  Recarregando em <span className="text-2xl text-destructive font-mono">{autoReloadCountdown}</span>s
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={handleRetry} 
              className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Refazer Agora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
