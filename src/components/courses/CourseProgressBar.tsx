'use client';

import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, PlayCircle } from 'lucide-react';

interface CourseProgressBarProps {
  progress: number;
  sectionsTotal: number;
  sectionsRead: number;
  isCompleted: boolean;
  className?: string;
}

/**
 * Barra de progresso do curso com indicador visual
 */
export function CourseProgressBar({
  progress,
  sectionsTotal,
  sectionsRead,
  isCompleted,
  className,
}: CourseProgressBarProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {isCompleted ? (
            <span className="flex items-center gap-1 text-success font-medium">
              <CheckCircle className="h-4 w-4" />
              Conteúdo concluído
            </span>
          ) : sectionsRead > 0 ? (
            <span className="flex items-center gap-1">
              <PlayCircle className="h-4 w-4 text-primary" />
              Em andamento
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Circle className="h-4 w-4" />
              Não iniciado
            </span>
          )}
        </span>
        <span className="font-medium">
          {sectionsRead}/{sectionsTotal} seções
        </span>
      </div>
      <Progress
        value={progress}
        className="h-2"
        indicatorClassName={cn(
          isCompleted ? 'bg-success' : 'bg-primary'
        )}
      />
      <p className="text-xs text-muted-foreground text-right">
        {progress}% completo
      </p>
    </div>
  );
}
