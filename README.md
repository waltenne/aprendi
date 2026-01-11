# PCursos - Plataforma Educacional

Plataforma educacional gratuita com cursos, quizzes interativos e certificados simbólicos.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Zod** para validação
- **remark/rehype** para Markdown

## 📁 Estrutura do Projeto

```
pcursos/
├── content/                    # Conteúdo versionado
│   ├── instructors/           # Dados dos instrutores
│   │   └── instructors.yml
│   └── courses/               # Cursos
│       └── [slug]/
│           ├── meta.yml       # Metadados do curso
│           ├── content.md     # Conteúdo em Markdown
│           └── quiz.yml       # Quiz do curso
├── src/
│   ├── app/                   # App Router (páginas)
│   ├── components/
│   │   ├── ui/               # Componentes base (shadcn)
│   │   ├── courses/          # Componentes de curso
│   │   └── layout/           # Header, Footer
│   ├── hooks/                # React hooks
│   └── lib/
│       ├── loaders/          # Carregamento de dados
│       ├── schemas/          # Schemas Zod
│       └── utils.ts          # Utilitários
└── public/                   # Assets estáticos
```

## 🎯 Funcionalidades

### ✨ Sistema de Cursos
- ✅ Cursos com conteúdo em Markdown enriquecido
- ✅ Detecção automática de cover.png (1200x630px)
- ✅ Configuração global de áreas (ícones e cores em areas.ts)
- ✅ Suporte a imagens, vídeos YouTube, código, tabelas
- ✅ Callouts HTML coloridos (dica, aviso, erro, sucesso)
- ✅ Layouts personalizados (2 e 3 colunas)
- ✅ Progresso de leitura salvo por perfil

### 🎮 Sistema de Quiz com Timer
- ✅ Timer regressivo configurável (segundos)
- ✅ 5 estados: not_started, in_progress, finished, expired
- ✅ Countdown visual com mudança de cor (< 60s)
- ✅ Modal de expiração com auto-reload em 5s
- ✅ Progresso circular SVG no modal
- ✅ Bloqueio de interações ao expirar
- ✅ Sistema de reset para refazer ilimitadamente
- ✅ Nota de aprovação configurável (70% padrão)
- ✅ Tipos de questões: multiple_choice_single, true_false
- ✅ Explicações detalhadas para cada resposta

### 🏆 Sistema de Certificados
- ✅ Geração automática após aprovação (nota ≥ 70%)
- ✅ Design elegante com gradiente e logo
- ✅ Informações: nome, curso, data, nota, instrutor
- ✅ Download em PNG de alta qualidade (html-to-image)
- ✅ Otimização de export (cache de canvas)
- ✅ Compartilhável em redes sociais
- ✅ Layout responsivo sem scrollbar

### 👤 Sistema de Perfis
- ✅ Múltiplos perfis de usuário
- ✅ Progresso isolado por perfil
- ✅ Criação, edição e exclusão de perfis
- ✅ Avatar personalizado por perfil
- ✅ Sincronização com localStorage

### 📊 Analytics e Tracking
- ✅ Integração com Umami Analytics
- ✅ Tracking de eventos: visualização, progresso, conclusão, quiz, certificado
- ✅ GitHub stats na sidebar (com cache de 5min)
- ✅ Estatísticas de cursos (total, concluídos, favoritos)

### 🎨 Interface e UX
- ✅ Design responsivo e elegante
- ✅ Animações Tailwind (fade-in, slide-in, zoom-in, scale, pulse, bounce)
- ✅ Dark mode e light mode
- ✅ Sidebar com stats do GitHub (stars, forks, watching)
- ✅ Cards de cursos com hover effects
- ✅ Layout h-screen sem scrollbar nas páginas principais
- ✅ Gradientes e cores por área de conhecimento

### 🔧 Tecnologia
- ✅ Validação de dados com Zod em build time
- ✅ SSG (Static Site Generation)
- ✅ TypeScript strict mode
- ✅ Hooks customizados (useProgress, useProfile, useQuizTimer, useUmamiTrack)
- ✅ API Routes para covers dinâmicos
- ✅ Schemas compartilhados (course, quiz, instructor)

## 🛠️ Desenvolvimento

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Type check

```bash
npm run type-check
```
## 🚀 Deploy

Este projeto está configurado para deploy automático no **GitHub Pages**.

### Deploy Automático

O projeto usa GitHub Actions para build e deploy automático:
- ✅ Todo push/merge na branch `main` dispara o workflow
- ✅ Executa testes e validações automaticamente
- ✅ Faz build otimizado do Next.js (static export)
- ✅ Deploy no GitHub Pages em ~2-5 minutos

