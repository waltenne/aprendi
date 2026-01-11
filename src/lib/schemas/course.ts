import { z } from 'zod';

/**
 * Níveis de dificuldade do curso
 */
export const CourseLevelEnum = z.enum([
  'Iniciante',
  'Intermediário',
  'Avançado',
]);

/**
 * Schema para referência de instrutor no curso
 */
export const CourseInstructorRefSchema = z.object({
  id: z.string().min(1, 'ID do instrutor é obrigatório'),
}).strict();

/**
 * Schema para metadados do curso (meta.yml)
 */
export const CourseMetaSchema = z.object({
  id: z.string()
    .min(1, 'ID é obrigatório')
    .regex(/^[a-z0-9-]+$/, 'ID deve conter apenas letras minúsculas, números e hífens'),
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  duration: z.string().min(1, 'Duração é obrigatória'),
  level: CourseLevelEnum,
  area: z.string().min(1, 'Área é obrigatória'),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve ser um hex válido (#RRGGBB)').optional(),
  cover: z.string().optional(),
  tags: z.array(z.string()).min(1, 'Deve haver pelo menos 1 tag'),
  instructor: CourseInstructorRefSchema,
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
}).strict();

/**
 * Schema para seção de conteúdo extraída do Markdown
 */
export const CourseSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  level: z.number().min(1).max(6),
  content: z.string(),
});

/**
 * Schema completo do curso (com conteúdo processado)
 */
export const CourseSchema = CourseMetaSchema.extend({
  content: z.string().optional(),
  htmlContent: z.string().optional(),
  sections: z.array(CourseSectionSchema).optional(),
  readingTime: z.string().optional(),
});

/**
 * Tipos derivados dos schemas
 */
export type CourseLevel = z.infer<typeof CourseLevelEnum>;
export type CourseInstructorRef = z.infer<typeof CourseInstructorRefSchema>;
export type CourseMeta = z.infer<typeof CourseMetaSchema>;
export type CourseSection = z.infer<typeof CourseSectionSchema>;
export type Course = z.infer<typeof CourseSchema>;

/**
 * Função utilitária para validar metadados do curso
 */
export function validateCourseMeta(data: unknown): CourseMeta {
  return CourseMetaSchema.parse(data);
}

/**
 * Função utilitária para validar curso completo
 */
export function validateCourse(data: unknown): Course {
  return CourseSchema.parse(data);
}
