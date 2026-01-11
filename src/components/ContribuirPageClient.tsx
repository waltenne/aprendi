"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import {
  GitBranch, BookPlus, Bug, MessageSquare, Code, FileText, ArrowRight, Github, CheckCircle, Lightbulb, Users, Heart, Rocket, Terminal
} from 'lucide-react';

export function ContribuirPageClient() {
  const contributionTypes = [
    { icon: BookPlus, title: 'Criar Cursos', description: 'Compartilhe seu conhecimento criando novos cursos ou módulos para a plataforma.', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', link: '/docs/criar-cursos', linkText: 'Ver documentação completa', steps: ['Leia a documentação completa de criação', 'Faça um fork do repositório', 'Use o template em /content/courses/_template', 'Edite meta.yml, content.md e quiz.yml', 'Valide com npm run test', 'Envie um Pull Request detalhado'] },
    { icon: FileText, title: 'Melhorar Conteúdo', description: 'Revise e melhore cursos existentes, corrigindo erros, atualizando informações ou expandindo tópicos.', color: 'text-blue-500', bgColor: 'bg-blue-500/10', steps: ['Navegue pelos cursos existentes', 'Identifique melhorias ou correções', 'Edite os arquivos markdown apropriados', 'Teste as alterações localmente', 'Execute npm run validate', 'Descreva as mudanças no PR'] },
    { icon: Code, title: 'Contribuir com Código', description: 'Ajude a desenvolver novas funcionalidades, melhorias de UI/UX ou otimizações na plataforma.', color: 'text-purple-500', bgColor: 'bg-purple-500/10', steps: ['Confira as issues no GitHub', 'Comente na issue que quer trabalhar', 'Configure o ambiente de desenvolvimento', 'Implemente a solução seguindo os padrões', 'Escreva testes quando aplicável', 'Documente suas mudanças', 'Envie um Pull Request'] },
    { icon: Bug, title: 'Reportar Bugs', description: 'Encontrou um problema? Nos ajude reportando bugs, comportamentos inesperados ou sugestões de melhoria.', color: 'text-red-500', bgColor: 'bg-red-500/10', steps: ['Verifique se já não foi reportado', 'Crie uma issue no GitHub', 'Descreva o problema em detalhes', 'Inclua passos para reproduzir', 'Adicione screenshots se possível', 'Informe navegador e versão'] },
  ];
  const guidelines = [
    { icon: MessageSquare, title: 'Comunicação Respeitosa', description: 'Mantenha um tom amigável e construtivo em todas as interações.', color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
    { icon: CheckCircle, title: 'Qualidade', description: 'Garanta que suas contribuições seguem os padrões de qualidade do projeto.', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { icon: Lightbulb, title: 'Documentação', description: 'Documente suas mudanças e explique o raciocínio por trás delas.', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    { icon: Users, title: 'Colaboração', description: 'Esteja aberto a feedback e disposto a fazer ajustes quando necessário.', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  ];
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center">Carregando informações...</div>}>
      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-500">
              <GitBranch className="h-3 w-3 inline mr-1" />
              Como Contribuir
            </span>
          </div>
          <h1 className="text-3xl font-bold">Como Contribuir</h1>
          <p className="text-muted-foreground max-w-2xl">
            A Aprendi é um projeto aberto e colaborativo. Existem várias formas de contribuir, seja criando cursos, melhorando conteúdos, desenvolvendo código ou ajudando outros aprendizes.
          </p>
        </div>
        {/* Tipos de contribuição */}
        <section>
          <h2 className="text-xl font-bold mb-4">Formas de Contribuir</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contributionTypes.map((type, idx) => (
              <div key={idx} className={`p-4 rounded-xl bg-card border border-border flex flex-col gap-2 ${type.bgColor}`}>
                <div className={`flex items-center gap-2 ${type.color}`}>
                  <type.icon className="h-6 w-6" />
                  <span className="font-semibold text-lg">{type.title}</span>
                </div>
                <p className="text-muted-foreground text-sm">{type.description}</p>
                {type.link && (
                  <Link
                    href={type.link}
                    className="inline-flex items-center gap-2 mt-2 mb-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm border border-primary/80"
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' /></svg>
                    {type.linkText}
                  </Link>
                )}
                <ul className="list-disc pl-6 text-sm text-muted-foreground">
                  {type.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        {/* Diretrizes */}
        <section>
          <h2 className="text-xl font-bold mb-4">Diretrizes da Comunidade</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guidelines.map((g, idx) => (
              <div key={idx} className={`p-4 rounded-xl bg-card border border-border flex items-start gap-4 ${g.bgColor}`}>
                <div className={`p-2 rounded-lg ${g.color}`}>
                  <g.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{g.title}</h3>
                  <p className="text-muted-foreground text-sm">{g.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Call to action */}
        <div className="pt-8 flex justify-center">
          <Button asChild size="lg" className="px-8 h-12">
            <a href="https://github.com/porteraprendizado/pcursos" target="_blank" rel="noopener noreferrer">
              Contribua no GitHub
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </Suspense>
  );
}