### Guias Completos

- **[📖 Guia de Deploy](./DEPLOY.md)** - Configuração detalhada do GitHub Pages
- **[🤝 Guia de Contribuição](./CONTRIBUTING.md)** - Como contribuir com o projeto

### Configuração Rápida

1. Vá em **Settings** → **Pages** no seu repositório
2. Em **Source**, selecione **GitHub Actions**
3. Se o repositório não for `username.github.io`, ajuste o `basePath` em `next.config.js`
4. Faça push na `main` - deploy automático! 🎉

### Para Contribuidores

Qualquer usuário pode contribuir:
- **Fork + Pull Request**: Para contribuidores externos
- **Branch + Merge**: Para colaboradores com acesso write

Após aprovação do PR, o deploy é automático!
## � Documentação

### Para Criadores de Cursos

- **[📖 Guia Completo: Como Criar Cursos](/docs/CRIAR_CURSOS.md)** - Documentação detalhada com exemplos, boas práticas e checklist de publicação
- **[🎨 Guia de Conteúdo](/GUIA_CONTEUDO.md)** - Como adicionar imagens, vídeos e layouts personalizados
- **[📋 Template README](/content/courses/_template/README.md)** - Início rápido para criar um novo curso

### Para Desenvolvedores

- **[🎮 Sistema de Quiz com Timer](/docs/QUIZ_TIMER_SYSTEM.md)** - Arquitetura e funcionamento do sistema de quiz
- **[🏆 Sistema de Certificados](/docs/CERTIFICATE_SYSTEM.md)** - Como funciona a geração de certificados
- **[⚙️ Configuração de Áreas](/src/lib/config/areas.ts)** - Áreas globais com ícones e cores

### Início Rápido

**1. Copie o template:**
```bash
cd content/courses
cp -r _template nome-do-seu-curso
```

**2. Edite os arquivos:**
- `meta.yml` - Informações do curso
- `content.md` - Conteúdo educacional (10 seções)
- `quiz.yml` - Questionário com timer

**3. Adicione a capa (opcional):**
- Crie `cover.png` (1200x630px) na pasta do curso

**4. Publique:**
```yaml
# Em meta.yml:
published: true
```

### Estrutura dos Arquivos

#### meta.yml
```yaml
id: "nome-do-curso"          # Slug para URL
title: "Título Completo"     # Nome exibido
description: "Breve resumo"  # Máximo 160 caracteres
duration: "1h 30min"         # Tempo estimado
level: "intermediário"       # iniciante | intermediário | avançado
area: "DevOps"               # Ver /src/lib/config/areas.ts
tags: ["Tag1", "Tag2"]       # 3-7 tags
instructor:
  name: "Seu Nome"
  avatar: "https://github.com/usuario.png"
  bio: "Breve bio"
published: true              # Visível na listagem
```

#### quiz.yml
```yaml
timeLimit: 600               # 10 minutos (em segundos)
passingScore: 70             # Nota mínima para aprovação

questions:
  - id: 1
    question: "Sua pergunta?"
    type: "multiple_choice_single"
    options:
      - text: "Opção A"
        correct: false
      - text: "Opção B (correta)"
        correct: true
    explanation: "Explicação da resposta"
```

## 📝 Adicionando Novos Cursos (Resumo Rápido)

1. ✅ Copie o template: `content/courses/_template` → `content/courses/seu-curso`
2. ✅ Edite `meta.yml`, `content.md`, `quiz.yml`
3. ✅ Adicione `cover.png` (1200x630px)
4. ✅ Teste localmente: `npm run dev`
5. ✅ Publique: `published: true` em meta.yml

**📖 Leia a [documentação completa](/docs/CRIAR_CURSOS.md) para guia detalhado!**
  description: Descrição do quiz
  time_limit: 600 # segundos
  passing_score: 70 # porcentagem
  questions:
    - id: q1
      type: multiple_choice_single
      question: Pergunta aqui?
      options:
        - Opção A
        - Opção B (correta)
        - Opção C
      correct_answer: 1
      explanation: Explicação da resposta
      points: 10
```

## 🌐 Deploy

O projeto está configurado para deploy no Vercel:

```bash
npm run build
```

O output será gerado em modo estático (`output: 'export'`).

## 📄 Progresso do Usuário

O progresso é salvo em localStorage com a seguinte estrutura:

```
pcursos:progress:{courseSlug}
```

Dados salvos:
- Seções lidas
- Resultado do quiz
- Certificado gerado
- Nome do usuário

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📜 Licença

MIT
