/**
 * Script de validação de cursos
 * Valida meta.yml, content.md e quiz.yml de todos os cursos
 * Usado em build time para garantir integridade do conteúdo
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { z } from 'zod';
import { CourseMetaSchema } from '@/lib/schemas/course';
import { QuizFileSchema, QuizSchema } from '@/lib/schemas/quiz';

const COURSES_DIR = path.join(process.cwd(), 'content', 'courses');
const INSTRUCTORS_FILE = path.join(process.cwd(), 'content', 'instructors', 'instructors.yml');

export interface ValidationError {
  course: string;
  file: string;
  errors: string[];
}

export interface ValidationResult {
  valid: boolean;
  coursesValidated: number;
  errors: ValidationError[];
  warnings: string[];
}

/**
 * Carrega lista de IDs de instrutores válidos
 */
function loadInstructorIds(): string[] {
  try {
    const content = fs.readFileSync(INSTRUCTORS_FILE, 'utf-8');
    const data = yaml.load(content) as { instructors: Array<{ id: string }> };
    return data.instructors?.map((i) => i.id) || [];
  } catch {
    return [];
  }
}

/**
 * Lista todos os diretórios de cursos (exceto _template)
 */
function listCourseDirectories(): string[] {
  const entries = fs.readdirSync(COURSES_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => entry.name);
}

/**
 * Valida meta.yml de um curso
 */
function validateMeta(
  courseSlug: string,
  instructorIds: string[]
): { valid: boolean; errors: string[]; data?: z.infer<typeof CourseMetaSchema> } {
  const metaPath = path.join(COURSES_DIR, courseSlug, 'meta.yml');
  const errors: string[] = [];

  if (!fs.existsSync(metaPath)) {
    return { valid: false, errors: ['Arquivo meta.yml não encontrado'] };
  }

  try {
    const content = fs.readFileSync(metaPath, 'utf-8');
    const data = yaml.load(content);

    // Validar com Zod
    const parsed = CourseMetaSchema.safeParse(data);
    if (!parsed.success) {
      parsed.error.errors.forEach((err) => {
        errors.push(`${err.path.join('.')}: ${err.message}`);
      });
      return { valid: false, errors };
    }

    // Validar se o ID do curso corresponde ao nome da pasta
    if (parsed.data.id !== courseSlug) {
      errors.push(`ID "${parsed.data.id}" não corresponde ao nome da pasta "${courseSlug}"`);
    }

    // Validar se o instrutor existe
    if (!instructorIds.includes(parsed.data.instructor.id)) {
      errors.push(`Instrutor "${parsed.data.instructor.id}" não encontrado em instructors.yml`);
    }

    return { valid: errors.length === 0, errors, data: parsed.data };
  } catch (err) {
    return { valid: false, errors: [`Erro ao parsear YAML: ${err}`] };
  }
}

/**
 * Valida content.md de um curso
 */
function validateContent(courseSlug: string): { valid: boolean; errors: string[]; warnings: string[] } {
  const contentPath = path.join(COURSES_DIR, courseSlug, 'content.md');
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!fs.existsSync(contentPath)) {
    return { valid: false, errors: ['Arquivo content.md não encontrado'], warnings };
  }

  try {
    const content = fs.readFileSync(contentPath, 'utf-8');

    // Validações de estrutura do Markdown
    if (content.trim().length < 100) {
      errors.push('Conteúdo muito curto (mínimo 100 caracteres)');
    }

    // Verificar se tem pelo menos um heading H1
    const hasH1 = /^# .+$/m.test(content);
    if (!hasH1) {
      errors.push('Deve haver pelo menos um título H1 (# Título)');
    }

    // Verificar se tem seções (H2)
    const h2Count = (content.match(/^## .+$/gm) || []).length;
    if (h2Count < 1) {
      warnings.push('Recomendado ter pelo menos uma seção H2 (## Seção)');
    }

    // Verificar links quebrados internos
    const internalLinks = content.match(/\]\((?!https?:\/\/)([^)]+)\)/g) || [];
    internalLinks.forEach((link) => {
      const linkPath = link.match(/\]\(([^)]+)\)/)?.[1];
      if (linkPath && linkPath.startsWith('/')) {
        // É um link interno absoluto - verificar se faz sentido
        if (!linkPath.match(/^\/(cursos|instrutores|sobre|contribuir)/)) {
          warnings.push(`Link interno pode estar quebrado: ${linkPath}`);
        }
      }
    });

    // Verificar imagens sem alt text
    const imagesWithoutAlt = content.match(/!\[\]\([^)]+\)/g) || [];
    if (imagesWithoutAlt.length > 0) {
      warnings.push(`${imagesWithoutAlt.length} imagem(ns) sem texto alternativo`);
    }

    return { valid: errors.length === 0, errors, warnings };
  } catch (err) {
    return { valid: false, errors: [`Erro ao ler arquivo: ${err}`], warnings };
  }
}

/**
 * Valida quiz.yml de um curso
 */
