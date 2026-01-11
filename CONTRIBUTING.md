# 🤝 Guia de Contribuição

## Como Contribuir com o Projeto

### 🍴 Opção 1: Fork + Pull Request (Recomendado)

Ideal para contribuidores externos sem acesso direto ao repositório.

```bash
# 1. Faça fork do repositório no GitHub (clique em "Fork")

# 2. Clone seu fork
git clone https://github.com/SEU-USUARIO/aprendi.git
cd aprendi

# 3. Adicione o repositório original como upstream
git remote add upstream https://github.com/USUARIO-ORIGINAL/aprendi.git

# 4. Crie uma branch para sua feature
git checkout -b feat/minha-contribuicao

# 5. Instale dependências
npm install

# 6. Faça suas alterações
# ... edite arquivos ...

# 7. Teste localmente
npm run dev          # Servidor de desenvolvimento
npm run test         # Executa testes
npm run build        # Testa build de produção

# 8. Commit suas alterações
git add .
git commit -m "feat: adiciona nova funcionalidade X"

# 9. Push para seu fork
git push origin feat/minha-contribuicao

# 10. Abra um Pull Request
# Vá para seu fork no GitHub e clique em "Compare & pull request"
```

### ✏️ Opção 2: Commit Direto (Com Permissão Write)

Para colaboradores com acesso direto ao repositório.

```bash
# 1. Clone o repositório
git clone https://github.com/USUARIO/aprendi.git
cd aprendi

# 2. Crie uma branch
git checkout -b feat/minha-feature

# 3. Faça alterações, teste e commit
npm install
# ... faça alterações ...
npm run test
git add .
git commit -m "feat: descrição da mudança"

# 4. Push para o repositório
git push origin feat/minha-feature

# 5. Abra Pull Request ou merge direto na main
git checkout main
git merge feat/minha-feature
git push origin main
```

### 📝 Convenção de Commits

Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Apenas documentação
- `style:` Formatação, sem mudança de código
- `refactor:` Refatoração de código
- `test:` Adicionar ou corrigir testes
- `chore:` Tarefas de build, configurações, etc.

Exemplos:
```
feat: adiciona quiz ao curso de CI/CD
fix: corrige cache de imagens dos cursos
docs: atualiza README com instruções de deploy
refactor: reorganiza componentes de curso
```

## 🎯 Tipos de Contribuição

### 📚 Adicionar/Editar Curso

Veja o arquivo [`docs/CRIAR_CURSOS.md`](./docs/CRIAR_CURSOS.md) para o guia completo.

Resumo:
1. Crie pasta em `content/courses/nome-do-curso/`
2. Adicione `meta.yml`, `content.md`, (opcional) `quiz.yml`
3. Teste: `npm run validate`
4. Abra Pull Request

### 👤 Adicionar Instrutor

1. Edite `content/instructors/instructors.yml`
2. Adicione avatar em `content/instructors/images/id-do-instrutor.png`
3. Teste localmente
4. Abra Pull Request

### 🐛 Reportar Bug

1. Vá em **Issues** no GitHub
2. Clique em **New Issue**
3. Descreva:
   - O que aconteceu
   - O que esperava
   - Como reproduzir
   - Screenshots (se aplicável)

### 💡 Sugerir Feature

1. Abra uma **Issue** com label `enhancement`
2. Descreva a feature desejada
3. Explique o caso de uso
4. Aguarde discussão da comunidade

## ✅ Checklist Antes do Pull Request

- [ ] Código testado localmente (`npm run dev`)
- [ ] Testes passando (`npm run test`)
- [ ] Build funciona (`npm run build`)
- [ ] Commits seguem convenção
- [ ] Código formatado e sem erros de lint
- [ ] Documentação atualizada (se necessário)
- [ ] Screenshots adicionados (se mudanças visuais)

## 🔄 Sincronizar Fork com Original

Mantenha seu fork atualizado:

```bash
# Busca mudanças do repositório original
git fetch upstream

# Muda para sua branch main
git checkout main

# Merge das mudanças
git merge upstream/main

# Atualiza seu fork
git push origin main
```

## 🚀 Deploy Automático

Após merge/push na `main`, o GitHub Actions:
1. ✅ Executa testes
2. ✅ Valida estrutura dos cursos
3. ✅ Faz build otimizado
4. ✅ Deploy no GitHub Pages
5. ✅ Site atualizado em ~2-5 minutos

Acompanhe em: **Actions** tab no GitHub

## 🆘 Ajuda

- 📖 [Documentação do Next.js](https://nextjs.org/docs)
- 🎓 [Guia de Criação de Cursos](./docs/CRIAR_CURSOS.md)
- 🚀 [Guia de Deploy](./DEPLOY.md)
- 💬 Abra uma Issue para perguntas

## 📜 Código de Conduta

- ✅ Seja respeitoso e inclusivo
- ✅ Aceite críticas construtivas
- ✅ Foque no que é melhor para a comunidade
- ✅ Mostre empatia com outros contribuidores

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto.

---

**Obrigado por contribuir! 🎉**
