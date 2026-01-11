import { z } from 'zod';

/**
 * Schema para progresso de leitura de seções
 */
export const SectionProgressSchema = z.object({
  sectionId: z.string(),
  readAt: z.string().datetime(),
});

/**
 * Schema para resultado de quiz salvo no progresso
 */
export const SavedQuizResultSchema = z.object({
  score: z.number().min(0).max(100),
  passed: z.boolean(),
  completedAt: z.string().datetime(),
  attempts: z.number().default(1),
});

/**
 * Schema para progresso de um curso individual
 * Estrutura salva em localStorage: pcursos:progress:{courseSlug}
 */
export const CourseProgressSchema = z.object({
  courseId: z.string(),
  started: z.boolean().default(false),
  startedAt: z.string().datetime().optional(),
  
  // Progresso de leitura
  sectionsRead: z.array(z.string()).default([]),
  currentSection: z.string().optional(),
  progress: z.number().min(0).max(100).default(0),
  contentFinished: z.boolean().default(false),
  contentFinishedAt: z.string().datetime().optional(),
  
  // Quiz
  quizCompleted: z.boolean().default(false),
  quizResult: SavedQuizResultSchema.optional(),
  
  // Certificado
  certificateGenerated: z.boolean().default(false),
  certificateGeneratedAt: z.string().datetime().optional(),
  userName: z.string().optional(),
  
  // Controle
  completed: z.boolean().default(false),
  completedAt: z.string().datetime().optional(),
  lastAccessedAt: z.string().datetime().optional(),
});

/**
 * Schema para o estado geral de progresso (todos os cursos)
 */
export const AllProgressSchema = z.record(z.string(), CourseProgressSchema);

/**
 * Tipos derivados dos schemas
 */
export type SectionProgress = z.infer<typeof SectionProgressSchema>;
export type SavedQuizResult = z.infer<typeof SavedQuizResultSchema>;
export type CourseProgress = z.infer<typeof CourseProgressSchema>;
export type AllProgress = z.infer<typeof AllProgressSchema>;

/**
 * Cria um progresso inicial vazio para um curso
 */
export function createEmptyProgress(courseId: string): CourseProgress {
  return {
    courseId,
    started: false,
    sectionsRead: [],
    progress: 0,
    contentFinished: false,
    quizCompleted: false,
    certificateGenerated: false,
    completed: false,
  };
}

/**
 * Valida progresso de curso
 */
export function validateProgress(data: unknown): CourseProgress {
  return CourseProgressSchema.parse(data);
}

/**
 * Valida com fallback para progresso vazio se inválido
 */
export function parseProgressSafe(data: unknown, courseId: string): CourseProgress {
  const result = CourseProgressSchema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  return createEmptyProgress(courseId);
}