function validateQuiz(
  courseSlug: string,
  courseMeta?: z.infer<typeof CourseMetaSchema>
): { valid: boolean; errors: string[]; warnings: string[] } {
  const quizPath = path.join(COURSES_DIR, courseSlug, 'quiz.yml');
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!fs.existsSync(quizPath)) {
    return { valid: false, errors: ['Arquivo quiz.yml não encontrado'], warnings };
  }

  try {
    const content = fs.readFileSync(quizPath, 'utf-8');
    const data = yaml.load(content);

    // Tentar validar com wrapper ou direto
    let quizData: z.infer<typeof QuizSchema>;
    
    const parsedWithWrapper = QuizFileSchema.safeParse(data);
    if (parsedWithWrapper.success) {
      quizData = parsedWithWrapper.data.quiz;
    } else {
      const parsedDirect = QuizSchema.safeParse(data);
      if (parsedDirect.success) {
        quizData = parsedDirect.data;
      } else {
        parsedWithWrapper.error.errors.forEach((err) => {
          errors.push(`${err.path.join('.')}: ${err.message}`);
        });
        return { valid: false, errors, warnings };
      }
    }

    // Validar se o course_id corresponde ao curso
    if (quizData.course_id !== courseSlug) {
      errors.push(`course_id "${quizData.course_id}" não corresponde ao curso "${courseSlug}"`);
    }

    // Validar IDs únicos das perguntas
    const questionIds = quizData.questions.map((q) => q.id);
    const duplicateIds = questionIds.filter((id, index) => questionIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.push(`IDs de perguntas duplicados: ${duplicateIds.join(', ')}`);
    }

    // Validar correct_answer dentro do range de options
    quizData.questions.forEach((question, index) => {
      const optionsCount = question.options.length;
      
      if (typeof question.correct_answer === 'number') {
        if (question.correct_answer < 0 || question.correct_answer >= optionsCount) {
          errors.push(
            `Pergunta ${question.id}: correct_answer (${question.correct_answer}) fora do range [0-${optionsCount - 1}]`
          );
        }
      } else if (Array.isArray(question.correct_answer)) {
        question.correct_answer.forEach((ans) => {
          if (ans < 0 || ans >= optionsCount) {
            errors.push(
              `Pergunta ${question.id}: correct_answer contém índice (${ans}) fora do range [0-${optionsCount - 1}]`
            );
          }
        });
      }

      // Validar tipo true_false
      if (question.type === 'true_false' && question.options.length !== 2) {
        errors.push(`Pergunta ${question.id}: tipo true_false deve ter exatamente 2 opções`);
      }

      // Warning para perguntas sem explicação
      if (!question.explanation) {
        warnings.push(`Pergunta ${question.id}: recomendado adicionar explicação`);
      }
    });

    // Validações de qualidade
    if (quizData.questions.length < 3) {
      warnings.push('Recomendado ter pelo menos 3 perguntas no quiz');
    }

    const totalPoints = quizData.questions.reduce((sum, q) => sum + (q.points || 10), 0);
    if (totalPoints < 30) {
      warnings.push(`Pontuação total muito baixa: ${totalPoints} pontos`);
    }

    return { valid: errors.length === 0, errors, warnings };
  } catch (err) {
    return { valid: false, errors: [`Erro ao parsear YAML: ${err}`], warnings };
  }
}

/**
 * Valida todos os cursos
 */
export function validateAllCourses(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    coursesValidated: 0,
    errors: [],
    warnings: [],
  };

  const instructorIds = loadInstructorIds();
  const courseDirectories = listCourseDirectories();

  if (courseDirectories.length === 0) {
    result.warnings.push('Nenhum curso encontrado para validar');
    return result;
  }

  for (const courseSlug of courseDirectories) {
    result.coursesValidated++;
    
    // Validar meta.yml
    const metaResult = validateMeta(courseSlug, instructorIds);
    if (!metaResult.valid) {
      result.valid = false;
      result.errors.push({
        course: courseSlug,
        file: 'meta.yml',
        errors: metaResult.errors,
      });
    }

    // Validar content.md
    const contentResult = validateContent(courseSlug);
    if (!contentResult.valid) {
      result.valid = false;
      result.errors.push({
        course: courseSlug,
        file: 'content.md',
        errors: contentResult.errors,
      });
    }
    contentResult.warnings.forEach((w) => {
      result.warnings.push(`[${courseSlug}] content.md: ${w}`);
    });

    // Validar quiz.yml
    const quizResult = validateQuiz(courseSlug, metaResult.data);
    if (!quizResult.valid) {
      result.valid = false;
      result.errors.push({
        course: courseSlug,
        file: 'quiz.yml',
        errors: quizResult.errors,
      });
    }
    quizResult.warnings.forEach((w) => {
      result.warnings.push(`[${courseSlug}] quiz.yml: ${w}`);
    });
  }

  return result;
}

/**
 * Formata resultado para exibição no console
 */
export function formatValidationResult(result: ValidationResult): string {
  const lines: string[] = [];
  
  lines.push('');
  lines.push('═══════════════════════════════════════════════════════════');
  lines.push('              VALIDAÇÃO DE CURSOS - APRENDI                 ');
  lines.push('═══════════════════════════════════════════════════════════');
  lines.push('');

  if (result.valid) {
    lines.push(`✅ ${result.coursesValidated} curso(s) validado(s) com sucesso!`);
  } else {
    lines.push(`❌ Falha na validação de ${result.errors.length} arquivo(s)`);
    lines.push('');
    
    for (const error of result.errors) {
      lines.push(`📁 ${error.course}/${error.file}:`);
      error.errors.forEach((e) => {
        lines.push(`   ❌ ${e}`);
      });
      lines.push('');
    }
  }

  if (result.warnings.length > 0) {
    lines.push('');
    lines.push('⚠️  Avisos:');
    result.warnings.forEach((w) => {
      lines.push(`   ⚠️  ${w}`);
    });
  }

  lines.push('');
  lines.push('═══════════════════════════════════════════════════════════');
  
  return lines.join('\n');
}

// Executar diretamente se chamado como script
if (process.argv[1]?.includes('validate-courses')) {
  const result = validateAllCourses();
  console.log(formatValidationResult(result));
  process.exit(result.valid ? 0 : 1);
}
