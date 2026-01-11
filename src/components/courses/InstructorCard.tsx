'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github, Linkedin, Twitter, Globe, ExternalLink, BookOpen, User } from 'lucide-react';
import type { Instructor } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface InstructorCardProps {
  instructor: Instructor;
  courseCount?: number;
  className?: string;
}

/**
 * Card de exibição de instrutor - Estilo Square UI
 */
export function InstructorCard({ instructor, courseCount, className }: InstructorCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    website: Globe,
  };

  return (
    <div
      className={cn(
        'group p-5 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
        className
      )}
    >
      <Link href={`/instrutores/${instructor.id}`} className="block">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/20 to-purple-500/20">
            {instructor.avatar && !imageError ? (
              <Image
                src={instructor.avatar}
                alt={instructor.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                unoptimized={instructor.avatar.startsWith('/api/')}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-600">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold group-hover:text-primary transition-colors truncate">
              {instructor.name}
            </h3>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mt-1.5 border border-primary/20">
              {instructor.role}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-3 min-h-[2.5rem]">
          {instructor.bio}
        </p>
      </Link>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
        {/* Redes sociais */}
        <div className="flex gap-2">
          {instructor.social && Object.entries(instructor.social).map(([key, url]) => {
            if (!url) return null;
            const Icon = socialIcons[key as keyof typeof socialIcons] || ExternalLink;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label={key}
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            );
          })}
        </div>

        {/* Contagem de cursos */}
        {courseCount !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <BookOpen className="h-3.5 w-3.5" />
            {courseCount} {courseCount === 1 ? 'curso' : 'cursos'}
          </div>
        )}
      </div>
    </div>
  );
}
