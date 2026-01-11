import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Estados possíveis do timer do quiz
 */
export type QuizTimerState = 'not_started' | 'in_progress' | 'finished' | 'expired';

interface UseQuizTimerReturn {
  timeRemaining: number;
  timerState: QuizTimerState;
  formattedTime: string;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  finishQuiz: () => void;
}

/**
 * Hook personalizado para gerenciar o timer do quiz
 * 
 * @param timeLimit - Tempo limite em segundos (do YAML)
 * @param onExpire - Callback chamado quando o tempo expira
 * @returns Objeto com estado e funções de controle do timer
 */
export function useQuizTimer(
  timeLimit: number,
  onExpire?: () => void
): UseQuizTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [timerState, setTimerState] = useState<QuizTimerState>('not_started');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onExpireRef = useRef(onExpire);

  // Mantém a referência do callback atualizada
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  /**
   * Formata o tempo em mm:ss
   */
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  /**
   * Inicia o timer
   */
  const startTimer = useCallback(() => {
    if (timerState === 'not_started' || timerState === 'finished') {
      setTimerState('in_progress');
    }
  }, [timerState]);

  /**
   * Pausa o timer (pode ser usado para pausas manuais se necessário)
   */
  const pauseTimer = useCallback(() => {
    if (timerState === 'in_progress') {
      setTimerState('not_started');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [timerState]);

  /**
   * Reseta o timer para o estado inicial
   */
  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeRemaining(timeLimit);
    setTimerState('not_started');
  }, [timeLimit]);

  /**
   * Finaliza o quiz (usuário completou antes do tempo)
   */
  const finishQuiz = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimerState('finished');
  }, []);

  /**
   * Gerencia o countdown do timer
   */
  useEffect(() => {
    if (timerState === 'in_progress') {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Tempo expirou
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setTimerState('expired');
            
            // Chama o callback de expiração
            if (onExpireRef.current) {
              onExpireRef.current();
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [timerState]);

  /**
   * Limpa o interval quando o componente desmonta
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeRemaining,
    timerState,
    formattedTime: formatTime(timeRemaining),
    startTimer,
    pauseTimer,
    resetTimer,
    finishQuiz,
  };
}
