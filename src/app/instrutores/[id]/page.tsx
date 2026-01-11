import { Fragment } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CourseCard } from '@/components/courses';
import { 
  getInstructorById, 
  getAllInstructorIds, 
  getCoursesByInstructor 
} from '@/lib/loaders';
import { getInstructorMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { ArrowLeft, Github, Linkedin, Twitter, Globe, ExternalLink, User } from 'lucide-react';

interface InstrutorPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const ids = getAllInstructorIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: InstrutorPageProps): Promise<Metadata> {
  const instructor = getInstructorById(params.id);
  
  if (!instructor) {
    return {
      title: 'Instrutor não encontrado',
    };
  }

  return getInstructorMetadata(instructor);
}

export default function InstrutorPage({ params }: InstrutorPageProps) {
  const instructor = getInstructorById(params.id);
  
  if (!instructor) {
    notFound();
  }

  const courses = getCoursesByInstructor(params.id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aprendi.vercel.app';
  
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Início', url: baseUrl },
    { name: 'Instrutores', url: `${baseUrl}/instrutores` },
    { name: instructor.name, url: `${baseUrl}/instrutores/${instructor.id}` },
  ]);

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    website: Globe,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="container mx-auto px-4 py-12">
        <Link 
          href="/instrutores"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar aos instrutores
        </Link>

        {/* Header do instrutor */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Avatar */}
              <div className="relative h-32 w-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/20 to-purple-500/20">
                {instructor.avatar ? (
                  <Image
                    src={instructor.avatar}
                    alt={instructor.name}
                    fill
                    className="object-cover"
                    unoptimized={instructor.avatar.startsWith('/api/')}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-600">
                    <User className="h-16 w-16 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{instructor.name}</h1>
                <Badge variant="secondary" className="mb-4">
                  {instructor.role}
                </Badge>
                <p className="text-muted-foreground max-w-2xl mb-6">
                  {instructor.bio}
                </p>

                {/* Redes sociais */}
                {instructor.social && (
                  <div className="flex gap-3 justify-center md:justify-start">
                    {Object.entries(instructor.social).map(([key, url]) => {
                      if (!url) return null;
                      const Icon = socialIcons[key as keyof typeof socialIcons] || ExternalLink;
                      return (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                          aria-label={key}
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cursos do instrutor */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Cursos de {instructor.name}
          </h2>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Nenhum curso disponível no momento.
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </>
  );
}
