# Template de Curso

Este é o template base para criar novos cursos na plataforma.

## 🚀 Início Rápido

### 1. Copie este template:

```bash
cd content/courses
cp -r _template nome-do-seu-curso
cd nome-do-seu-curso
```

### 2. Edite os arquivos:

- **`meta.yml`** - Informações do curso (título, descrição, instrutor, etc.)
- **`content.md`** - Conteúdo educacional completo
- **`quiz.yml`** - Questionário final com timer

### 3. Adicione a capa (opcional):

- Crie um arquivo `cover.png` (1200x630px) nesta pasta
- Ou defina uma URL em `meta.yml` (`cover: "https://..."`)

### 4. Teste localmente:

```bash
npm run dev
# Acesse: http://localhost:3000/cursos/nome-do-seu-curso
```

### 5. Publique:

```yaml
# Em meta.yml, altere:
published: false  →  published: true
```

---

## 📁 Estrutura dos Arquivos

### meta.yml

Metadados do curso:

```yaml
id: "nome-do-curso"          # Deve corresponder ao nome da pasta
title: "Título do Curso"     # Nome completo
description: "Breve resumo"  # Máximo 160 caracteres
duration: "1h 30min"         # Tempo estimado
level: "iniciante"           # iniciante | intermediário | avançado
area: "DevOps"               # Ver src/lib/config/areas.ts
tags: ["Tag1", "Tag2"]       # 3-7 tags relevantes
published: false             # true para publicar
```

**Áreas disponíveis:**
- DevOps, Desenvolvimento, Dados, Cloud, Segurança
- Frontend, Backend, Mobile, Design, IA/ML
- Blockchain, IoT, Testes, Arquitetura
- Gestão, Carreira, Soft Skills, Produto
- Marketing, Vendas, Educação

### content.md

Conteúdo em Markdown com 10 seções:

1. 📚 **Introdução** - Contexto e overview
2. 🎯 **Objetivos** - O que será aprendido
3. 📖 **Conceitos Fundamentais** - Teoria base
4. 💻 **Primeiros Passos** - Prática inicial
5. 🎥 **Demonstração em Vídeo** - Tutorial visual
6. 🛠️ **Comandos Essenciais** - Referência rápida
7. 🔍 **Conceitos Avançados** - Tópicos complexos
8. ⚠️ **Troubleshooting** - Problemas comuns
9. 🎨 **Boas Práticas** - Guidelines
10. 📊 **Comparações** - Contexto de mercado
11. 🚀 **Próximos Passos** - Recursos adicionais
12. ✅ **Conclusão** - Recap e certificado

### quiz.yml

Questionário com timer:

```yaml
timeLimit: 600       # 10 minutos (em segundos)
passingScore: 70     # Nota mínima (70% recomendado)

questions:
  - id: 1
    question: "Sua pergunta aqui?"
    type: "multiple_choice_single"
    options:
      - text: "Opção A"
        correct: false
      - text: "Opção B (correta)"
        correct: true
    explanation: "Explicação da resposta"
```

**Tipos de questão:**
- `multiple_choice_single` - Apenas 1 resposta correta
- `true_false` - Verdadeiro ou Falso

### cover.png

Imagem de capa:
- **Resolução:** 1200x630px (proporção 1.9:1)
- **Formato:** PNG ou JPG
- **Tamanho:** Máximo 500KB
- **Detecção:** Automática se existir na pasta

---

## 📚 Documentação Completa

Para guia detalhado com exemplos e boas práticas:

👉 **[Leia a documentação completa: `/docs/CRIAR_CURSOS.md`](/docs/CRIAR_CURSOS.md)**

A documentação inclui:
- Estrutura completa de cada arquivo
- Exemplos de código Markdown
- Como adicionar imagens e vídeos
- Recursos avançados (HTML, layouts, callouts)
- Boas práticas de conteúdo e quiz
- Checklist de publicação
- Troubleshooting

---

## ✅ Checklist Rápido

Antes de publicar, verifique:

- [ ] Arquivo `meta.yml` completo
- [ ] Arquivo `content.md` com no mínimo 5 seções
- [ ] Arquivo `quiz.yml` com pelo menos 5 questões
- [ ] Imagem `cover.png` (1200x630px) adicionada
- [ ] ID corresponde ao nome da pasta
- [ ] Todos os exemplos de código testados
- [ ] Quiz testado do início ao fim
- [ ] Timer do quiz validado
- [ ] Links externos funcionando
- [ ] Imagens otimizadas (< 500KB cada)
- [ ] `published: true` em `meta.yml`

---

## 🎯 Dicas Rápidas

### Conteúdo:

✅ Comece do básico
✅ Use exemplos práticos
✅ Adicione imagens/diagramas
✅ Inclua vídeos quando possível
✅ Crie seções progressivas
✅ Termine com CTA para o quiz

### Quiz:

✅ Crie 10-15 questões
✅ Misture dificuldades
✅ Sempre explique respostas
✅ Teste o tempo você mesmo
✅ Evite pegadinhas

### Imagens:

✅ Use PNG para diagramas
✅ Use JPG para fotos
✅ Otimize tamanho (TinyPNG)
✅ Adicione alt text
✅ Máximo 1200px de largura

---

## 🛠️ Recursos de Markdown

### Código:

\`\`\`bash
comando --flag valor
\`\`\`

### Imagens:

```markdown
![Descrição](https://url-da-imagem.jpg)
```

### Vídeos YouTube:

```markdown
![](https://www.youtube.com/watch?v=VIDEO_ID)
```

### Callout de Dica:

```html
<div style="background: #f8f9fa; padding: 1.5rem; border-left: 4px solid #3B82F6; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>💡 Dica:</strong>
  <p>Conteúdo da dica aqui.</p>
</div>
```

### Tabelas:

```markdown
| Coluna 1 | Coluna 2 |
|----------|----------|
| Valor A  | Valor B  |
```

---

## 🔗 Links Úteis

- [Documentação Completa](/docs/CRIAR_CURSOS.md)
- [Guia de Markdown](https://www.markdownguide.org/)
- [YAML Validator](https://www.yamllint.com/)
- [TinyPNG - Comprimir Imagens](https://tinypng.com/)
- [Canva - Criar Capas](https://canva.com/)

---

## 💬 Precisa de Ajuda?

Entre em contato através das nossas redes sociais ou abra uma issue no GitHub.

**Boa sorte criando seu curso! 🚀**
