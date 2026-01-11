'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, BookOpen, ArrowRight, Clock, User } from 'lucide-react';
import type { CourseWithInstructor } from '@/lib/loaders/courses';

interface FavoritosClientProps {
  courses: CourseWithInstructor[];
}

export function FavoritosClient({ courses }: FavoritosClientProps) {
  const [favoriteCourses, setFavoriteCourses] = useState<CourseWithInstructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function loadFavorites() {
      try {
        const activeId = localStorage.getItem('pcursos:activeProfileId');
        if (!activeId) {
          setIsLoading(false);
          return;
        }

        const key = `pcursos:favorites:${activeId}`;
        const storedFavorites = localStorage.getItem(key);
        
        if (!storedFavorites) {
          setIsLoading(false);
          return;
        }

        const favoriteIds = JSON.parse(storedFavorites) as string[];
        
        if (favoriteIds.length === 0) {
          setIsLoading(false);
          return;
        }

        const favorites = courses.filter((course: CourseWithInstructor) => 
          favoriteIds.includes(course.id)
        );
        
        setFavoriteCourses(favorites);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, [courses]);

  const removeFavorite = (courseId: string) => {
    const activeId = localStorage.getItem('pcursos:activeProfileId');
    if (!activeId) return;

    const key = `pcursos:favorites:${activeId}`;
    const storedFavorites = localStorage.getItem(key);
    
    if (storedFavorites) {
      const favoriteIds = JSON.parse(storedFavorites) as string[];
      const updated = favoriteIds.filter(id => id !== courseId);
      localStorage.setItem(key, JSON.stringify(updated));
      setFavoriteCourses(prev => prev.filter(c => c.id !== courseId));
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-pink-500/10 text-pink-500">
            <Heart className="h-3 w-3 inline mr-1" />
            Coleção Pessoal
          </span>
        </div>
        <h1 className="text-3xl font-bold">Favoritos</h1>
        <p className="text-muted-foreground max-w-2xl">
          Aqui você encontra todos os cursos que você favoritou para acessar rapidamente.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : favoriteCourses.length === 0 ? (
        <>
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="p-6 rounded-full bg-pink-500/10 mb-6">
              <Heart className="h-12 w-12 text-pink-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">
              Nenhum favorito ainda
            </h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Clique no ícone de coração nos cursos para adicioná-los aos seus favoritos.
              Eles aparecerão aqui para acesso rápido.
            </p>
            <Button asChild>
              <Link href="/cursos" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Explorar Cursos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Info Card */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              Como funciona?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-0.5">•</span>
                <span>Clique no ícone de coração em qualquer curso para favoritá-lo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-0.5">•</span>
                <span>Seus favoritos são salvos localmente por perfil</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-0.5">•</span>
                <span>Acesse rapidamente seus cursos favoritos através desta página</span>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {favoriteCourses.length} {favoriteCourses.length === 1 ? 'curso favoritado' : 'cursos favoritados'}
            </p>
          </div>

          {/* Lista de Cursos Favoritos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {favoriteCourses.map((course) => (
              <div key={course.id} className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-200">
                <Link href={`/cursos/${course.id}`} className="block">
                  <div 
                    className="h-44 flex items-center justify-center relative"
                    style={{ backgroundColor: `${course.color}15` }}
                  >
                    {course.cover ? (
                      <Image
                        src={course.cover}
                        alt={course.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-5xl">{course.icon}</span>
                    )}
                  </div>
                </Link>

                {/* Action Button */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFavorite(course.id);
                    }}
                    className="p-1.5 rounded-lg bg-rose-500 text-white transition-all hover:bg-rose-600"
                    title="Remover dos favoritos"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <Link href={`/cursos/${course.id}`}>
                    <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                      {course.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3.75rem]">
                    {course.description}
                  </p>

                  {/* Instructor */}
                  {course.instructorData && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>{course.instructorData.name}</span>
                    </div>
                  )}

                  {/* Tags & Metadata */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeStyle(course.level)}`}>
                      {course.level}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function getLevelBadgeStyle(level: string): string {
  const styles: Record<string, string> = {
    'Iniciante': 'bg-emerald-500/10 text-emerald-500',
    'Intermediário': 'bg-amber-500/10 text-amber-500',
    'Avançado': 'bg-rose-500/10 text-rose-500',
  };
  return styles[level] || 'bg-muted text-muted-foreground';
}
