/**
 * Testes de validação de cursos
 * Executar com: npm run test
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { CourseMetaSchema } from '@/lib/schemas/course';
import { QuizFileSchema, QuizSchema } from '@/lib/schemas/quiz';

const COURSES_DIR = path.join(process.cwd(), 'content', 'courses');
const INSTRUCTORS_FILE = path.join(process.cwd(), 'content', 'instructors', 'instructors.yml');

interface CourseDir {
  slug: string;
  path: string;
}

// Carrega lista de cursos antes dos testes
let courseDirs: CourseDir[] = [];
let instructorIds: string[] = [];

beforeAll(() => {
  // Listar cursos (exceto _template)
  const entries = fs.readdirSync(COURSES_DIR, { withFileTypes: true });
  courseDirs = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => ({
      slug: entry.name,
      path: path.join(COURSES_DIR, entry.name),
    }));

  // Carregar IDs de instrutores
  try {
    const content = fs.readFileSync(INSTRUCTORS_FILE, 'utf-8');
    const data = yaml.load(content) as { instructors: Array<{ id: string }> };
    instructorIds = data.instructors?.map((i) => i.id) || [];
  } catch {
    instructorIds = [];
  }
});

describe('Validação de Cursos', () => {
  it('deve existir pelo menos um curso publicado', () => {
    expect(courseDirs.length).toBeGreaterThan(0);
  });
});

// Testes dinâmicos para cada curso
describe('Cursos Individuais', () => {
  beforeAll(() => {
    // Garantir que courseDirs foi carregado
    const entries = fs.readdirSync(COURSES_DIR, { withFileTypes: true });
    courseDirs = entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
      .map((entry) => ({
        slug: entry.name,
        path: path.join(COURSES_DIR, entry.name),
      }));
  });

  it('cada curso deve ter meta.yml válido', () => {
    for (const dir of courseDirs) {
      const metaPath = path.join(dir.path, 'meta.yml');
      // Verificar se arquivo existe
      expect(fs.existsSync(metaPath), `${dir.slug}/meta.yml não encontrado`).toBe(true);
      let data;
      try {
        const content = fs.readFileSync(metaPath, 'utf-8');
        data = yaml.load(content);
      } catch (e) {
        throw new Error(`[${dir.slug}] Erro ao carregar meta.yml: ${(e as Error).message}`);
      }
      // Validar estrutura
      const result = CourseMetaSchema.safeParse(data);
      if (!result.success) {
        const errors = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        throw new Error(`[${dir.slug}] Erros em meta.yml:\n${errors.join('\n')}`);
      }
      // ID deve corresponder à pasta
      expect(result.data.id).toBe(dir.slug);
      // Instrutor deve existir
      expect(
        instructorIds.includes(result.data.instructor.id),
        `[${dir.slug}] Instrutor "${result.data.instructor.id}" não encontrado`
      ).toBe(true);
    }
  });

  it('cada curso deve ter content.md válido', () => {
    for (const dir of courseDirs) {
      const contentPath = path.join(dir.path, 'content.md');
      
      // Verificar se arquivo existe
      expect(fs.existsSync(contentPath), `${dir.slug}/content.md não encontrado`).toBe(true);
      
      const content = fs.readFileSync(contentPath, 'utf-8');

      // Conteúdo mínimo
      expect(
        content.trim().length >= 100,
        `[${dir.slug}] Conteúdo muito curto (mínimo 100 caracteres)`
      ).toBe(true);

      // Deve ter H1
      expect(content).toMatch(/^# .+$/m);

      // Não deve ter caracteres quebrados
      expect(content).not.toMatch(/[\uFFFD\u0000]/);
    }
  });

  it('cada curso deve ter quiz.yml válido', () => {
    for (const dir of courseDirs) {
      const quizPath = path.join(dir.path, 'quiz.yml');
      
      // Verificar se arquivo existe
      expect(fs.existsSync(quizPath), `${dir.slug}/quiz.yml não encontrado`).toBe(true);
      
      const content = fs.readFileSync(quizPath, 'utf-8');
      const data = yaml.load(content) as Record<string, unknown>;

      // Validar estrutura (tentar com wrapper e sem)
      let result = QuizFileSchema.safeParse(data);
      if (!result.success) {
        const directResult = QuizSchema.safeParse(data);
        if (!directResult.success) {
          const errors = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
          throw new Error(`[${dir.slug}] Erros em quiz.yml:\n${errors.join('\n')}`);
        }
      }

      // course_id deve corresponder
      const quizData = (data as { quiz?: { course_id: string }; course_id?: string });
      const courseId = quizData.quiz?.course_id || quizData.course_id;
      expect(courseId, `[${dir.slug}] course_id não definido`).toBe(dir.slug);
    }
  });

  it('IDs das perguntas devem ser únicos em cada quiz', () => {
    for (const dir of courseDirs) {
      const quizPath = path.join(dir.path, 'quiz.yml');
      const content = fs.readFileSync(quizPath, 'utf-8');
      const data = yaml.load(content) as {
        quiz?: { questions: Array<{ id: string }> };
        questions?: Array<{ id: string }>;
      };

      const questions = data.quiz?.questions || data.questions || [];
      const ids = questions.map((q) => q.id);
      const uniqueIds = [...new Set(ids)];

      expect(
        ids.length === uniqueIds.length,
        `[${dir.slug}] IDs duplicados: ${ids.filter((id, i) => ids.indexOf(id) !== i).join(', ')}`
      ).toBe(true);
    }
  });

  it('correct_answer deve estar dentro do range de options', () => {
    for (const dir of courseDirs) {
      const quizPath = path.join(dir.path, 'quiz.yml');
      const content = fs.readFileSync(quizPath, 'utf-8');
      const data = yaml.load(content) as {
        quiz?: { questions: Array<{ id: string; options: string[]; correct_answer: number | number[] }> };
        questions?: Array<{ id: string; options: string[]; correct_answer: number | number[] }>;
      };

      const questions = data.quiz?.questions || data.questions || [];

      for (const question of questions) {
        const optionsCount = question.options.length;

        if (typeof question.correct_answer === 'number') {
          expect(
            question.correct_answer >= 0 && question.correct_answer < optionsCount,
            `[${dir.slug}] Pergunta ${question.id}: correct_answer (${question.correct_answer}) fora do range [0-${optionsCount - 1}]`
          ).toBe(true);
        } else if (Array.isArray(question.correct_answer)) {
          for (const ans of question.correct_answer) {
            expect(
              ans >= 0 && ans < optionsCount,
              `[${dir.slug}] Pergunta ${question.id}: correct_answer contém ${ans} fora do range [0-${optionsCount - 1}]`
            ).toBe(true);
          }
        }
      }
    }
  });

  it('perguntas true_false devem ter exatamente 2 opções', () => {
    for (const dir of courseDirs) {
      const quizPath = path.join(dir.path, 'quiz.yml');
      const content = fs.readFileSync(quizPath, 'utf-8');
      const data = yaml.load(content) as {
        quiz?: { questions: Array<{ id: string; type: string; options: string[] }> };
        questions?: Array<{ id: string; type: string; options: string[] }>;
      };

      const questions = data.quiz?.questions || data.questions || [];
      const trueFalseQuestions = questions.filter((q) => q.type === 'true_false');

      for (const question of trueFalseQuestions) {
        expect(
          question.options.length === 2,
          `[${dir.slug}] Pergunta ${question.id}: tipo true_false deve ter 2 opções, tem ${question.options.length}`
        ).toBe(true);
      }
    }
  });
});

describe('Consistência entre Arquivos', () => {
  it('todos os cursos devem ter os 3 arquivos obrigatórios', () => {
    for (const courseDir of courseDirs) {
      const requiredFiles = ['meta.yml', 'content.md', 'quiz.yml'];

      for (const file of requiredFiles) {
        const filePath = path.join(courseDir.path, file);
        expect(fs.existsSync(filePath), `${courseDir.slug}/${file} não encontrado`).toBe(true);
      }
    }
  });
});
