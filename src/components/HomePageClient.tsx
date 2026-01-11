"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Suspense } from 'react';

export function HomePageClient() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center">Carregando...</div>}>
      <div>
        {/* Hero Section */}
        <section className="relative px-6 py-16 overflow-hidden min-h-[85vh] flex items-center">
          {/* Background com gradiente animado */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative max-w-4xl mx-auto text-center space-y-6 w-full">
            {/* Logo com animação sutil */}
            <div className="flex justify-center animate-in fade-in zoom-in duration-700">
              <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                <Image
                  src="/images/logo.png"
                  alt="Aprendi Logo"
                  fill
                  className="object-contain drop-shadow-2xl transition-transform hover:scale-105 duration-300"
                  priority
                />
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Plataforma 100% Gratuita</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Aprenda gratuitamente
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Cursos de qualidade com certificados para impulsionar sua carreira
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" className="text-base px-8 h-12 shadow-lg shadow-primary/25" asChild>
                <Link href="/cursos">
                  Explorar Cursos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
                <Link href="/sobre">
                  Sobre o Projeto
                </Link>
              </Button>
            </div>
            {/* Mini indicadores */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Sem custos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Com certificado</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Conteúdo de qualidade</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Suspense>
  );
}
