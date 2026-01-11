import { Metadata } from 'next';
import type { CourseWithInstructor } from '@/lib/loaders/courses';
import type { Instructor } from '@/lib/schemas';

const DEFAULT_SITE = 'https://waltenne.github.io/aprendi';
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE).replace(/\/$/, '');
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.GITHUB_PAGES === 'true' && process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split('/').pop()}`
  : '');

const SITE_NAME = 'Aprendi';
const DEFAULT_DESCRIPTION =
  'Aprendi - Cursos gratuitos, quizzes interativos e certificados simbólicos. Conhecimento acessível para todos.';

export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: `${SITE_NAME} - Plataforma Educacional Gratuita`,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: [
      'cursos gratuitos',
      'educação online',
      'quiz',
      'certificado',
      'aprendizado',
      'programação',
      'tecnologia',
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: { email: false, address: false, telephone: false },
    icons: {
      icon: [
        { url: `${BASE_PATH || ''}/favicon.ico`, sizes: 'any' },
        { url: `${BASE_PATH || ''}/images/logo.png`, type: 'image/png' },
      ],
      apple: `${BASE_PATH || ''}/images/logo.png`,
    },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: BASE_URL,
      siteName: SITE_NAME,
      title: `${SITE_NAME} - Plataforma Educacional Gratuita`,
      description: DEFAULT_DESCRIPTION,
      images: [
        {
          url: `${BASE_URL}${BASE_PATH || ''}/og-image.png`,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} - Plataforma Educacional Gratuita`,
      description: DEFAULT_DESCRIPTION,
      images: [`${BASE_URL}${BASE_PATH || ''}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    alternates: { canonical: BASE_URL },
  };
}

export function getCourseMetadata(course: CourseWithInstructor): Metadata {
  const url = `${BASE_URL}${BASE_PATH || ''}/cursos/${course.id}`;
  const title = course.title;
  const description = course.description || `Aprenda ${course.title} gratuitamente com quiz interativo e certificado.`;

  const keywords = [course.title.toLowerCase(), ...(course.tags || []), course.level, 'curso gratuito']
    .filter(Boolean)
    .slice(0, 12);

  return {
    title,
    description,
    keywords,
    authors: course.instructorData ? [{ name: course.instructorData.name }] : undefined,
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      url,
      title: `${title} - Curso Gratuito`,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: `${BASE_URL}${BASE_PATH || ''}/api/og?title=${encodeURIComponent(title)}&icon=${encodeURIComponent(
            course.icon || ''
          )}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      authors: course.instructorData ? [course.instructorData.name] : undefined,
      tags: course.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Curso Gratuito`,
      description,
      images: [`${BASE_URL}${BASE_PATH || ''}/api/og?title=${encodeURIComponent(title)}&icon=${encodeURIComponent(
        course.icon || ''
      )}`],
    },
    alternates: { canonical: url },
  };
}

export function getInstructorMetadata(instructor: Instructor): Metadata {
  const url = `${BASE_URL}${BASE_PATH || ''}/instrutores/${instructor.id}`;
  const title = instructor.name;
  const description = instructor.bio || `Instrutor ${instructor.name} na ${SITE_NAME}`;

  return {
    title,
    description,
    authors: [{ name: instructor.name }],
    openGraph: {
      type: 'profile',
      locale: 'pt_BR',
      url,
      title: `${title} - Instrutor`,
      description,
      siteName: SITE_NAME,
      images: [{ url: `${BASE_URL}${BASE_PATH || ''}${instructor.avatar || '/images/instructors/default.png'}` }],
    },
    alternates: { canonical: url },
  };
}

export function getCoursesListMetadata(): Metadata {
  const url = `${BASE_URL}${BASE_PATH || ''}/cursos`;
  return {
    title: 'Cursos Gratuitos',
    description: 'Explore nossa coleção de cursos gratuitos com quizzes interativos e certificados simbólicos.',
    openGraph: {
      type: 'website',
      url,
      title: 'Cursos Gratuitos - Aprendi',
      description: 'Explore nossa coleção de cursos gratuitos com quizzes interativos e certificados simbólicos.',
    },
    alternates: { canonical: url },
  };
}

export function getCourseJsonLd(course: CourseWithInstructor) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: { '@type': 'Organization', name: SITE_NAME, url: BASE_URL },
    instructor: course.instructorData ? { '@type': 'Person', name: course.instructorData.name, description: course.instructorData.bio } : undefined,
    courseMode: 'online',
    isAccessibleForFree: true,
    inLanguage: 'pt-BR',
    educationalLevel: course.level,
    timeRequired: course.duration,
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: course.duration },
  };
}

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}${BASE_PATH || ''}/images/logo.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [],
  };
}

export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })),
  };
}
