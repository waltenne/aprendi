import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { validateQuiz, type Quiz, type QuizFile } from '@/lib/schemas';

/**
 * Caminho base para o diretório de cursos
 */
const CONTENT_DIR = path.join(process.cwd(), 'content');
const COURSES_DIR = path.join(CONTENT_DIR, 'courses');

/**
 * Cache em memória para quizzes
 */
const quizzesCache: Map<string, Quiz> = new Map();

/**
 * Verifica se um curso possui quiz
 */
export function hasQuiz(courseSlug: string): boolean {
  const quizPath = path.join(COURSES_DIR, courseSlug, 'quiz.yml');
  return fs.existsSync(quizPath);
}

/**
 * Carrega o quiz de um curso
 * @param courseSlug - Slug do curso
 * @returns Quiz validado ou null se não existir
 */
export function getQuizBySlug(courseSlug: string): Quiz | null {
  // Verifica cache
  if (quizzesCache.has(courseSlug)) {
    return quizzesCache.get(courseSlug)!;
  }

  const quizPath = path.join(COURSES_DIR, courseSlug, 'quiz.yml');

  if (!fs.existsSync(quizPath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(quizPath, 'utf8');
    const data = yaml.load(raw) as QuizFile | Quiz;
    
    // Valida com Zod
    const quiz = validateQuiz(data);

    // Armazena no cache
    quizzesCache.set(courseSlug, quiz);

    return quiz;
  } catch (error) {
    console.error(`Erro ao carregar quiz do curso ${courseSlug}:`, error);
    throw error; // Re-throw para falhar o build
  }
}

/**
 * Calcula a pontuação de um quiz baseado nas respostas
 */
export function calculateQuizScore(
  quiz: Quiz,
  answers: Map<string, number | number[] | boolean>
): {
  score: number;
  passed: boolean;
  totalPoints: number;
  earnedPoints: number;
  correctAnswers: number;
  totalQuestions: number;
} {
  let earnedPoints = 0;
  let correctAnswers = 0;
  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  for (const question of quiz.questions) {
    const userAnswer = answers.get(question.id);
    
    if (userAnswer === undefined) continue;

    const isCorrect = checkAnswer(question.correct_answer, userAnswer);
    
    if (isCorrect) {
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
    correctAnswers,
    totalQuestions: quiz.questions.length,
  };
}

/**
 * Verifica se a resposta do usuário está correta
 */
function checkAnswer(
  correctAnswer: number | number[] | boolean,
  userAnswer: number | number[] | boolean
): boolean {
  // True/False
  if (typeof correctAnswer === 'boolean') {
    return correctAnswer === userAnswer;
  }

  // Multiple choice single
  if (typeof correctAnswer === 'number') {
    return correctAnswer === userAnswer;
  }

  // Multiple choice multiple
  if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
    if (correctAnswer.length !== userAnswer.length) return false;
    const sortedCorrect = [...correctAnswer].sort();
    const sortedUser = [...userAnswer].sort();
    return sortedCorrect.every((val, idx) => val === sortedUser[idx]);
  }

  return false;
}

/**
 * Limpa o cache de quizzes
 */
export function clearQuizzesCache(): void {
  quizzesCache.clear();
}
