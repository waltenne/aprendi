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
# Aprendi

![Next.js](https://img.shields.io/badge/Next.js-14.2.35-000000?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node-%3E=18.0.0-339933?style=for-the-badge&logo=node.js)
![License: MIT](https://img.shields.io/badge/License-MIT-00A0A0?style=for-the-badge)

**Aprendi** é uma plataforma educacional open-source para criar e publicar cursos técnicos em Markdown, com quizzes, certificados e rastreamento de progresso.

**Por que usar**
- Conteúdo em Markdown com metadados (meta.yml) — fácil de manter.
- Feedback imediato com quizzes e timers.
- Sistema de progresso por sessão salvo no navegador.
- Design responsivo com suporte a dark mode.

**Índice**
- **Descrição**: visão geral do projeto
- **Instalação**: passos rápidos para rodar localmente
- **Contribuir**: veja [CONTRIBUTING.md](CONTRIBUTING.md)
- **Documentação**: guias em `docs/`

---

## ✨ Principais recursos

- Cursos estruturados em `content/courses/<slug>` (`meta.yml`, `content.md`, `quiz.yml`)
- Quizzes com timer e regras de aprovação
- Certificados exportáveis em PNG
- Sidebar com filtros e integração básica de analytics

## 🚀 Começando (desenvolvimento)

Pré-requisitos
- Node.js >= 18
- npm

Instalar dependências

```bash
npm install
```

Rodar em desenvolvimento

```bash
npm run dev
```

Build para produção

```bash
npm run build
npm start
```

Testes e validação

```bash
npm run test
npm run lint
npm run validate
```

## 📚 Documentação

- Guia para criar cursos: [docs/CRIAR_CURSOS.md](docs/CRIAR_CURSOS.md)
- Exportação de certificados: [docs/CERTIFICATE_EXPORT_SOLUTION.md](docs/CERTIFICATE_EXPORT_SOLUTION.md)
- Sistema de quiz: [docs/QUIZ_TIMER_SYSTEM.md](docs/QUIZ_TIMER_SYSTEM.md)
- Analytics e comentários: [docs/ANALYTICS_E_COMENTARIOS.md](docs/ANALYTICS_E_COMENTARIOS.md)

## 🤝 Como contribuir

Leia o guia de contribuição: [CONTRIBUTING.md](CONTRIBUTING.md)

Resumo rápido

1. Fork → clone → crie uma branch (`feature/nome`)
2. Faça mudanças pequenas e testáveis
3. Rode `npm run test` e `npm run lint`
4. Abra um PR descrevendo a mudança

## 📝 Boas práticas para conteúdo

- Cada curso fica em `content/courses/<slug>` com `meta.yml` e `content.md`.
- Use título, descrição curta, tags e `published: true` quando pronto.
- Adicione `cover.png` (1200×630) para melhor compartilhamento.

## ⚖️ Licença

MIT — veja `LICENSE`.

---

Se quiser, eu posso também adicionar um `CODE_OF_CONDUCT.md` e badges de CI (GitHub Actions).
### Type check
