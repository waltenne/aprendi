import { Metadata } from 'next';
import type { CourseWithInstructor } from '@/lib/loaders/courses';
import type { Instructor } from '@/lib/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aprendi.vercel.app';
const SITE_NAME = 'Aprendi';
const DEFAULT_DESCRIPTION = 'Aprendi - Cursos gratuitos, quizzes interativos e certificados simbólicos. Conhecimento acessível para todos.';

/**
 * Gera metadados base para o site
 */
export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: `${SITE_NAME} - Plataforma Educacional Gratuita`,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: ['cursos gratuitos', 'educação online', 'quiz', 'certificado', 'aprendizado', 'programação', 'tecnologia'],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/images/logo.png', type: 'image/png' },
      ],
      apple: '/images/logo.png',
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
          url: `${BASE_URL}/og-image.png`,
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
      images: [`${BASE_URL}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Adicione suas verificações aqui
      // google: 'sua-verificação-google',
      // yandex: 'sua-verificação-yandex',
    },
    alternates: {
      canonical: BASE_URL,
    },
  };
}

/**
 * Gera metadados para uma página de curso
 */
export function getCourseMetadata(course: CourseWithInstructor): Metadata {
  const url = `${BASE_URL}/cursos/${course.id}`;
  const title = course.title;
  const description = course.description || `Aprenda ${course.title} gratuitamente com quiz interativo e certificado.`;
  
  // Keywords específicas do curso
  const keywords = [
    course.title.toLowerCase(),
    ...(course.tags || []),
    course.level,
    'curso gratuito',
    'tutorial',
    course.instructorData?.name || '',
  ].filter(Boolean);

  return {
    title,
    description,
    keywords,
    authors: course.instructorData 
      ? [{ name: course.instructorData.name }] 
      : undefined,
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      url,
      title: `${title} - Curso Gratuito`,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&icon=${encodeURIComponent(course.icon || '')}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      // publishedTime: course.createdAt,
      // modifiedTime: course.updatedAt,
      authors: course.instructorData ? [course.instructorData.name] : undefined,
      tags: course.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Curso Gratuito`,
      description,
      images: [`${BASE_URL}/api/og?title=${encodeURIComponent(title)}&icon=${encodeURIComponent(course.icon || '')}`],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Gera metadados para uma página de instrutor
 */
export function getInstructorMetadata(instructor: Instructor): Metadata {
  const url = `${BASE_URL}/instrutores/${instructor.id}`;
  const title = instructor.name;
  const description = instructor.bio || `Conheça ${instructor.name}, instrutor na ${SITE_NAME}.`;

  return {
    title,
    description,
    openGraph: {
      type: 'profile',
      locale: 'pt_BR',
      url,
      title: `${title} - Instrutor`,
      description,
      siteName: SITE_NAME,
      images: instructor.avatar 
        ? [{ url: instructor.avatar, alt: instructor.name }]
        : undefined,
    },
    twitter: {
      card: 'summary',
      title: `${title} - Instrutor`,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Gera metadados para a página de listagem de cursos
 */
export function getCoursesListMetadata(): Metadata {
  const url = `${BASE_URL}/cursos`;
  
  return {
    title: 'Cursos Gratuitos',
    description: 'Explore nossa coleção de cursos gratuitos com quizzes interativos e certificados simbólicos.',
    openGraph: {
      type: 'website',
      url,
      title: 'Cursos Gratuitos - PCursos',
      description: 'Explore nossa coleção de cursos gratuitos com quizzes interativos e certificados simbólicos.',
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Gera JSON-LD Schema para curso (dados estruturados)
 */
export function getCourseJsonLd(course: CourseWithInstructor) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
    instructor: course.instructorData ? {
      '@type': 'Person',
      name: course.instructorData.name,
      description: course.instructorData.bio,
    } : undefined,
    courseMode: 'online',
    isAccessibleForFree: true,
    inLanguage: 'pt-BR',
    educationalLevel: course.level,
    timeRequired: course.duration,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: course.duration,
    },
  };
}

/**
 * Gera JSON-LD Schema para organização
 */
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      // Adicione suas redes sociais aqui
      // 'https://twitter.com/pcursos',
      // 'https://github.com/pcursos',
    ],
  };
}

/**
 * Gera JSON-LD Schema para breadcrumbs
 */
export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
