# 🚀 Aprendi - Plataforma Educacional Open-Source

[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/) [![Node.js](https://img.shields.io/badge/Node.js-≥18-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/) [![Vitest](https://img.shields.io/badge/Vitest-4.0-6E9F18?style=for-the-badge&logo=vitest)](https://vitest.dev/) [![Zustand](https://img.shields.io/badge/Zustand-5.0-764ABC?style=for-the-badge)](https://zustand-demo.pmnd.rs/) [![License: MIT](https://img.shields.io/badge/License-MIT-00A0A0?style=for-the-badge)](LICENSE) ![Status](https://img.shields.io/badge/status-development-yellow?style=for-the-badge)

> **✨ Construído com Vibe Coding** - Este projeto foi desenvolvido com foco na experiência do desenvolvedor, uso de ferramentas modernas e fluxo de trabalho otimizado para produtividade e qualidade.

Aprendi é uma plataforma educacional open-source, construída pela comunidade, para a comunidade. Nosso foco: cursos práticos em Markdown, quizzes interativos, certificados simbólicos e uma experiência leve e acessível. ✨

## 🎯 Missão & Visão

### 🎯 **Missão**
Proporcionar educação acessível e gratuita para quem deseja aprender, sem barreiras técnicas ou financeiras.

### 👁️ **Visão**
Tornar-se referência em cursos gratuitos em português, com conteúdo de qualidade revisado pela comunidade e experiência de aprendizado envolvente.

## ❤️ **Valores do Projeto**

| Valor | Descrição |
|-------|-----------|
| 🎓 **Educação Acessível** | Conhecimento gratuito e de qualidade para todos |
| 🤝 **Comunidade First** | Colaboração e revisão aberta por autores e mantenedores |
| 🔓 **Transparência Total** | Código aberto e processos claros de contribuição |
| ⚡ **Inovação Contínua** | Tecnologias modernas para excelente experiência do usuário |
| 🎨 **Simplicidade Elegante** | Interface limpa, intuitiva e direta ao ponto |

## ✨ **Recursos Principais**

| Recurso | Descrição |
|---------|-----------|
| 📚 **Cursos em Markdown** | Conteúdo estruturado em arquivos `.md` fáceis de editar |
| ⏱️ **Quizzes Interativos** | Sistema com timer e regras de aprovação configuráveis |
| 🏆 **Certificados Exportáveis** | Geração de certificados em PNG com dados do aluno |
| 🔒 **Privacidade Garantida** | Progresso salvo localmente por perfil (não rastreamos) |
| 🌙 **Dark Mode Nativo** | Interface com suporte completo a temas claro/escuro |
| 📱 **Totalmente Responsivo** | Experiência otimizada para desktop e mobile |
| ⚡ **Performance Otimizada** | Carregamento rápido com Next.js 14 e caching inteligente |

## 🚀 **Comece Agora**

### 📋 **Pré-requisitos**

- Node.js >= 18.x
- npm ou yarn
- Git

### ⚡ **Instalação Rápida**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/aprendi.git
cd aprendi

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### 🛠️ **Comandos Úteis**

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run test         # Executa testes
npm run test:watch   # Modo watch para testes
npm run lint         # Verifica qualidade do código

# Produção
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção
npm run validate     # Valida estrutura dos cursos

# Utilitários
npm run type-check   # Verificação de tipos TypeScript
npm run test:coverage # Gera relatório de cobertura de testes
```

## 🏗️ **Arquitetura do Projeto**

```
aprendi/
├── content/                 # Conteúdo dos cursos
│   ├── courses/            # Cada curso em sua própria pasta
│   │   ├── meu-curso/      # Exemplo: estrutura de curso
│   │   │   ├── meta.yml    # Metadados do curso
│   │   │   ├── content.md  # Conteúdo em Markdown
│   │   │   ├── quiz.yml    # Perguntas do quiz (opcional)
│   │   │   └── cover.png   # Imagem de capa
│   └── instructors/        # Informações dos instrutores
├── src/                    # Código-fonte da aplicação
│   ├── app/               # Rotas e páginas (App Router)
│   ├── components/        # Componentes React reutilizáveis
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilitários e configurações
│   └── stores/           # Estado global (Zustand)
├── public/                # Assets estáticos
├── docs/                  # Documentação detalhada
├── scripts/              # Scripts de automação
└── tests/                # Testes automatizados
```

## 📖 **Documentação Detalhada**

### 📚 **Criando Conteúdo**
- [📝 Como Criar Cursos](docs/CRIAR_CURSOS.md) - Guia completo para criação de cursos
- [🎨 Boas Práticas de Conteúdo](#-boas-práticas-de-conteúdo)
- [📊 Estrutura de Metadados](docs/METADATA_STRUCTURE.md)

### 🎯 **Sistemas Especializados**
- [⏱️ Sistema de Quizzes](docs/QUIZ_TIMER_SYSTEM.md) - Timer, pontuação e aprovação
- [🏆 Exportação de Certificados](docs/CERTIFICATE_EXPORT_SOLUTION.md) - Geração de PNG
- [📈 Analytics & Comentários](docs/ANALYTICS_E_COMENTARIOS.md) - Engajamento e feedback

### 🔧 **Desenvolvimento**
- [⚙️ Configuração do Ambiente](docs/SETUP_DEVELOPMENT.md)
- [🧪 Guia de Testes](docs/TESTING_GUIDE.md)
- [🚀 Deployment](docs/DEPLOYMENT_GUIDE.md)

## 🤝 **Contribuindo para o Aprendi**

Adoramos contribuições! Siga estes passos:

1. **Fork** o repositório
2. **Clone** localmente: `git clone https://github.com/seu-usuario/aprendi.git`
3. **Crie uma branch**: `git checkout -b feat/nova-funcionalidade`
4. **Faça suas alterações** seguindo as convenções do projeto
5. **Teste suas mudanças**: `npm run test && npm run lint`
6. **Commit com mensagem clara**: `git commit -m "feat: adiciona nova funcionalidade"`
7. **Push para sua branch**: `git push origin feat/nova-funcionalidade`
8. **Abra um Pull Request** com descrição detalhada

📘 Leia nosso [CONTRIBUTING.md](CONTRIBUTING.md) para guidelines completas.

## 📝 **Boas Práticas de Conteúdo**

### 🎯 **Estrutura de Curso**
Cada curso deve conter:

```yaml
# meta.yml
title: "Nome do Curso"
description: "Descrição curta e atraente"
author: "Nome do Autor"
level: "iniciante|intermediário|avançado"
duration: "2 horas"
tags: ["tag1", "tag2"]
published: false  # Mude para true quando pronto!
```

### 🎨 **Assets Visuais**
- **Capa do curso**: `cover.png` (1200×630px) - Otimizado para redes sociais
- **Imagens internas**: Use formato WebP quando possível
- **Ícones**: Sistema de ícones do Lucide React

### ✍️ **Formatação de Conteúdo**
- Use Markdown com extensões GFM (GitHub Flavored Markdown)
- Inclua exemplos de código com syntax highlighting
- Adicone quizzes interativos para reforçar aprendizado
- Mantenha tom acessível e inclusivo

## 🧪 **Qualidade & Testes**

### ✅ **Pipeline de Qualidade**
```bash
# Fluxo completo de validação
npm run lint     # ESLint para padrões de código
npm run test     # Vitest para testes unitários
npm run type-check # TypeScript type checking
npm run validate # Validação de estrutura de cursos
```

### 📊 **Cobertura de Código**
- Testes unitários com Vitest
- Testes de componentes React
- Validação de schemas com Zod
- Cobertura alvo: >80%

## ⚖️ **Licença**

Distribuído sob licença MIT. Veja [LICENSE](LICENSE) para mais informações.

## 📞 **Suporte & Comunidade**

- 📖 **Documentação**: [docs/](docs/)
- 🐛 **Reportar Bugs**: [Issues](https://github.com/seu-usuario/aprendi/issues)
- 💡 **Sugestões**: [Discussions](https://github.com/seu-usuario/aprendi/discussions)
- 💬 **Chat**: [Discord/Slack] - *Adicione seu link aqui*

## 🌟 **Feito com Vibe Coding**

Este projeto foi desenvolvido seguindo princípios de **Vibe Coding**:
- 🎵 **Flow contínuo** - Ferramentas configuradas para desenvolvimento sem interrupções
- ⚡ **Feedback instantâneo** - Hot reload, testes rápidos e validação em tempo real
- 🎨 **Experiência visual** - UI/UX cuidadosamente planejada desde o início
- 🧩 **Modularidade** - Componentes reutilizáveis e estrutura escalável
- 🤝 **Colaboração feliz** - Convenções que facilitam trabalho em equipe

---

<div align="center">
  
**✨ Aprendi - Educação gratuita, código aberto, comunidade forte**

[Comece a contribuir](#-contribuindo-para-o-aprendi) •
[Explore a documentação](#-documentação-detalhada) •
[Crie seu primeiro curso](docs/CRIAR_CURSOS.md)

</div>