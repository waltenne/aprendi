import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  BookPlus,
  FileText,
  CheckCircle,
  AlertCircle,
  Code,
  FolderTree,
  ArrowLeft,
  Terminal,
  FileCode,
  Play,
  Lightbulb,
  List,
  HelpCircle,
  Layers,
  Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Como Criar Cursos',
  description: 'Documentação completa para criar e publicar cursos na plataforma Aprendi.',
};

export default function CriarCursosPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <section className="px-6 py-12">
        <Link 
          href="/contribuir"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para Como Contribuir
        </Link>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-500">
              <BookPlus className="h-3 w-3 inline mr-1" />
              Documentação
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Como Criar Cursos
          </h1>
          <p className="text-lg text-muted-foreground">
            Guia completo para criar, estruturar e publicar cursos de qualidade na plataforma Aprendi.
          </p>
        </div>
      </section>

      {/* Requisitos */}
      <section className="px-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <h2 className="text-2xl font-bold">Antes de Começar</h2>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border space-y-4">
            <p className="text-muted-foreground">
              Certifique-se de ter o ambiente de desenvolvimento configurado:
            </p>
            <ul className="space-y-2">
              {[
                'Node.js 18+ instalado',
                'Git configurado',
                'Fork do repositório feito',
                'Conhecimento básico de Markdown e YAML',
                'Editor de código (VS Code recomendado)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Estrutura de Pastas */}
      <section className="px-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-blue-500" />
            <h2 className="text-2xl font-bold">Estrutura de Pastas</h2>
          </div>
          <p className="text-muted-foreground">
            Cada curso deve seguir esta estrutura dentro de <code className="px-2 py-1 rounded bg-muted">/content/courses/</code>:
          </p>
          <div className="p-6 rounded-xl bg-card border border-border">
            <pre className="text-sm overflow-x-auto">
              <code className="font-mono text-foreground dark:text-emerald-400">
{`seu-curso/
├── meta.yml          # Metadados do curso (obrigatório)
├── content.md        # Conteúdo principal (obrigatório)
├── quiz.yml          # Perguntas do quiz (obrigatório)
└── cover.png         # Imagem de capa 1200x630px (opcional)`}
              </code>
            </pre>
          </div>
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-3">
            <Lightbulb className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-500">Dica</p>
              <p className="text-sm text-muted-foreground">
                Use o template em <code className="px-2 py-1 rounded bg-muted">/content/courses/_template</code> como ponto de partida.
                Copie toda a pasta e renomeie com o slug do seu curso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Arquivo meta.yml */}
      <section className="px-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-purple-500" />
            <h2 className="text-2xl font-bold">Arquivo meta.yml</h2>
          </div>
          <p className="text-muted-foreground">
            Define as informações e metadados do curso:
          </p>
          <div className="p-6 rounded-xl bg-card border border-border space-y-4">
            <pre className="text-sm overflow-x-auto">
              <code className="font-mono text-foreground dark:text-emerald-400">
{`# ID único (slug para URL)
id: "nome-do-curso"

# Informações gerais
title: "Título do Curso"
description: "Descrição breve (máx. 160 caracteres)"
duration: "1h 30min"  # Formato: "XXh YYmin"
level: "iniciante"     # iniciante | intermediário | avançado

# Área do conhecimento (ícone e cor automáticos)
# DevOps, Desenvolvimento, Dados, Cloud, Segurança
# Frontend, Backend, Mobile, Design, IA/ML, etc.
area: "DevOps"

# Tags para busca (3-7 tags)
tags:
  - "Docker"
  - "Containers"
  - "DevOps"

# Instrutor
instructor:
  name: "Seu Nome"
  avatar: "https://github.com/usuario.png"
  bio: "Especialista em DevOps"
  social:
    github: "https://github.com/usuario"
    linkedin: "https://linkedin.com/in/usuario"

# Publicação
published: true
publishedAt: "2026-01-10"
`}
              </code>
            </pre>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Campos obrigatórios:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>id:</strong> Slug único para URL (apenas letras minúsculas, números e hífens)</li>
                <li>• <strong>title:</strong> Título claro e descritivo (máx. 60 caracteres)</li>
                <li>• <strong>description:</strong> Resumo do que será aprendido (máx. 160 caracteres)</li>
                <li>• <strong>duration:</strong> Formato "XXh YYmin" ou apenas "XXmin"</li>
                <li>• <strong>level:</strong> iniciante, intermediário ou avançado</li>
                <li>• <strong>area:</strong> Área do conhecimento (define ícone e cor automaticamente)</li>
                <li>• <strong>tags:</strong> Array de strings para busca (3-7 tags recomendado)</li>
                <li>• <strong>instructor:</strong> name, avatar e bio do instrutor</li>
                <li>• <strong>published:</strong> true para publicar, false para rascunho</li>
              </ul>
              <h3 className="font-semibold text-sm mt-4">Novidades:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✨ <strong>Cover automático:</strong> Basta adicionar cover.png (1200x630px) na pasta do curso</li>
                <li>✨ <strong>Áreas globais:</strong> Não precisa definir icon e color, são automáticos!</li>
                <li>✨ <strong>20+ áreas disponíveis:</strong> Ver /src/lib/config/areas.ts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Arquivo content.md */}
      <section className="px-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-500" />
            <h2 className="text-2xl font-bold">Arquivo content.md</h2>
          </div>
          <p className="text-muted-foreground">
            Contém o conteúdo didático do curso em formato Markdown:
          </p>
          <div className="p-6 rounded-xl bg-card border border-border space-y-4">
            <h3 className="font-semibold">Estrutura recomendada:</h3>
            <div className="space-y-3">
              {[
                { icon: List, title: 'Introdução', desc: 'Contexto, motivação e objetivos de aprendizado' },
                { icon: Layers, title: 'Seções do Conteúdo', desc: 'Divida em seções lógicas com títulos claros (## Seção)' },
                { icon: Code, title: 'Exemplos Práticos', desc: 'Use blocos de código com syntax highlighting' },
                { icon: Lightbulb, title: 'Dicas e Alertas', desc: 'Destaque informações importantes' },
                { icon: Award, title: 'Conclusão', desc: 'Resume o aprendizado e próximos passos' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <item.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-500">Importante</p>
                <p className="text-sm text-muted-foreground">
                  Use títulos ## para seções principais. Cada seção será rastreada para progresso do aluno.
                  Evite parágrafos muito longos - divida em blocos digestíveis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Arquivo quiz.yml */}
      <section className="px-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-rose-500" />
            <h2 className="text-2xl font-bold">Arquivo quiz.yml</h2>
          </div>
          <p className="text-muted-foreground">
            Define o quiz de avaliação do curso:
          </p>
          <div className="p-6 rounded-xl bg-card border border-border space-y-4">
            <pre className="text-sm overflow-x-auto">
              <code className="font-mono text-foreground dark:text-emerald-400">
{`# Timer regressivo em segundos
# 300s (5min) = 8-10 questões
# 600s (10min) = 15-20 questões
# 900s (15min) = 25-30 questões
timeLimit: 600

# Nota mínima para aprovação (0-100)
# 60% = iniciante, 70% = padrão, 80% = avançado
passingScore: 70

questions:
  # Múltipla escolha (apenas 1 correta)
  - id: 1
    question: "O que é Docker?"
    type: "multiple_choice_single"
    options:
      - text: "Uma linguagem de programação"
        correct: false
      - text: "Uma plataforma de containerização"
        correct: true
      - text: "Um sistema operacional"
        correct: false
    explanation: "Docker é uma plataforma..."
  
  # Verdadeiro ou Falso
  - id: 2
    question: "Containers compartilham o kernel?"
    type: "true_false"
    options:
      - text: "Verdadeiro"
        correct: true
      - text: "Falso"
        correct: false
    explanation: "Containers compartilham..."
`}
              </code>
            </pre>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Boas práticas:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>Quantidade:</strong> 10-15 questões ideal (5 mínimo)</li>
                <li>• <strong>Timer:</strong> ~30-40 segundos por questão (600s para 15 questões)</li>
                <li>• <strong>Tipos:</strong> multiple_choice_single ou true_false</li>
                <li>• <strong>IDs únicos:</strong> Cada questão precisa de um ID sequencial</li>
                <li>• <strong>Explicações:</strong> Sempre forneça explicações detalhadas</li>
                <li>• <strong>Marcar correta:</strong> Use correct: true, não índices numéricos</li>
                <li>• <strong>Nota mínima:</strong> 70% recomendado (aprovação padrão)</li>
                <li>• <strong>Evite pegadinhas:</strong> Teste conhecimento real, não truques</li>
              </ul>
              <h3 className="font-semibold text-sm mt-4">Sistema de Timer:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Timer regressivo com countdown visual (MM:SS)</li>
                <li>✅ Muda para vermelho quando &lt; 60 segundos</li>
                <li>✅ Modal de expiração com auto-reload em 5s</li>
                <li>✅ Bloqueia respostas ao expirar</li>
                <li>✅ Pode refazer ilimitadas vezes</li>
                <li>✅ Certificado após aprovação (nota ≥ passingScore)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Validação e Testes */}
      <section className="px-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-500" />
            <h2 className="text-2xl font-bold">Validação e Testes</h2>
          </div>
          <p className="text-muted-foreground">
            Antes de submeter seu curso, execute os testes de validação:
          </p>
          <div className="space-y-3">
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                Instalar dependências
              </h3>
              <code className="block bg-muted p-3 rounded-md text-sm font-mono text-foreground dark:bg-black/30 dark:text-emerald-400">
                npm install
              </code>
            </div>
            
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                Executar servidor de desenvolvimento
              </h3>
              <code className="block bg-muted p-3 rounded-md text-sm font-mono text-foreground dark:bg-black/30 dark:text-emerald-400">
                npm run dev
              </code>
              <p className="text-sm text-muted-foreground mt-2">
                Acesse http://localhost:3000 e teste seu curso
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                Validar arquivos YAML e Markdown
              </h3>
              <code className="block bg-muted p-3 rounded-md text-sm font-mono text-foreground dark:bg-black/30 dark:text-emerald-400">
                npm run validate
              </code>
              <p className="text-sm text-muted-foreground mt-2">
                Verifica sintaxe e estrutura dos arquivos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="px-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <h2 className="text-2xl font-bold">Checklist de Qualidade</h2>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <p className="text-muted-foreground mb-4">
              Verifique todos os itens antes de submeter:
            </p>
            <div className="space-y-2">
              {[
                'Todos os arquivos obrigatórios estão presentes',
                'meta.yml com todas as informações preenchidas',
                'Conteúdo dividido em seções claras com ##',
                'Quiz com pelo menos 5 questões bem elaboradas',
                'Código de exemplo testado e funcional',
                'Ortografia e gramática revisadas',
                'Links externos verificados e funcionando',
                'Imagens otimizadas (se houver)',
                'Validação executada sem erros',
                'Curso testado localmente do início ao fim',
              ].map((item) => (
                <label key={item} className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enviar Pull Request */}
      <section className="px-6 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-purple-500" />
            <h2 className="text-2xl font-bold">Enviar Pull Request</h2>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 space-y-4">
            <p className="text-muted-foreground">
              Depois de validar e testar seu curso:
            </p>
            <ol className="space-y-3">
              {[
                { cmd: 'git add .', desc: 'Adicione seus arquivos' },
                { cmd: 'git commit -m "feat: adiciona curso [nome-do-curso]"', desc: 'Faça o commit' },
                { cmd: 'git push origin sua-branch', desc: 'Envie para seu fork' },
              ].map((step, index) => (
                <li key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{step.desc}</span>
                  </div>
                  <code className="block bg-muted p-3 rounded-md text-sm font-mono text-foreground dark:bg-black/30 dark:text-emerald-400 ml-8">
                    {step.cmd}
                  </code>
                </li>
              ))}
            </ol>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Abra o Pull Request no GitHub e inclua:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Título descritivo do curso</li>
                <li>• Descrição do que será ensinado</li>
                <li>• Nível de dificuldade</li>
                <li>• Checklist de validação preenchido</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-12">
        <div className="p-8 rounded-xl bg-card border border-border text-center space-y-4">
          <h2 className="text-2xl font-bold">Dúvidas?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Se tiver alguma dúvida durante o processo de criação do curso, 
            abra uma issue no GitHub ou entre em contato com a comunidade.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/contribuir">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <Button asChild>
              <a 
                href="https://github.com/waltenne/aprendi/issues" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Abrir Issue
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
