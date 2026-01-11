import { MetadataRoute } from 'next';
import { getAllCourses } from '@/lib/loaders/courses';
import { getAllInstructorIds } from '@/lib/loaders/instructors';
import { hasQuiz } from '@/lib/loaders/quizzes';

/**
 * Gera sitemap.xml dinâmico para SEO
 * Inclui todas as páginas estáticas e dinâmicas (cursos, instrutores)
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aprendi.vercel.app';
  
  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cursos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/instrutores`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Páginas de cursos dinâmicas
  const courses = getAllCourses();
  const coursePages: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${baseUrl}/cursos/${course.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Páginas de quiz (só para cursos com quiz)
  const quizPages: MetadataRoute.Sitemap = courses
    .filter((course) => hasQuiz(course.id))
    .map((course) => ({
      url: `${baseUrl}/cursos/${course.id}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  // Páginas de instrutores
  const instructorIds = getAllInstructorIds();
  const instructorPages: MetadataRoute.Sitemap = instructorIds.map((id) => ({
    url: `${baseUrl}/instrutores/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...coursePages, ...quizPages, ...instructorPages];
}
