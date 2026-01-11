import { Fragment } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourseBySlug, getAllCourseSlugs, hasQuiz } from '@/lib/loaders';
import { getCourseMetadata, getCourseJsonLd, getBreadcrumbJsonLd } from '@/lib/seo';
import { CoursePageClient } from './CoursePageClient';

interface CoursePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = getCourseBySlug(params.slug);
  
  if (!course) {
    return {
      title: 'Curso não encontrado',
    };
  }

  return getCourseMetadata(course);
}

export default function CoursePage({ params }: CoursePageProps) {
  const course = getCourseBySlug(params.slug);
  
  if (!course) {
    notFound();
  }

  const quizAvailable = hasQuiz(params.slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aprendi.vercel.app';
  
  // JSON-LD para SEO
  const courseJsonLd = getCourseJsonLd(course);
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Início', url: baseUrl },
    { name: 'Cursos', url: `${baseUrl}/cursos` },
    { name: course.title, url: `${baseUrl}/cursos/${course.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CoursePageClient 
        course={course} 
        quizAvailable={quizAvailable}
      />
    </>
  );
}
