import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourseBySlug, getAllCourseSlugs } from '@/lib/loaders';
import { CertificadoPageClient } from './CertificadoPageClient';

interface CertificadoPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CertificadoPageProps): Promise<Metadata> {
  const course = getCourseBySlug(params.slug);
  
  if (!course) {
    return {
      title: 'Certificado não encontrado',
    };
  }

  return {
    title: `Certificado - ${course.title}`,
    description: `Certificado de conclusão do curso ${course.title}`,
  };
}

export default function CertificadoPage({ params }: CertificadoPageProps) {
  const course = getCourseBySlug(params.slug);
  
  if (!course) {
    notFound();
  }

  return (
    <CertificadoPageClient course={course} />
  );
}
