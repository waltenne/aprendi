# Configuração de Analytics e Comentários

Este documento explica como configurar o **Umami Cloud** para estatísticas e o **Giscus** para comentários no Aprendi.

---

## 📊 Umami Cloud (Analytics)

O Umami Cloud é uma solução de analytics focada em privacidade, gratuita para até 10k pageviews/mês.

### Configuração

1. **Crie uma conta** em [cloud.umami.is](https://cloud.umami.is)

2. **Adicione seu site**:
   - Vá em "Settings" → "Websites" → "Add website"
   - Informe o nome e URL do seu site
   - Copie o **Website ID** gerado

3. **Configure as variáveis de ambiente**:

```bash
# .env.local
NEXT_PUBLIC_UMAMI_WEBSITE_ID=seu-website-id-aqui
NEXT_PUBLIC_UMAMI_URL=https://cloud.umami.is
```

4. **Deploy** - O analytics começará a funcionar automaticamente!

### Eventos Personalizados

O Aprendi rastreia automaticamente os seguintes eventos:

| Evento | Descrição | Dados |
|--------|-----------|-------|
| `course_view` | Visualização de um curso | `course_id`, `course_title` |
| `section_read` | Leitura de uma seção | `course_id`, `section_id`, `section_title` |
| `quiz_start` | Início de um quiz | `course_id`, `quiz_title`, `questions_count` |
| `quiz_complete` | Conclusão de um quiz | `course_id`, `score`, `passed`, `attempts` |

### Dashboard

Acesse seu dashboard em [cloud.umami.is](https://cloud.umami.is) para visualizar:
- Visitantes em tempo real
- Pageviews por página
- Fontes de tráfego
- Países e dispositivos
- Eventos personalizados

---

## 💬 Giscus (Comentários)

O Giscus utiliza GitHub Discussions para comentários, sendo 100% gratuito.

### Pré-requisitos

1. O repositório deve ser **público**
2. O repositório deve ter **Discussions habilitadas**
   - Vá em Settings → Features → ✅ Discussions

3. O app **Giscus** deve estar instalado no repositório
   - Instale em [github.com/apps/giscus](https://github.com/apps/giscus)

### Configuração

1. **Acesse** [giscus.app](https://giscus.app)

2. **Configure** seu repositório:
   - Repository: `seu-usuario/seu-repo`
   - Mapping: **Discussion title contains page URL** (recomendado)
   - Category: Crie uma categoria "Comentários" ou use "Announcements"

3. **Copie os valores** gerados:
   - `data-repo`
   - `data-repo-id`
   - `data-category`
   - `data-category-id`

4. **Configure as variáveis de ambiente**:

```bash
# .env.local
NEXT_PUBLIC_GISCUS_REPO=seu-usuario/seu-repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxxxxxxxxxx
NEXT_PUBLIC_GISCUS_CATEGORY=Comentários
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxxxxxxxxxx
```

5. **Deploy** - Os comentários aparecerão no final de cada página de curso!

### Recursos

- ✅ Login via GitHub
- ✅ Reactions (👍, ❤️, 🎉, etc.)
- ✅ Respostas aninhadas
- ✅ Sincroniza com tema (light/dark)
- ✅ Moderação via GitHub Discussions

---

## 🚀 Variáveis de Ambiente (Resumo)

```bash
# .env.local

# Umami Cloud
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_URL=https://cloud.umami.is

# Giscus
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
```

---

## 💰 Custos

| Serviço | Plano Free | Limite |
|---------|------------|--------|
| Umami Cloud | Gratuito | 10k pageviews/mês |
| Giscus | Gratuito | Ilimitado |

Ambos são adequados para projetos pessoais e educacionais. Para escala maior, o Umami pode ser self-hosted gratuitamente.

---

## 🔧 Desenvolvimento Local

Durante o desenvolvimento local, ambos os serviços funcionam normalmente se as variáveis estiverem configuradas. 

Para testar sem analytics real, deixe `NEXT_PUBLIC_UMAMI_WEBSITE_ID` vazio - o script não será carregado.
