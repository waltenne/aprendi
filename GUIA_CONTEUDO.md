# Guia de Conteúdo para Cursos

Este guia explica como adicionar imagens, vídeos do YouTube e outros elementos ao seu curso.

> 💡 **Documentação Completa:** Para um guia detalhado sobre como criar cursos, consulte [/docs/CRIAR_CURSOS.md](/docs/CRIAR_CURSOS.md)

## Estrutura de Arquivo

```
content/courses/seu-curso/
├── meta.yml           # Metadados do curso (obrigatório)
├── content.md         # Conteúdo principal em Markdown (obrigatório)
├── quiz.yml          # Perguntas do quiz com timer (obrigatório)
└── cover.png         # Imagem de capa do curso (opcional, 1200x630px)
```

### Novidades na Plataforma:

✨ **Cover Automático**: Basta adicionar um `cover.png` (1200x630px) na pasta do curso. A plataforma detecta automaticamente!

✨ **Quiz com Timer**: Sistema completo de quiz com:
- Timer regressivo configurável
- Modal de expiração com auto-reload
- Certificado digital após aprovação
- Possibilidade de refazer ilimitadas vezes

✨ **Áreas Globais**: Não precisa mais definir `icon` e `color` no `meta.yml`. As cores e ícones são configurados globalmente em `/src/lib/config/areas.ts`

✨ **Certificado**: Gerado automaticamente após aprovação no quiz (nota ≥ 70%), com opção de download em PNG de alta qualidade.

## Imagens

### Como adicionar imagens

Use a sintaxe padrão do Markdown:

```markdown
![Descrição da imagem](https://pbs.twimg.com/profile_images/2001663807446245376/50jnrMYk.jpg)
```

### Adicionar Legenda

A descrição em `![...]` aparece como legenda abaixo da imagem:

```markdown
![Este é o título da imagem que aparece abaixo](https://url-da-imagem.jpg)
```

**Exemplo:**

```markdown
![Fluxo básico do Git com branches e commits](https://exemplo.com/git-flow.png)
```

A legenda será exibida automaticamente abaixo da imagem.

### Recomendações

