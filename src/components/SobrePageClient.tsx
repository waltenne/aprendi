"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import {
  BookOpen, Target, Heart, Users, Sparkles, CheckCircle, Eye, Compass, ArrowRight, Code, Shield, Zap, Layers
} from 'lucide-react';

const values = [
  { icon: BookOpen, title: 'Educação Acessível', description: 'Conhecimento de qualidade deve ser gratuito e acessível para todos, sem barreiras.' },
  { icon: Users, title: 'Comunidade', description: 'Construído por pessoas apaixonadas por compartilhar conhecimento e ajudar outros.' },
  { icon: Shield, title: 'Transparência', description: 'Código aberto, conteúdo auditável e processos claros em tudo que fazemos.' },
  { icon: Sparkles, title: 'Inovação', description: 'Tecnologias modernas para uma experiência de aprendizado agradável e eficiente.' },
  { icon: Target, title: 'Qualidade', description: 'Conteúdo cuidadosamente elaborado e revisado pela comunidade.' },
  { icon: Zap, title: 'Simplicidade', description: 'Interface intuitiva e direta ao ponto, sem distrações desnecessárias.' },
];
const features = [
  'Cursos 100% gratuitos',
  'Quizzes interativos para fixação',
  'Certificados simbólicos de conclusão',
  'Progresso salvo localmente (sem servidor)',
  'Privacidade total - seus dados ficam no seu dispositivo',
  'Até 5 perfis independentes por navegador',
];

export function SobrePageClient() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center">Carregando informações...</div>}>
      <div className="p-6 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-rose-500/10 text-rose-500">
                <Heart className="h-3 w-3 inline mr-1" />
                Sobre o Projeto
              </span>
            </div>
            <h1 className="text-3xl font-bold">Sobre a Aprendi</h1>
            <p className="text-muted-foreground max-w-2xl">
              A Aprendi nasceu da vontade de democratizar o acesso ao conhecimento.
              Somos uma plataforma educacional gratuita, criada pela comunidade para a comunidade,
              com o objetivo de transformar vidas através da educação.
            </p>
          </div>
          {/* Missão e Visão lado a lado */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Missão */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <Compass className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Nossa Missão</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Proporcionar acesso gratuito a conteúdo educacional de qualidade,
                permitindo que qualquer pessoa possa aprender novas habilidades
                no seu próprio ritmo, sem barreiras financeiras ou geográficas.
                Acreditamos que a educação é o caminho mais poderoso para
                transformar vidas e construir um futuro melhor.
              </p>
            </div>
            {/* Visão */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
                  <Eye className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Nossa Visão</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Ser a principal plataforma de educação gratuita em português,
                reconhecida pela qualidade do conteúdo e pelo impacto positivo
                na vida das pessoas. Queremos construir uma comunidade global
                de aprendizes e colaboradores que acreditam no poder da
                educação aberta e acessível.
              </p>
            </div>
          </section>
          {/* Valores */}
          <section>
            <h2 className="text-xl font-bold mb-4">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {values.map((value, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-card border border-border flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* Features */}
          <section>
            <h2 className="text-xl font-bold mb-4">Diferenciais</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc pl-6">
              {features.map((feature, idx) => (
                <li key={idx} className="text-muted-foreground">{feature}</li>
              ))}
            </ul>
          </section>
          {/* Call to action */}
          <div className="pt-8 flex justify-center">
            <Button asChild size="lg" className="px-8 h-12">
              <Link href="/contribuir">
                Como Contribuir
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </Suspense>
  );
}
