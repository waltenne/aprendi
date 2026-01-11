import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { 
  validateCourseMeta, 
  type Course, 
  type CourseMeta,
  type CourseSection 
} from '@/lib/schemas';
import { getInstructorById, type Instructor } from './instructors';
import { processMarkdown, extractSections } from './markdown';
import { calculateReadingTime } from '@/lib/utils';
import { getAreaIcon, getAreaColor } from '@/lib/config/areas';

/**
 * Caminho base para o diretório de cursos
 */
const CONTENT_DIR = path.join(process.cwd(), 'content');
const COURSES_DIR = path.join(CONTENT_DIR, 'courses');

/**
 * Cache em memória para cursos
 */
const coursesCache: Map<string, Course> = new Map();
let allCoursesCache: Course[] | null = null;

/**
 * Interface para curso com instrutor completo
 */
export interface CourseWithInstructor extends Course {
  instructorData?: Instructor;
}

/**
 * Retorna todos os slugs de cursos disponíveis
 */
export function getAllCourseSlugs(): string[] {
  if (!fs.existsSync(COURSES_DIR)) {
    return [];
  }

  const entries = fs.readdirSync(COURSES_DIR, { withFileTypes: true });
  
  return entries
    .filter((entry) => entry.isDirectory())
    .filter((entry) => {
      // Verifica se tem meta.yml
      const metaPath = path.join(COURSES_DIR, entry.name, 'meta.yml');
      return fs.existsSync(metaPath);
    })
    .map((entry) => entry.name);
}

/**
 * Carrega metadados de um curso específico
 */
export function loadCourseMeta(slug: string): CourseMeta {
  const metaPath = path.join(COURSES_DIR, slug, 'meta.yml');
  
  if (!fs.existsSync(metaPath)) {
    throw new Error(`Arquivo meta.yml não encontrado para o curso: ${slug}`);
  }

  const raw = fs.readFileSync(metaPath, 'utf8');
  const data = yaml.load(raw) as any;
  
  // Define icon e color padrão baseado na área se não especificados
  if (!data.icon) {
    data.icon = getAreaIcon(data.area);
  }
  if (!data.color) {
    data.color = getAreaColor(data.area);
  }
  
  // Verifica automaticamente se existe cover.png
  const coverPath = path.join(COURSES_DIR, slug, 'images', 'logo', 'cover.png');
  if (fs.existsSync(coverPath)) {
    // Adiciona hash do arquivo para cache-busting (evita mostrar imagem errada)
    const stats = fs.statSync(coverPath);
    const fileHash = Buffer.from(`${stats.size}-${stats.mtimeMs}`).toString('base64url').substring(0, 8);
    // Usa caminho estático para GitHub Pages (imagem será copiada para /public no build)
    data.cover = `/courses/${slug}/cover.png?v=${fileHash}`;
  }
  
  // Valida com Zod
  return validateCourseMeta(data);
}

/**
 * Carrega o conteúdo Markdown de um curso
 */
export function loadCourseContent(slug: string): { 
  markdown: string; 
  html: string;
  sections: CourseSection[];
} {
  const contentPath = path.join(COURSES_DIR, slug, 'content.md');
  
  if (!fs.existsSync(contentPath)) {
    return { markdown: '', html: '', sections: [] };
  }

  const markdown = fs.readFileSync(contentPath, 'utf8');
  const html = processMarkdown(markdown);
  const sections = extractSections(markdown);

  return { markdown, html, sections };
}

/**
 * Carrega um curso completo por slug
 */
export function getCourseBySlug(slug: string): CourseWithInstructor | null {
  // Verifica cache
  if (coursesCache.has(slug)) {
    return coursesCache.get(slug) as CourseWithInstructor;
  }

  try {
    const meta = loadCourseMeta(slug);
    const { markdown, html, sections } = loadCourseContent(slug);
    
    // Busca dados do instrutor
    const instructorData = getInstructorById(meta.instructor.id);

    const course: CourseWithInstructor = {
      ...meta,
      content: markdown,
      htmlContent: html,
      sections,
      readingTime: markdown ? calculateReadingTime(markdown) : undefined,
      instructorData,
    };

    // Armazena no cache
    coursesCache.set(slug, course);

    return course;
  } catch (error) {
    console.error(`Erro ao carregar curso ${slug}:`, error);
    return null;
  }
}

/**
 * Retorna todos os cursos
 */
export function getAllCourses(): CourseWithInstructor[] {
  if (allCoursesCache) {
    return allCoursesCache;
  }

  const slugs = getAllCourseSlugs();
  const courses = slugs
    .map((slug) => getCourseBySlug(slug))
    .filter((course): course is CourseWithInstructor => course !== null)
    .filter((course) => course.published !== false);

  allCoursesCache = courses;
  return courses;
}

/**
 * Retorna cursos em destaque
 */
export function getFeaturedCourses(): CourseWithInstructor[] {
  return getAllCourses().filter((course) => course.featured);
}

/**
 * Retorna cursos por área
 */
export function getCoursesByArea(area: string): CourseWithInstructor[] {
  return getAllCourses().filter(
    (course) => course.area.toLowerCase() === area.toLowerCase()
  );
}

/**
 * Retorna cursos de um instrutor
 */
export function getCoursesByInstructor(instructorId: string): CourseWithInstructor[] {
  return getAllCourses().filter(
    (course) => course.instructor.id === instructorId
  );
}

/**
 * Retorna todas as áreas disponíveis
 */
export function getAllAreas(): string[] {
  const courses = getAllCourses();
  const areas = new Set(courses.map((c) => c.area));
  return Array.from(areas).sort();
}

/**
 * Retorna todas as tags disponíveis
 */
export function getAllTags(): string[] {
  const courses = getAllCourses();
  const tags = new Set(courses.flatMap((c) => c.tags));
  return Array.from(tags).sort();
}

/**
 * Retorna todos os níveis disponíveis
 */
export function getAllLevels(): string[] {
  const courses = getAllCourses();
  const levels = new Set(courses.map((c) => c.level));
  // Ordena por dificuldade
  const order = ['Iniciante', 'Intermediário', 'Avançado'];
  return Array.from(levels).sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

/**
 * Limpa todos os caches
 */
export function clearCoursesCache(): void {
  coursesCache.clear();
  allCoursesCache = null;
}
