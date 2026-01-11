'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, Award, ArrowRight } from 'lucide-react';
import type { CourseWithInstructor } from '@/lib/loaders/courses';
import type { CourseProgress } from '@/lib/schemas';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: CourseWithInstructor;
  progress?: CourseProgress;
  className?: string;
}

/**
 * Card de exibição de curso
 * Mostra informações básicas, tags e progresso do usuário
 */
export function CourseCard({ course, progress, className }: CourseCardProps) {
  const progressValue = progress?.progress ?? 0;
  const isCompleted = progress?.completed ?? false;
  const isStarted = progress?.started ?? false;

  return (
    <Link href={`/cursos/${course.id}`}>
      <Card
        className={cn(
          'group h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer',
          isCompleted && 'border-success/50 bg-success/5',
          className
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            {course.cover ? (
              <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={course.cover}
                  alt={course.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl flex-shrink-0"
                style={{ backgroundColor: `${course.color}20` }}
              >
                {course.icon}
              </div>
            )}
            <Badge variant={isCompleted ? 'success' : 'secondary'}>
              {course.level}
            </Badge>
          </div>
          
          <CardTitle className="mt-3 text-lg group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </CardTitle>
          
          <CardDescription className="line-clamp-2">
            {course.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Metadados */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.area}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {course.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {course.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{course.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Progresso */}
          {isStarted && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-success">
                      <Award className="h-4 w-4" />
                      Concluído
                    </span>
                  ) : (
                    `${progressValue}%`
                  )}
                </span>
              </div>
              <Progress
                value={progressValue}
                className="h-2"
                indicatorClassName={isCompleted ? 'bg-success' : undefined}
              />
            </div>
          )}

          {/* Instrutor */}
          {course.instructorData && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                {course.instructorData.name.charAt(0)}
              </div>
              <span className="text-sm text-muted-foreground truncate">
                {course.instructorData.name}
              </span>
            </div>
          )}

          {/* Call to action */}
          <div className="flex items-center justify-end pt-2 text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
            {isCompleted ? 'Revisar' : isStarted ? 'Continuar' : 'Iniciar'}
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