- **Formato**: JPG, PNG, WebP
- **Tamanho**: Máximo 2MB por imagem
- **Dimensões**: 1200x800px ou 16:9 para melhor resultado
- **URLs**: Use URLs completas (http:// ou https://)

### Exemplo

```markdown
## Conceitos Visuais

![Fluxo do Git com branches](https://exemplo.com/git-flow.png)

A imagem acima mostra o fluxo básico do Git.
```

---

## Vídeos do YouTube

### Como adicionar vídeos

Use uma URL do YouTube como imagem:

```markdown
![](https://www.youtube.com/watch?v=VIDEO_ID)
```

### Adicionar Legenda no Vídeo

Adicione o texto da legenda após o vídeo:

```markdown
![](https://www.youtube.com/watch?v=VIDEO_ID)

*Clique para assistir a demonstração prática no YouTube*
```

**OU**

```markdown
[Clique aqui para assistir](https://www.youtube.com/watch?v=VIDEO_ID)
```

**OU** (formato encurtado)

```markdown
![](https://youtu.be/VIDEO_ID)
```

### Formatos suportados

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

### Recomendações

- **Qualidade**: Mínimo 720p (HD)
- **Duração**: 5-15 minutos por vídeo
- **Subtítulos**: Adicione legendas em português

### Exemplo

```markdown
## Tutorial Prático

Assista este vídeo para ver uma demonstração prática:

![](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

Aproveite para praticar os comandos mostrados no vídeo.
```

---

## Exemplo Completo

```markdown
# Git e GitHub para Iniciantes

## Introdução ao Git

![](https://www.youtube.com/watch?v=MTvdEk1dcwk)

### O que é Git?

Git é um sistema de controle de versão distribuído...

![Estrutura do Git](https://exemplo.com/git-structure.png)

## Comandos Essenciais

```bash
git init
git clone <url>
git add .
```

## Visualização do Fluxo

![Fluxo de trabalho com Git](https://exemplo.com/git-workflow.png)

Siga este fluxo para um melhor controle de versão.
```

---

## Layout em Colunas (Texto ao Lado da Imagem)

Use HTML bruto do Markdown para criar layouts customizados:

### Exemplo 1: Imagem à Esquerda, Texto à Direita

```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; margin: 2rem 0;">
  <div>
    <img src="https://exemplo.com/imagem.png" alt="Descrição" style="border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; height: auto;">
  </div>
  <div>
    <h3>Título da Seção</h3>
    <p>Aqui vai o texto que acompanha a imagem. Você pode usar <strong>negrito</strong>, <em>itálico</em>, listas, etc.</p>
    <ul>
      <li>Ponto 1</li>
      <li>Ponto 2</li>
      <li>Ponto 3</li>
    </ul>
  </div>
</div>
```

### Exemplo 2: Texto à Esquerda, Imagem à Direita

```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; margin: 2rem 0;">
  <div>
    <h3>Título da Seção</h3>
    <p>Aqui vai o texto que acompanha a imagem.</p>
    <ul>
      <li>Ponto 1</li>
      <li>Ponto 2</li>
    </ul>
  </div>
  <div>
    <img src="https://exemplo.com/imagem.png" alt="Descrição" style="border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; height: auto;">
  </div>
</div>
```

### Exemplo 3: Três Colunas

```html
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; margin: 2rem 0;">
  <div style="text-align: center;">
    <img src="https://exemplo.com/imagem1.png" alt="Imagem 1" style="border-radius: 0.5rem; width: 100%; height: auto;">
    <h4>Título 1</h4>
    <p>Descrição</p>
  </div>
  <div style="text-align: center;">
    <img src="https://exemplo.com/imagem2.png" alt="Imagem 2" style="border-radius: 0.5rem; width: 100%; height: auto;">
    <h4>Título 2</h4>
    <p>Descrição</p>
  </div>
  <div style="text-align: center;">
    <img src="https://exemplo.com/imagem3.png" alt="Imagem 3" style="border-radius: 0.5rem; width: 100%; height: auto;">
    <h4>Título 3</h4>
    <p>Descrição</p>
  </div>
</div>
```

### Dicas de Layout

- **2 Colunas**: Use `grid-template-columns: 1fr 1fr;`
- **3 Colunas**: Use `grid-template-columns: 1fr 1fr 1fr;`
- **Espaçamento**: Ajuste `gap: 2rem;` para controlar espaço entre elementos
- **Alinhamento**: Use `align-items: center;` para alinhar verticalmente
- **Responsividade**: Em mobile, adicione `@media (max-width: 768px)` para mudar para coluna única

---

## Exemplo Completo com Legenda e Colunas

```markdown
## Conceitos com Imagem e Texto

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; margin: 2rem 0;">
  <div>
    <img src="https://exemplo.com/git-workflow.png" alt="Fluxo do Git" style="border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; height: auto;">
    <p style="text-align: center; font-size: 0.9rem; color: #666;">Fluxo básico do Git com branches</p>
  </div>
  <div>
    <h3>Como funciona o Git</h3>
    <p>Git é um sistema de controle de versão que permite...</p>
    <ul>
      <li>Rastrear mudanças</li>
      <li>Trabalhar em paralelo</li>
      <li>Colaborar em equipe</li>
    </ul>
  </div>
</div>
```

---

## Callouts e Alertas

Use HTML para criar caixas de destaque coloridas com ícones:

### Callout de Dica (Azul)

```html
<div style="background: #f8f9fa; padding: 1.5rem; border-left: 4px solid #3B82F6; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>💡 Dica Importante:</strong>
  <p>Use isto para destacar dicas úteis e informações relevantes.</p>
</div>
```

### Callout de Aviso (Amarelo)

```html
<div style="background: #fffbeb; padding: 1.5rem; border-left: 4px solid #F59E0B; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>⚠️ Atenção:</strong>
  <p>Use isto para alertas e avisos importantes.</p>
</div>
```

### Callout de Erro/Perigo (Vermelho)

```html
<div style="background: #fef2f2; padding: 1.5rem; border-left: 4px solid #EF4444; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>🚫 Cuidado:</strong>
  <p>Use isto para alertar sobre perigos e ações destrutivas.</p>
</div>
```

### Callout de Sucesso (Verde)

```html
<div style="background: #f0fdf4; padding: 1.5rem; border-left: 4px solid #22C55E; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>✅ Sucesso:</strong>
  <p>Use isto para confirmar resultados positivos.</p>
</div>
```

### Box de CTA (Call to Action)

```html
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 1rem; color: white; text-align: center; margin: 2rem 0;">
  <h3 style="color: white; margin-bottom: 1rem;">🎯 Teste seu conhecimento!</h3>
  <p style="margin-bottom: 1.5rem;">Complete o quiz para validar o que aprendeu.</p>
  <strong>Boa sorte! 🍀</strong>
</div>
```

---

## Dicas e Boas Práticas

✅ **Faça**
- Use URLs de domínios confiáveis
- Adicione descrições alternativas (alt text) para imagens
- Organize o conteúdo com seções claras
- Use imagens com boa qualidade e legibilidade
- Adicione legendas em imagens importantes

❌ **Evite**
- URLs quebradas ou temporárias
- Imagens muito grandes (>2MB)
- Muitos vídeos em sequência
- Conteúdo desorganizado

---

## Troubleshooting

### Imagem não aparece
- Verifique se a URL está completa e correta
- Teste a URL em um navegador
- Use HTTPS em vez de HTTP

### Vídeo não carrega
- Confirme que o vídeo do YouTube é público
- Verifique se o ID do vídeo está correto
- Tente os diferentes formatos de URL

### Figcaption não aparece
- Certifique-se de que a imagem tem alt text
- O alt text aparecerá como legenda abaixo da imagem

---

## Suporte

Para mais informações ou dúvidas, abra uma issue no repositório.
