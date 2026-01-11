/**
 * Schemas Zod para validação de dados da plataforma PCursos
 * 
 * Estes schemas são usados para validar:
 * - Dados de cursos (meta.yml)
 * - Dados de instrutores (instructors.yml)
 * - Dados de quizzes (quiz.yml)
 * - Progresso do usuário (localStorage)
 * 
 * A validação é executada em build time para garantir integridade do conteúdo.
 */

export * from './instructor';
export * from './course';
export * from './quiz';
export * from './progress';
