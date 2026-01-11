import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourseBySlug, getAllCourseSlugs, getQuizBySlug } from '@/lib/loaders';
import { QuizPageClient } from './QuizPageClient';

interface QuizPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const course = getCourseBySlug(params.slug);
  
  if (!course) {
    return {
      title: 'Quiz não encontrado',
    };
  }

  return {
    title: `Quiz - ${course.title}`,
    description: `Teste seus conhecimentos sobre ${course.title}`,
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  const course = getCourseBySlug(params.slug);
  const quiz = getQuizBySlug(params.slug);
  
  if (!course || !quiz) {
    notFound();
  }

  return (
    <QuizPageClient 
      course={course}
      quiz={quiz}
    />
  );
}
