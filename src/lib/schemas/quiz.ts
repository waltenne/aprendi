import { z } from 'zod';

/**
 * Tipos de perguntas suportadas no quiz
 */
export const QuestionTypeEnum = z.enum([
  'multiple_choice_single',
  'multiple_choice_multiple',
  'true_false',
]);

/**
 * Schema base para opções de resposta
 */
export const QuestionOptionSchema = z.string().min(1);

/**
 * Schema para pergunta do quiz
 */
export const QuizQuestionSchema = z.object({
  id: z.string().min(1, 'ID da pergunta é obrigatório'),
  type: QuestionTypeEnum,
  question: z.string().min(5, 'Pergunta deve ter pelo menos 5 caracteres'),
  options: z.array(QuestionOptionSchema).min(2, 'Deve haver pelo menos 2 opções'),
  correct_answer: z.union([
    z.number().min(0),
    z.array(z.number().min(0)),
    z.boolean(),
  ]),
  explanation: z.string().optional(),
  hint: z.string().optional(),
  points: z.number().min(1).default(10),
}).strict();

/**
 * Schema para o arquivo de quiz (quiz.yml)
 */
export const QuizSchema = z.object({
  course_id: z.string().min(1, 'ID do curso é obrigatório'),
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  time_limit: z.number().min(60).default(1800), // em segundos, padrão 30 min
  passing_score: z.number().min(0).max(100).default(70),
  questions: z.array(QuizQuestionSchema).min(1, 'Deve haver pelo menos 1 pergunta'),
}).strict();

/**
 * Schema para o arquivo de quiz completo (com wrapper)
 */
export const QuizFileSchema = z.object({
  quiz: QuizSchema,
}).strict();

/**
 * Schema para resposta do usuário em uma pergunta
 */
export const UserAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.union([
    z.number(),
    z.array(z.number()),
    z.boolean(),
  ]),
  isCorrect: z.boolean(),
});

/**
 * Schema para resultado do quiz
 */
export const QuizResultSchema = z.object({
  courseId: z.string(),
  quizId: z.string(),
  answers: z.array(UserAnswerSchema),
  score: z.number().min(0).max(100),
  passed: z.boolean(),
  totalPoints: z.number(),
  earnedPoints: z.number(),
  completedAt: z.string().datetime(),
  timeSpent: z.number().optional(), // em segundos
});

/**
 * Tipos derivados dos schemas
 */
export type QuestionType = z.infer<typeof QuestionTypeEnum>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
export type QuizFile = z.infer<typeof QuizFileSchema>;
export type UserAnswer = z.infer<typeof UserAnswerSchema>;
export type QuizResult = z.infer<typeof QuizResultSchema>;

/**
 * Função utilitária para validar quiz
 */
export function validateQuiz(data: unknown): Quiz {
  const parsed = QuizFileSchema.safeParse(data);
  if (parsed.success) {
    return parsed.data.quiz;
  }
  // Tenta validar como quiz direto
  return QuizSchema.parse(data);
}

/**
 * Função utilitária para validar resultado do quiz
 */
export function validateQuizResult(data: unknown): QuizResult {
  return QuizResultSchema.parse(data);
}
