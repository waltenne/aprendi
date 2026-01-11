import { z } from 'zod';

/**
 * Schema para links sociais do instrutor
 */
export const SocialLinksSchema = z.object({
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  website: z.string().url().optional(),
  youtube: z.string().url().optional(),
  instagram: z.string().url().optional(),
}).strict();

/**
 * Schema principal do Instrutor
 */
export const InstructorSchema = z.object({
  id: z.string()
    .min(1, 'ID é obrigatório')
    .regex(/^[a-z0-9-]+$/, 'ID deve conter apenas letras minúsculas, números e hífens'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  avatar: z.string().optional(), // Avatar é opcional - será processado pelo loader
  bio: z.string().min(10, 'Bio deve ter pelo menos 10 caracteres'),
  role: z.string().default('Instrutor'),
  social: SocialLinksSchema.optional(),
}).strict();

/**
 * Schema para a lista de instrutores (arquivo instructors.yml)
 */
export const InstructorsFileSchema = z.object({
  instructors: z.array(InstructorSchema).min(1, 'Deve haver pelo menos 1 instrutor'),
}).strict();

/**
 * Tipos derivados dos schemas
 */
export type SocialLinks = z.infer<typeof SocialLinksSchema>;
export type Instructor = z.infer<typeof InstructorSchema>;
export type InstructorsFile = z.infer<typeof InstructorsFileSchema>;

/**
 * Função utilitária para validar dados de instrutor
 */
export function validateInstructor(data: unknown): Instructor {
  return InstructorSchema.parse(data);
}

/**
 * Função utilitária para validar arquivo de instrutores
 */
export function validateInstructorsFile(data: unknown): InstructorsFile {
  return InstructorsFileSchema.parse(data);
}
