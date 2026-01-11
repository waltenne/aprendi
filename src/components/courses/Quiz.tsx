'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Quiz as QuizType, QuizQuestion } from '@/lib/schemas';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Trophy,
  RotateCcw
} from 'lucide-react';

interface QuizProps {
  quiz: QuizType;
  onComplete: (result: QuizResult) => void;
  className?: string;
  isExpired?: boolean;
}

export interface QuizResult {
  score: number;
  passed: boolean;
  totalPoints: number;
  earnedPoints: number;
  answers: Map<string, number | number[] | boolean>;
  correctAnswers: number;
  totalQuestions: number;
}

/**
 * Componente de Quiz interativo
 */
export function Quiz({ quiz, onComplete, className, isExpired = false }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number | boolean>>(new Map());
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = answers.size;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleAnswer = useCallback((answer: number | boolean) => {
    setAnswers((prev) => {
      const next = new Map(prev);
      next.set(currentQuestion.id, answer);
      return next;
    });
    setShowExplanation(true);
  }, [currentQuestion.id]);

  const isCorrect = useCallback((question: QuizQuestion, answer: number | boolean): boolean => {
    if (typeof question.correct_answer === 'boolean') {
      return question.correct_answer === answer;
    }
    return question.correct_answer === answer;
  }, []);

  const goToNext = useCallback(() => {
    setShowExplanation(false);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalQuestions]);

  const goToPrevious = useCallback(() => {
    setShowExplanation(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const calculateResult = useCallback((): QuizResult => {
    let earnedPoints = 0;
    let correctAnswers = 0;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    for (const question of quiz.questions) {
      const userAnswer = answers.get(question.id);
      if (userAnswer !== undefined && isCorrect(question, userAnswer)) {
        earnedPoints += question.points;
        correctAnswers++;
      }
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= quiz.passing_score;

    return {
      score,
      passed,
      totalPoints,
      earnedPoints,
      answers,
      correctAnswers,
      totalQuestions,
    };
  }, [quiz, answers, isCorrect, totalQuestions]);

  const handleFinish = useCallback(() => {
    const quizResult = calculateResult();
    setResult(quizResult);
    setIsFinished(true);
    onComplete(quizResult);
  }, [calculateResult, onComplete]);

  const handleRetry = useCallback(() => {
    setAnswers(new Map());
    setCurrentIndex(0);
    setShowExplanation(false);
    setIsFinished(false);
    setResult(null);
  }, []);

  // Tela de resultado
  if (isFinished && result) {
    return (
      <Card className={cn('max-w-2xl mx-auto', className)}>
        <CardHeader className="text-center">
          <div className={cn(
            'mx-auto mb-4 h-20 w-20 rounded-full flex items-center justify-center',
            result.passed ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
          )}>
            {result.passed ? (
              <Trophy className="h-10 w-10" />
            ) : (
              <AlertCircle className="h-10 w-10" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {result.passed ? 'Parabéns! 🎉' : 'Quase lá!'}
          </CardTitle>
          <CardDescription>
            {result.passed
              ? 'Você foi aprovado no quiz!'
              : `Você precisa de ${quiz.passing_score}% para ser aprovado.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-3xl font-bold">{result.score}%</p>
              <p className="text-sm text-muted-foreground">Pontuação</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-3xl font-bold">
                {result.correctAnswers}/{result.totalQuestions}
              </p>
              <p className="text-sm text-muted-foreground">Acertos</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {!result.passed && (
              <Button onClick={handleRetry} variant="outline" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const userAnswer = answers.get(currentQuestion.id);
  const hasAnswered = userAnswer !== undefined;

  return (
    <Card className={cn('max-w-4xl mx-auto shadow-xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500', className)}>
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs px-2.5 py-1 font-semibold">
            Pergunta {currentIndex + 1} de {totalQuestions}
          </Badge>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            <Trophy className="h-3.5 w-3.5" />
            <span className="text-xs font-bold">{currentQuestion.points} pts</span>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <Progress value={progress} className="h-2 rounded-full transition-all duration-300" />
          <p className="text-xs text-muted-foreground text-center">
            {answeredCount} de {totalQuestions} respondidas • {Math.round(progress)}% completo
          </p>
        </div>
        
        <CardTitle className="text-lg md:text-xl leading-relaxed pt-1">
          {currentQuestion.question}
        </CardTitle>
        
        {currentQuestion.hint && !hasAnswered && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Dica</p>
              <p className="text-xs text-muted-foreground">{currentQuestion.hint}</p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {/* Opções de resposta */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((option, index) => {
            const isSelected = userAnswer === index;
            const isCorrectOption = currentQuestion.correct_answer === index;
            const showResult = showExplanation && hasAnswered;

            return (
              <button
                key={index}
                onClick={() => !hasAnswered && !isExpired && handleAnswer(index)}
                disabled={hasAnswered || isExpired}
                className={cn(
                  'group w-full p-3 md:p-4 rounded-xl border-2 text-left transition-all duration-200',
                  'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  'animate-in fade-in slide-in-from-right-2 duration-300',
                  !hasAnswered && !isExpired && 'hover:border-primary hover:bg-primary/5 cursor-pointer hover:scale-[1.01]',
                  (hasAnswered || isExpired) && 'cursor-default',
                  isSelected && !showResult && 'border-primary bg-primary/10 shadow-sm scale-[1.01]',
                  showResult && isCorrectOption && 'border-green-500 bg-green-500/10 shadow-sm',
                  showResult && isSelected && !isCorrectOption && 'border-red-500 bg-red-500/10 shadow-sm',
                  !isSelected && !showResult && 'border-border'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'flex-shrink-0 h-7 w-7 md:h-8 md:w-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-200',
                    showResult && isCorrectOption && 'border-green-500 bg-green-500 text-white animate-in zoom-in-50 duration-300',
                    showResult && isSelected && !isCorrectOption && 'border-red-500 bg-red-500 text-white animate-in zoom-in-50 duration-300',
                    !showResult && isSelected && 'border-primary bg-primary text-primary-foreground',
                    !isSelected && !showResult && !hasAnswered && 'border-muted-foreground group-hover:border-primary group-hover:bg-primary/10 group-hover:scale-110',
                    !isSelected && !showResult && hasAnswered && 'border-muted-foreground/50'
                  )}>
                    {showResult ? (
                      isCorrectOption ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : isSelected ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <span>{String.fromCharCode(65 + index)}</span>
                      )
                    ) : (
                      <span>{String.fromCharCode(65 + index)}</span>
                    )}
                  </div>
                  <span className="text-sm md:text-base leading-relaxed pt-0.5">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explicação */}
        {showExplanation && currentQuestion.explanation && (
          <div className={cn(
            'p-4 rounded-xl border-2 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300',
            isCorrect(currentQuestion, userAnswer!) 
              ? 'bg-green-500/10 border-green-500/50' 
              : 'bg-red-500/10 border-red-500/50'
          )}>
            <div className="flex items-start gap-2.5">
              <div className={cn(
                'flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center',
                isCorrect(currentQuestion, userAnswer!) 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              )}>
                {isCorrect(currentQuestion, userAnswer!) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <p className={cn(
                  'font-bold mb-1.5 text-sm',
                  isCorrect(currentQuestion, userAnswer!) 
                    ? 'text-green-700 dark:text-green-400' 
                    : 'text-red-700 dark:text-red-400'
                )}>
                  {isCorrect(currentQuestion, userAnswer!) ? 'Correto! Muito bem! 🎉' : 'Ops! Resposta incorreta'}
                </p>
                <p className="text-xs leading-relaxed text-foreground/90">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navegação */}
        <div className="flex items-center justify-between pt-4 border-t-2">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="gap-1 px-4 h-9 transition-all hover:scale-105"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Anterior</span>
          </Button>

          {currentIndex === totalQuestions - 1 ? (
            <Button
              onClick={handleFinish}
              disabled={answeredCount < totalQuestions || isExpired}
              className="gap-2 px-6 h-9 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Trophy className="h-4 w-4" />
              <span className="text-sm">Finalizar Quiz</span>
            </Button>
          ) : (
            <Button
              onClick={goToNext}
              disabled={!hasAnswered || isExpired}
              className="gap-1 px-4 h-9 transition-all hover:scale-105"
            >
              <span className="hidden sm:inline text-sm">Próxima</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
