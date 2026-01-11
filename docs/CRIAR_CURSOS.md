# 📚 Guia Completo: Como Criar Cursos

Este guia contém todas as informações necessárias para criar cursos completos e de alta qualidade na plataforma.

## 📋 Índice

1. [Estrutura de Pastas](#estrutura-de-pastas)
2. [Arquivo meta.yml](#arquivo-metayml)
3. [Arquivo content.md](#arquivo-contentmd)
4. [Arquivo quiz.yml](#arquivo-quizyml)
5. [Imagem de Capa (cover.png)](#imagem-de-capa-coverpng)
6. [Recursos Avançados](#recursos-avançados)
7. [Boas Práticas](#boas-práticas)
8. [Checklist de Publicação](#checklist-de-publicação)

---

## 🗂️ Estrutura de Pastas

Cada curso deve ter a seguinte estrutura:

```
content/courses/
└── nome-do-curso/          # ID do curso (slug URL-friendly)
    ├── meta.yml            # Metadados do curso (obrigatório)
    ├── content.md          # Conteúdo do curso (obrigatório)
    ├── quiz.yml            # Questionário final (obrigatório)
    └── cover.png           # Imagem de capa (opcional mas recomendado)
```

### Como criar um novo curso:

1. **Copie o template:**
   ```bash
   cd content/courses
   cp -r _template nome-do-seu-curso
   cd nome-do-seu-curso
   ```

2. **O nome da pasta será o ID do curso** (usado na URL): `/cursos/nome-do-seu-curso`

3. **Edite os 3 arquivos obrigatórios:**
   - `meta.yml` - Informações sobre o curso
   - `content.md` - Conteúdo educacional
   - `quiz.yml` - Questionário final

4. **Adicione a capa (opcional):**
   - Crie/coloque um arquivo `cover.png` na pasta do curso

---

## 📄 Arquivo meta.yml

Este arquivo contém todos os metadados do curso.

### Estrutura Completa:

```yaml
# ==============================================================================
# IDENTIFICAÇÃO DO CURSO
# ==============================================================================

# ID único do curso (deve corresponder ao nome da pasta)
# Usado na URL: /cursos/[id]
# Apenas letras minúsculas, números e hífens
id: "nome-do-curso"

# ==============================================================================
# INFORMAÇÕES GERAIS
# ==============================================================================

# Título completo do curso (aparece no card e na página do curso)
title: "Título Completo do Curso"

# Descrição curta (1-2 frases, máximo 160 caracteres)
# Aparece no card de listagem e meta tags SEO
description: "Aprenda os conceitos fundamentais e práticos de [tecnologia]"

# Duração estimada do curso
# Formato: "XXh YYmin" ou apenas "XXmin"
# Exemplos: "2h 30min", "45min", "1h"
duration: "45min"

# Nível de dificuldade
# Valores aceitos: "iniciante", "intermediário", "avançado"
level: "iniciante"

# ==============================================================================
# CATEGORIZAÇÃO
# ==============================================================================

# Área do conhecimento (define ícone e cor automaticamente)
# IMPORTANTE: Não precisa definir 'icon' e 'color' separadamente!
# As cores e ícones são configurados globalmente em src/lib/config/areas.ts
#
# Áreas disponíveis:
# - DevOps          (Server, laranja)
# - Desenvolvimento (Code, azul)
# - Dados          (Database, roxo)
# - Cloud          (Cloud, ciano)
# - Segurança      (Shield, vermelho)
# - Frontend       (Layout, rosa)
# - Backend        (Terminal, verde escuro)
# - Mobile         (Smartphone, índigo)
# - Design         (Palette, rosa claro)
# - IA/ML          (Brain, roxo escuro)
# - Blockchain     (Link, amarelo)
# - IoT            (Cpu, verde claro)
# - Testes         (CheckCircle, teal)
# - Arquitetura    (Network, cinza)
# - Gestão         (Briefcase, marrom)
# - Carreira       (TrendingUp, azul escuro)
# - Soft Skills    (Users, azul claro)
# - Produto        (Package, laranja escuro)
# - Marketing      (Megaphone, rosa escuro)
# - Vendas         (ShoppingCart, verde)
# - Educação       (GraduationCap, índigo)
area: "DevOps"

# ==============================================================================
# IMAGEM DE CAPA
# ==============================================================================

# A plataforma detecta a capa automaticamente em 3 formatos (na ordem de prioridade):
#
# 1. cover.png na pasta do curso (RECOMENDADO)
#    - Resolução: 1200x630px
#    - Formato: PNG com transparência ou JPG
#    - A plataforma detecta automaticamente se o arquivo existir
#
# 2. URL externa (se não houver cover.png local)
#    cover: "https://exemplo.com/imagem.jpg"
#
# 3. Placeholder automático (se nada for definido)
#    - Gerado automaticamente com a cor da área
#
# RECOMENDAÇÃO: Use sempre cover.png local para melhor performance!

# ==============================================================================
# TAGS
# ==============================================================================

# Tags para busca e categorização (array de strings)
# Use de 3 a 7 tags relevantes
# Primeira letra maiúscula, sem acentos em siglas
tags:
  - "Docker"
  - "Containers"
  - "DevOps"
  - "Linux"

# ==============================================================================
# INSTRUTOR
# ==============================================================================

instructor:
  # Nome completo do instrutor
  name: "Seu Nome"
  
  # URL da foto de perfil
  # Recomendado: 400x400px, formato circular
  avatar: "https://github.com/usuario.png"
  
  # Bio curta (1-2 frases)
  bio: "Especialista em DevOps com 10+ anos de experiência"
  
  # Redes sociais (opcional)
  social:
    github: "https://github.com/usuario"
    linkedin: "https://linkedin.com/in/usuario"
    twitter: "https://twitter.com/usuario"

# ==============================================================================
# STATUS DE PUBLICAÇÃO
# ==============================================================================

# Define se o curso aparece na listagem pública
# true = publicado e visível para todos
# false = rascunho, visível apenas para administradores
published: true

# Data de publicação (opcional)
# Formato ISO: YYYY-MM-DD
publishedAt: "2024-01-15"

# Data da última atualização (opcional)
# Atualizada automaticamente se não definida
updatedAt: "2024-01-20"
```

### Exemplos Reais:

**Curso de DevOps:**
```yaml
id: "docker-essencial"
title: "Docker Essencial"
description: "Domine containers e revolucione seu desenvolvimento"
duration: "1h 30min"
level: "intermediário"
area: "DevOps"
tags: ["Docker", "Containers", "DevOps", "Microservices"]
instructor:
  name: "João Silva"
  avatar: "https://github.com/joaosilva.png"
  bio: "DevOps Engineer na XYZ Corp"
published: true
```

**Curso de Desenvolvimento:**
```yaml
id: "react-hooks"
title: "React Hooks na Prática"
description: "Aprenda a criar aplicações modernas com React Hooks"
duration: "2h"
level: "intermediário"
area: "Desenvolvimento"
tags: ["React", "JavaScript", "Frontend", "Hooks"]
instructor:
  name: "Maria Santos"
  avatar: "https://github.com/mariasantos.png"
  bio: "Frontend Developer com foco em React"
published: true
```

---

## 📝 Arquivo content.md

Este arquivo contém todo o conteúdo educacional do curso em Markdown.

### Estrutura Recomendada:

O template fornece uma estrutura com 10 seções principais:

1. **📚 Introdução** - Contexto e overview
2. **🎯 Objetivos de Aprendizagem** - Checklist do que será aprendido
3. **📖 Conceitos Fundamentais** - Teoria base
4. **💻 Primeiros Passos na Prática** - Hands-on inicial
5. **🎥 Demonstração em Vídeo** - Conteúdo audiovisual
6. **🛠️ Comandos Essenciais** - Referência rápida
7. **🔍 Conceitos Avançados** - Tópicos mais complexos
8. **⚠️ Problemas Comuns e Soluções** - Troubleshooting
9. **🎨 Boas Práticas** - Guidelines e recomendações
10. **📊 Comparações e Alternativas** - Contexto do mercado
11. **🚀 Próximos Passos** - Recursos e continuação
12. **✅ Conclusão** - Recap e certificado

### Recursos de Markdown:

#### 1. Títulos e Seções

```markdown
# Título Principal (H1)
## Seção (H2)
### Subseção (H3)
#### Subtópico (H4)
```

#### 2. Texto Formatado

```markdown
**Negrito** para termos importantes
*Itálico* para ênfase
`código inline` para comandos e variáveis
> Blockquote para notas importantes
```

#### 3. Listas

```markdown
- Item não ordenado
- Outro item
  - Sub-item

1. Item ordenado
2. Segundo item

- [ ] Checkbox não marcado
- [x] Checkbox marcado
```

#### 4. Blocos de Código

````markdown
```bash
# Comentário
comando --flag valor
```

```javascript
// Código JavaScript
function exemplo() {
  return true;
}
```

```python
# Código Python
def exemplo():
    return True
```
````

Linguagens suportadas: `bash`, `javascript`, `typescript`, `python`, `java`, `go`, `rust`, `html`, `css`, `json`, `yaml`, `sql`, `docker`, etc.

#### 5. Imagens

**Imagem simples:**
```markdown
![Descrição](https://via.placeholder.com/1200x600?text=Sua+Imagem)
*Legenda opcional em itálico*
```

**Imagem local (na pasta public):**
```markdown
![Diagrama](/images/courses/nome-curso/diagrama.png)
```

#### 6. Vídeos do YouTube

```markdown
![](https://www.youtube.com/watch?v=VIDEO_ID)
```

O sistema detecta automaticamente links do YouTube e renderiza um player embed.

#### 7. Tabelas

```markdown
| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| Valor A  | Valor B  | Valor C  |
| Valor D  | Valor E  | Valor F  |
```

#### 8. Links

```markdown
[Texto do link](https://exemplo.com)
[Link interno](/cursos/outro-curso)
```

#### 9. Callouts HTML

Para destaque visual especial:

```html
<!-- Dica (Azul) -->
<div style="background: #f8f9fa; padding: 1.5rem; border-left: 4px solid #3B82F6; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>💡 Dica Importante:</strong>
  <p>Conteúdo da dica aqui.</p>
</div>

<!-- Aviso (Amarelo) -->
<div style="background: #fffbeb; padding: 1.5rem; border-left: 4px solid #F59E0B; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>⚠️ Atenção:</strong>
  <p>Conteúdo do aviso aqui.</p>
</div>

<!-- Erro (Vermelho) -->
<div style="background: #fef2f2; padding: 1.5rem; border-left: 4px solid #EF4444; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>🚫 Cuidado:</strong>
  <p>Conteúdo do erro/perigo aqui.</p>
</div>

<!-- Sucesso (Verde) -->
<div style="background: #f0fdf4; padding: 1.5rem; border-left: 4px solid #22C55E; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>✅ Sucesso:</strong>
  <p>Conteúdo de sucesso aqui.</p>
</div>
```

#### 10. Box de CTA (Call to Action)

Para incentivar ação do aluno:

```html
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 1rem; color: white; text-align: center; margin: 2rem 0;">
  <h3 style="color: white; margin-bottom: 1rem;">🎯 Teste seu conhecimento!</h3>
  <p style="margin-bottom: 1.5rem;">Complete o quiz para validar o que aprendeu.</p>
  <strong>Boa sorte! 🍀</strong>
</div>
```

### Boas Práticas de Conteúdo:

1. **Seja claro e objetivo** - Evite jargões desnecessários
2. **Use exemplos práticos** - Código que funciona é essencial
3. **Adicione imagens/diagramas** - Visualização ajuda na compreensão
4. **Inclua vídeos quando possível** - Conteúdo audiovisual é engajador
5. **Crie seções progressivas** - Do básico ao avançado
6. **Adicione troubleshooting** - Antecipe problemas comuns
7. **Liste recursos adicionais** - Links, documentação, comunidades
8. **Termine com CTA** - Incentive fazer o quiz e obter o certificado

---

## ❓ Arquivo quiz.yml

Este arquivo define o questionário final do curso com timer.

### Estrutura Completa:

```yaml
# ==============================================================================
# CONFIGURAÇÃO DO QUIZ
# ==============================================================================

# Tempo limite em segundos
# Recomendações:
# - 180s (3 min) = 5 questões simples
# - 300s (5 min) = 8-10 questões
# - 600s (10 min) = 15-20 questões
# - 900s (15 min) = 25-30 questões
# - 1200s (20 min) = 30-40 questões
# - 1800s (30 min) = 40+ questões
timeLimit: 600  # 10 minutos

# Nota mínima para aprovação (0-100)
# Recomendações:
# - 60% = curso introdutório
# - 70% = curso padrão (RECOMENDADO)
# - 80% = curso avançado
# - 90% = certificação técnica
passingScore: 70

# ==============================================================================
# QUESTÕES
# ==============================================================================

questions:
  # QUESTÃO 1: Múltipla Escolha (apenas 1 resposta correta)
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
      - text: "Um banco de dados"
        correct: false
    explanation: "Docker é uma plataforma de containerização que permite empacotar aplicações e suas dependências em containers isolados."

  # QUESTÃO 2: Verdadeiro ou Falso
  - id: 2
    question: "Containers são mais leves que máquinas virtuais"
    type: "true_false"
    options:
      - text: "Verdadeiro"
        correct: true
      - text: "Falso"
        correct: false
    explanation: "Containers compartilham o kernel do sistema operacional host, tornando-os muito mais leves que VMs completas."

  # QUESTÃO 3: Múltipla Escolha com comando
  - id: 3
    question: "Qual comando lista todos os containers em execução?"
    type: "multiple_choice_single"
    options:
      - text: "docker ps"
        correct: true
      - text: "docker ls"
        correct: false
      - text: "docker list"
        correct: false
      - text: "docker show"
        correct: false
    explanation: "O comando 'docker ps' lista todos os containers em execução. Use 'docker ps -a' para ver todos os containers, incluindo os parados."

  # QUESTÃO 4: Conceitual
  - id: 4
    question: "Qual a principal vantagem de usar Docker em desenvolvimento?"
    type: "multiple_choice_single"
    options:
      - text: "Menor consumo de memória"
        correct: false
      - text: "Ambiente consistente entre dev e produção"
        correct: true
      - text: "Velocidade de execução"
        correct: false
      - text: "Interface gráfica amigável"
        correct: false
    explanation: "A principal vantagem do Docker é garantir que o ambiente de desenvolvimento seja idêntico ao de produção, eliminando o famoso 'funciona na minha máquina'."

  # QUESTÃO 5: Prática
  - id: 5
    question: "Como você para um container em execução?"
    type: "multiple_choice_single"
    options:
      - text: "docker kill [container]"
        correct: false
      - text: "docker stop [container]"
        correct: true
      - text: "docker pause [container]"
        correct: false
      - text: "docker end [container]"
        correct: false
    explanation: "O comando 'docker stop' envia um sinal SIGTERM e aguarda o container encerrar graciosamente. Já 'docker kill' força o encerramento imediato."

# ==============================================================================
# BOAS PRÁTICAS PARA CRIAR QUESTÕES
# ==============================================================================

# ✅ FAÇA:
# - Crie questões claras e objetivas
# - Misture questões teóricas e práticas
# - Use exemplos reais do conteúdo do curso
# - Explique SEMPRE o porquê da resposta correta
# - Varie o nível de dificuldade (fácil, médio, difícil)
# - Coloque questões mais fáceis no início
# - Use de 5 a 20 questões por quiz (ideal: 10-15)

# ❌ EVITE:
# - Questões ambíguas ou "pegadinhas"
# - Respostas muito longas (máx. 100 caracteres)
# - Questões que não foram abordadas no curso
# - Múltiplas respostas corretas (use 'type: multiple_choice_single')
# - Explicações vagas ou incompletas

# ==============================================================================
# TIPOS DE QUESTÕES SUPORTADOS
# ==============================================================================

# 1. multiple_choice_single
#    - Apenas UMA resposta correta
#    - 2-5 opções recomendado
#    - Marque apenas UMA opção com 'correct: true'

# 2. true_false
#    - Apenas duas opções: Verdadeiro ou Falso
#    - Ótimo para verificar compreensão de conceitos
#    - Marque a opção correta com 'correct: true'

# Futuramente poderemos adicionar:
# - multiple_choice_multiple (várias respostas corretas)
# - fill_in_the_blank (preencher lacuna)
# - code_completion (completar código)

# ==============================================================================
# SISTEMA DE TIMER
# ==============================================================================

# O quiz tem um timer regressivo que:
# ✅ Inicia automaticamente ao carregar o quiz
# ✅ Exibe o tempo restante em formato MM:SS
# ✅ Muda de cor quando < 60 segundos (vermelho pulsante)
# ✅ Ao expirar, bloqueia todas as respostas
# ✅ Mostra modal com contagem regressiva de 5s
# ✅ Recarrega automaticamente para tela inicial do quiz
# ✅ Permite reiniciar o quiz quantas vezes quiser

# O aluno pode:
# - Fazer o quiz com calma dentro do tempo
# - Ver seu resultado (aprovado/reprovado)
# - Receber certificado se aprovado (>= 70%)
# - Refazer o quiz ilimitadas vezes
# - Baixar certificado em PNG de alta qualidade

# ==============================================================================
# CÁLCULO DA NOTA
# ==============================================================================

# Nota = (Acertos / Total de Questões) * 100
# 
# Exemplo com 10 questões e passingScore: 70:
# - 7 acertos = 70% = APROVADO ✅
# - 6 acertos = 60% = REPROVADO ❌
# - 10 acertos = 100% = APROVADO com honras! 🏆
```

### Exemplos de Questões:

**Questão Conceitual:**
```yaml
- id: 1
  question: "O que é CI/CD?"
  type: "multiple_choice_single"
  options:
    - text: "Continuous Integration / Continuous Deployment"
      correct: true
    - text: "Code Integration / Code Deployment"
      correct: false
    - text: "Container Integration / Container Deployment"
      correct: false
  explanation: "CI/CD significa Integração Contínua e Entrega/Implantação Contínua, práticas essenciais em DevOps."
```

**Questão Prática:**
```yaml
- id: 2
  question: "Qual comando cria uma nova imagem Docker?"
  type: "multiple_choice_single"
  options:
    - text: "docker build -t nome:tag ."
      correct: true
    - text: "docker create -t nome:tag ."
      correct: false
    - text: "docker make -t nome:tag ."
      correct: false
  explanation: "O comando 'docker build' cria uma imagem a partir de um Dockerfile. A flag '-t' define o nome e tag."
```

**Questão Verdadeiro/Falso:**
```yaml
- id: 3
  question: "Dockerfile e docker-compose.yml são a mesma coisa"
  type: "true_false"
  options:
    - text: "Verdadeiro"
      correct: false
    - text: "Falso"
      correct: true
  explanation: "Dockerfile define como construir UMA imagem, enquanto docker-compose.yml orquestra MÚLTIPLOS containers."
```

---

## 🖼️ Imagem de Capa (cover.png)

A imagem de capa é detectada automaticamente pela plataforma.

### Especificações:

- **Formato:** PNG (recomendado) ou JPG
- **Resolução:** 1200x630px (proporção 1.9:1)
- **Tamanho:** Máximo 500KB
- **Nome do arquivo:** `cover.png` (na pasta do curso)

### Como criar:

1. **Ferramentas recomendadas:**
   - [Canva](https://canva.com) - Templates prontos
   - [Figma](https://figma.com) - Design profissional
   - [Photoshop](https://adobe.com/photoshop) - Edição avançada
   - [GIMP](https://gimp.org) - Alternativa gratuita

2. **Elementos para incluir:**
   - Logo da tecnologia/ferramenta
   - Título do curso
   - Gradiente ou fundo relacionado à área
   - Ícones representativos

3. **Dicas de design:**
   - Use as cores da área (veja `src/lib/config/areas.ts`)
   - Mantenha legibilidade do texto
   - Teste visualização em tamanho pequeno (card)
   - Evite muito texto

### Opções de Capa:

**Opção 1: cover.png local (RECOMENDADO)**
```bash
# Coloque o arquivo cover.png na pasta do curso
content/courses/seu-curso/cover.png
```

**Opção 2: URL externa**
```yaml
# Em meta.yml
cover: "https://exemplo.com/imagem.jpg"
```

**Opção 3: Placeholder automático**
- Se não houver capa, um placeholder colorido é gerado automaticamente

---

## 🚀 Recursos Avançados

### 1. Imagens em Layouts Personalizados

**Layout 2 colunas:**
```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0;">
  <img src="imagem1.png" alt="Descrição 1" style="width: 100%; border-radius: 0.5rem;">
  <img src="imagem2.png" alt="Descrição 2" style="width: 100%; border-radius: 0.5rem;">
</div>
```

**Layout 3 colunas:**
```html
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin: 2rem 0;">
  <img src="img1.png" alt="1" style="width: 100%; border-radius: 0.5rem;">
  <img src="img2.png" alt="2" style="width: 100%; border-radius: 0.5rem;">
  <img src="img3.png" alt="3" style="width: 100%; border-radius: 0.5rem;">
</div>
```

### 2. Vídeos Incorporados

**YouTube:**
```markdown
![](https://www.youtube.com/watch?v=VIDEO_ID)
```

**Vimeo:**
```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID" width="100%" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
```

### 3. Badges e Estatísticas

```html
<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1rem 0;">
  <span style="background: #3B82F6; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">Docker</span>
  <span style="background: #8B5CF6; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">Containers</span>
  <span style="background: #EF4444; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">DevOps</span>
</div>
```

### 4. Accordion (Conteúdo Recolhível)

```html
<details style="margin: 1rem 0;">
  <summary style="cursor: pointer; font-weight: bold; padding: 0.5rem; background: #f3f4f6; border-radius: 0.5rem;">Clique para expandir</summary>
  <div style="padding: 1rem; border-left: 3px solid #3B82F6; margin-top: 0.5rem;">
    Conteúdo oculto que aparece ao clicar.
  </div>
</details>
```

---

## 📋 Boas Práticas

### Conteúdo:

- ✅ **Comece do básico** - Não assuma conhecimento prévio
- ✅ **Use exemplos reais** - Mostre aplicações práticas
- ✅ **Seja consistente** - Mantenha o mesmo tom e formato
- ✅ **Adicione imagens** - Visualização ajuda na compreensão
- ✅ **Teste todo código** - Garanta que exemplos funcionem
- ✅ **Revise ortografia** - Erros prejudicam credibilidade

### Quiz:

- ✅ **Crie 10-15 questões** - Balanceio entre cobertura e tempo
- ✅ **Misture dificuldades** - Fácil, médio e difícil
- ✅ **Explique respostas** - Sempre adicione 'explanation'
- ✅ **Teste o tempo** - Faça o quiz você mesmo para validar
- ✅ **Evite pegadinhas** - Seja justo com o aluno

### Imagens:

- ✅ **Otimize tamanho** - Use compressão (TinyPNG, Squoosh)
- ✅ **Use alt text** - Descreva as imagens para acessibilidade
- ✅ **Resolução adequada** - 1200px largura máxima
- ✅ **Formato correto** - PNG para diagramas, JPG para fotos

### Estrutura:

- ✅ **Siga o template** - Estrutura testada e aprovada
- ✅ **Use emojis** - Tornam o conteúdo mais visual
- ✅ **Divida em seções** - Facilita navegação
- ✅ **Adicione separadores** - Use `---` para demarcar seções

---

## ✅ Checklist de Publicação

Antes de publicar seu curso, verifique:

### 📄 Arquivos Obrigatórios:
- [ ] `meta.yml` preenchido completamente
- [ ] `content.md` com no mínimo 5 seções
- [ ] `quiz.yml` com pelo menos 5 questões
- [ ] `cover.png` adicionado (1200x630px)

### 📝 Metadados:
- [ ] `id` corresponde ao nome da pasta
- [ ] `title` é claro e atrativo
- [ ] `description` tem máximo 160 caracteres
- [ ] `duration` é realista (teste você mesmo)
- [ ] `level` está correto (iniciante/intermediário/avançado)
- [ ] `area` existe em `areas.ts`
- [ ] `tags` são relevantes (3-7 tags)
- [ ] `instructor` tem nome, avatar e bio
- [ ] `published: true` para tornar visível

### 📖 Conteúdo:
- [ ] Introdução clara sobre o que será aprendido
- [ ] Objetivos de aprendizagem definidos
- [ ] Exemplos de código testados e funcionais
- [ ] Imagens com tamanho otimizado (< 500KB cada)
- [ ] Links externos funcionando
- [ ] Vídeos do YouTube incorporados corretamente
- [ ] Seção de conclusão com CTA para o quiz
- [ ] Menção ao certificado ao final

### ❓ Quiz:
- [ ] `timeLimit` apropriado para número de questões
- [ ] `passingScore` definido (recomendado: 70)
- [ ] Mínimo de 5 questões criadas
- [ ] Todas as questões têm `explanation`
- [ ] Apenas uma resposta marcada como `correct: true`
- [ ] IDs das questões são únicos e sequenciais
- [ ] Questões cobrem todo o conteúdo do curso
- [ ] Testado o quiz do início ao fim

### 🎨 Visual:
- [ ] Capa atrativa e profissional
- [ ] Imagens de boa qualidade
- [ ] Cores consistentes com a área
- [ ] Layout responsivo (teste mobile)

### 🚀 Testes:
- [ ] Abriu o curso localmente
- [ ] Navegou por todas as seções
- [ ] Fez o quiz completo
- [ ] Testou o timer do quiz
- [ ] Gerou o certificado
- [ ] Baixou o certificado em PNG
- [ ] Testou em mobile
- [ ] Verificou links externos

### 📱 SEO e Compartilhamento:
- [ ] Title tag otimizado
- [ ] Description para meta tags
- [ ] Cover para Open Graph
- [ ] URL amigável (slug correto)

---

## 🆘 Troubleshooting

### Curso não aparece na listagem:

1. Verifique `published: true` em `meta.yml`
2. Confirme que a pasta está em `content/courses/`
3. Reinicie o servidor de desenvolvimento
4. Limpe o cache do navegador

### Capa não carrega:

1. Verifique se o arquivo é `cover.png` (exatamente)
2. Confirme resolução 1200x630px
3. Tente converter para PNG se estiver em outro formato
4. Verifique tamanho (< 500KB)

### Quiz não funciona:

1. Valide sintaxe YAML (indentação correta)
2. Confirme que cada questão tem ID único
3. Verifique se apenas uma opção está marcada como `correct: true`
4. Teste `timeLimit` (mínimo 60 segundos)

### Código não renderiza:

1. Use triple backticks (\`\`\`) antes e depois do código
2. Especifique a linguagem após os backticks
3. Verifique indentação (não use tabs)

### Imagem não aparece:

1. Verifique URL ou caminho
2. Use sempre `![alt](url)` ou `![alt](/caminho/local)`
3. Confirme que imagens locais estão em `/public/`

---

## 📚 Recursos Adicionais

### Documentação:

- [Guia de Markdown](https://www.markdownguide.org/)
- [Sintaxe YAML](https://yaml.org/)
- [Emojis para Markdown](https://emojipedia.org/)

### Ferramentas:

- **Validadores:**
  - [YAML Lint](https://www.yamllint.com/) - Valida sintaxe YAML
  - [Markdown Preview](https://markdownlivepreview.com/) - Preview de Markdown

- **Imagens:**
  - [TinyPNG](https://tinypng.com/) - Compressão de imagens
  - [Unsplash](https://unsplash.com/) - Fotos gratuitas
  - [Placeholder.com](https://placeholder.com/) - Placeholders

- **Design:**
  - [Canva](https://canva.com/) - Criar capas
  - [Coolors](https://coolors.co/) - Paletas de cores
  - [Feather Icons](https://feathericons.com/) - Ícones SVG

### Templates de Cursos Reais:

Veja exemplos funcionais em:
- `/content/courses/docker/` - Curso de Docker
- `/content/courses/kubernetes/` - Curso de Kubernetes
- `/content/courses/git/` - Curso de Git

---

## 💬 Suporte

Precisa de ajuda? Entre em contato:

- **Issues:** [GitHub Issues](https://github.com/seu-repo/issues)
- **Discord:** [Comunidade](https://discord.gg/seu-servidor)
- **Email:** contato@seuemail.com

---

## 🎉 Conclusão

Agora você tem tudo que precisa para criar cursos incríveis! 

Lembre-se:
- Qualidade > Quantidade
- Teste tudo antes de publicar
- Peça feedback de outros instrutores
- Atualize o conteúdo regularmente
- Monitore dúvidas dos alunos

**Boa sorte criando seu curso! 🚀**
