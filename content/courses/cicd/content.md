# Curso de CI/CD: Fundamentos e Prática

> **Automatize seu fluxo de desenvolvimento!** Neste curso você vai aprender CI/CD do zero: desde os conceitos básicos até a implementação de pipelines completas. Ao final, você será capaz de criar, otimizar e gerenciar fluxos de entrega contínua.

## 📚 Introdução

Imagine poder entregar software com mais qualidade, menos bugs e muito mais rapidez. Isso é o que o CI/CD oferece! Neste curso, vamos desmistificar esses conceitos que parecem complexos, mas são essenciais para qualquer desenvolvedor moderno.

**Por que CI/CD é importante?**
- Reduz em até 70% os bugs em produção
- Acelera o tempo de entrega em 90%
- Aumenta a produtividade da equipe em 50%
- Garante mais estabilidade e confiança

**Para quem é este curso?**
- Desenvolvedores que querem automatizar seus processos
- DevOps iniciantes buscando entender fundamentos
- Tech leads que precisam melhorar fluxos de entrega
- Qualquer pessoa curiosa sobre automação de software

**Tempo estimado:** 1 hora (mas você pode ir no seu ritmo!)

---

## 🎯 Objetivos de Aprendizagem

Ao final deste curso, você será capaz de:

- [ ] **Explicar** com suas palavras o que é CI, CD e a diferença entre eles
- [ ] **Identificar** os componentes básicos de uma pipeline
- [ ] **Comparar** ferramentas populares de CI/CD
- [ ] **Aplicar** boas práticas de segurança em pipelines
- [ ] **Otimizar** uma pipeline para ser mais rápida
- [ ] **Escolher** a ferramenta certa para cada cenário
- [ ] **Criar** uma pipeline básica do zero

---

## 📖 Seção 1: Entendendo CI/CD - Os Conceitos Fundamentais

### 1.1 O que é CI/CD? (A Analogia da Fábrica)

Pense em uma fábrica de carros:

**Sem CI/CD (antigo):**
- Cada peça é feita separadamente
- Só se monta o carro no final do mês
- Se uma peça tem defeito, todo o carro sai errado
- Leva semanas para descobrir problemas

**Com CI/CD (moderno):**
- Peças são testadas logo que ficam prontas
- O carro é montado peça por peça, diariamente
- Problemas são encontrados em minutos
- Carros saem da linha de produção constantemente

<div style="background: #f0f9ff; padding: 1.5rem; border-left: 4px solid #0ea5e9; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>💡 Pense assim:</strong>
  <p>CI/CD transforma o desenvolvimento de software de uma "produção em lote" para uma "linha de montagem contínua".</p>
</div>

### 1.2 As Três Letras Mágicas: CI, CD, CD

Vamos descomplicar essas siglas:

**CI = Continuous Integration (Integração Contínua)**
- **O que é:** Integrar pequenas mudanças de código frequentemente
- **Como funciona:** Toda vez que você commita código, testes rodam automaticamente
- **Objetivo:** Encontrar bugs rapidamente
- **Analogia:** Testar cada peça do carro assim que é feita

**CD = Continuous Delivery (Entrega Contínua)**
- **O que é:** Ter o código sempre pronto para produção
- **Como funciona:** Após os testes, o sistema automaticamente prepara tudo para deploy
- **Objetivo:** Poder fazer deploy a qualquer momento
- **Analogia:** O carro está montado, com gasolina, e pronto para sair da fábrica

**CD = Continuous Deployment (Implantação Contínua)**
- **O que é:** Deploy automático para produção
- **Como funciona:** Se todos os testes passarem, vai direto para produção
- **Objetivo:** Entregar valor aos usuários o mais rápido possível
- **Analogia:** O carro sai da fábrica e vai direto para a concessionária

### 1.3 A Evolução Natural

```
     CI          →          CD (Delivery)         →          CD (Deployment)
     │                      │                                │
"Testo meu código"   "Preparo para produção"        "Vai para produção automático"
     │                      │                                │
  Descobre bugs          ↓                           Entrega valor
     rápido         Pode fazer deploy                  constantemente
                    quando quiser
```

<div style="background: #fef3c7; padding: 1.5rem; border-left: 4px solid #f59e0b; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>⚠️ Atenção às confusões comuns:</strong>
  <p>Muitas pessoas usam "CD" para ambos (Delivery e Deployment). A diferença crucial é: <strong>Delivery tem aprovação manual, Deployment é totalmente automático.</strong></p>
</div>

### 1.4 Por que adotar CI/CD? (Os Benefícios Reais)

**Para desenvolvedores:**
- Menos tempo debugging ("funciona na minha máquina")
- Feedback imediato sobre seu código
- Mais tempo criando, menos tempo configurando

**Para a empresa:**
- Menos bugs em produção = menos prejuízo
- Entregas mais rápidas = vantagem competitiva
- Processos padronizados = menos erros humanos

**Para os usuários:**
- Recursos novos mais rápido
- Aplicações mais estáveis
- Menos tempo de indisponibilidade

---

## 💻 Seção 2: Como Tudo Funciona - A Pipeline

### 2.1 O que é uma Pipeline? (A Receita de Bolo)

Imagine que fazer deploy é como assar um bolo:

**Sem pipeline (manual):**
1. Misturar ingredientes (escrever código)
2. Aquecer forno (configurar servidor)
3. Colocar na forma (fazer build)
4. Assar (fazer deploy)
5. Decorar (configurar ambiente)
6. Servir (liberar para usuários)

**Com pipeline (automático):**
1. Misturar ingredientes (escrever código)
2. **MÁGICA:** O resto acontece sozinho!
   - O forno aquece automaticamente
   - O bolo vai para o forno sozinho
   - A decoração é aplicada automaticamente
   - O bolo é servido automaticamente

### 2.2 Os Estágios da Pipeline (Passo a Passo)

Vamos ver o que acontece quando você commita código:

```
1. VOCÊ COMMITA CÓDIGO
      ↓
2. CI SERVER DETECTA ("Ah, tem código novo!")
      ↓
3. BUILD (Compilar/empacotar)
      ↓
4. TESTES (Unitários, integração)
      ↓
5. ANÁLISE (Qualidade, segurança)
      ↓
6. DEPLOY STAGING (Ambiente de teste)
      ↓
7. TESTES MANUAIS (Opcional)
      ↓
8. DEPLOY PRODUÇÃO 🎉
```

### 2.3 Exemplo Real: GitHub Actions

Vamos ver um exemplo CONCRETO de pipeline:

```yaml
# Este arquivo fica em: .github/workflows/ci.yml
name: Minha Primeira Pipeline

# QUANDO roda? Quando houver push ou pull request
on: [push, pull_request]

jobs:
  # JOB 1: Build e Teste
  build-and-test:
    runs-on: ubuntu-latest  # Onde roda? Linux
    
    steps:
    # PASSO 1: Pegar o código
    - name: Checkout code
      uses: actions/checkout@v3
    
    # PASSO 2: Configurar Node.js
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    # PASSO 3: Instalar dependências
    - name: Install dependencies
      run: npm ci  # Similar ao npm install
    
    # PASSO 4: Rodar testes
    - name: Run tests
      run: npm test  # Executa seus testes
    
    # PASSO 5: Build da aplicação
    - name: Build application
      run: npm run build  # Cria versão de produção
```

<div style="background: #dcfce7; padding: 1.5rem; border-left: 4px solid #22c55e; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>✅ Entendeu? Vamos resumir:</strong>
  <p>Uma pipeline é uma <strong>receita automatizada</strong> que diz ao computador exatamente o que fazer com seu código, passo a passo, sem erro humano.</p>
</div>

### 2.4 Pipeline vs Script: Qual a Diferença?

**Script tradicional:**
```bash
# script.sh
npm install
npm test
npm run build
# E se falhar? E se precisar rodar em paralelo?
```

**Pipeline moderna:**
```yaml
# Pipeline
- Se falhar, para e me avisa
- Se passar, vai para próximo passo
- Posso rodar coisas em paralelo
- Tenho logs organizados
- Consigo reexecutar partes específicas
```

---

## 🛠️ Seção 3: As Ferramentas - Escolhendo a Certa

### 3.1 O Mercado de Ferramentas

Existem basicamente 3 tipos:

**1. SaaS (Software as a Service) - "Aluguel"**
- Exemplos: GitHub Actions, GitLab CI, CircleCI
- **Prós:** Fácil começar, manutenção zero
- **Contras:** Custo cresce com uso, menos controle

**2. Self-hosted - "Compre sua casa"**
- Exemplos: Jenkins, GitLab Self-hosted
- **Prós:** Controle total, customização ilimitada
- **Contras:** Manutenção complexa, custo inicial

**3. Híbridas - "O melhor dos dois mundos"**
- Exemplos: Jenkins na nuvem
- **Prós:** Flexibilidade
- **Contras:** Complexidade

### 3.2 Comparação Detalhada

Vamos comparar as 5 ferramentas mais populares:

| Ferramenta | Tipo | Melhor Para | Dificuldade | Custo Inicial |
|------------|------|-------------|-------------|---------------|
| **Jenkins** | 🏠 Self-hosted | Grandes empresas, muito customização | ⭐⭐⭐⭐ | $0 (tempo) |
| **GitHub Actions** | ☁️ SaaS | Quem já usa GitHub, projetos pequenos/médios | ⭐⭐ | $0 |
| **GitLab CI** | ☁️/🏠 Ambos | Times que querem tudo em um lugar | ⭐⭐⭐ | $0 |
| **CircleCI** | ☁️ SaaS | Velocidade e simplicidade | ⭐⭐ | $$$ |
| **Azure DevOps** | ☁️ SaaS | Empresas Microsoft | ⭐⭐⭐ | $$$ |

### 3.3 Como Escolher? (Guia Prático)

**Responda estas perguntas:**

1. **Qual seu orçamento?**
   - $0 → GitHub Actions, GitLab CI (free tier)
   - $$$ → CircleCI, Azure DevOps
   - Tempo para manter → Jenkins

2. **Onde está seu código?**
   - GitHub → GitHub Actions (óbvio!)
   - GitLab → GitLab CI
   - Outro → Jenkins, CircleCI

3. **Qual tamanho da equipe?**
   - 1-5 pessoas → GitHub Actions
   - 5-20 pessoas → GitLab CI
   - 20+ pessoas → Jenkins

4. **Precisa de muita customização?**
   - Não → GitHub Actions
   - Sim → Jenkins

<div style="background: #f3e8ff; padding: 1.5rem; border-left: 4px solid #8b5cf6; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>🎯 Dica do Instrutor:</strong>
  <p>Comece com <strong>GitHub Actions</strong> se usa GitHub, ou <strong>GitLab CI</strong> se usa GitLab. São as mais fáceis para aprender e já cobrem 90% das necessidades.</p>
</div>

### 3.4 Jenkins: O Velho Guerreiro

**Por que ainda é popular?**
- Open source (grátis)
- 1,800+ plugins (faz TUDO)
- Muito flexível
- Comunidade enorme

**Desafios:**
- Configuração complexa
- Precisa de manutenção
- Interface "datada"

```groovy
// Exemplo Jenkins (mais complexo)
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
            }
        }
    }
}
```

### 3.5 GitHub Actions: O Novo Fenômeno

**Por que é popular?**
- Integração nativa com GitHub
- YAML simples
- Marketplace de ações
- Começar em 5 minutos

```yaml
# Simples, não?
- name: Run Tests
  run: npm test
```

---

## 🔍 Seção 4: Boas Práticas - Fazendo Certo

### 4.1 Pipeline Rápida = Feedback Rápido

**Regra de ouro:** Sua pipeline deve ser mais rápida que seu café!

**Tempos ideais:**
- Feedback inicial (build + testes básicos): **< 5 minutos**
- Pipeline completa: **< 15 minutos**
- Aceitável: **< 30 minutos**
- Problema: **> 30 minutos**

**Como acelerar:**
1. **Cache:** Não baixe dependências toda vez
   ```yaml
   - name: Cache node modules
     uses: actions/cache@v3
     with:
       path: node_modules
       key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
   ```

2. **Paralelismo:** Rode coisas juntas
   ```yaml
   # Testes unitários e lint rodam juntos
   unit-tests:
     # ...
   
   lint:
     # ... (roda ao mesmo tempo!)
   ```

3. **Testes inteligentes:** Só rode o necessário

### 4.2 Segurança em Primeiro Lugar

**O que NUNCA fazer:**
```yaml
# ❌ NUNCA ISSO!
env:
  SENHA: "minhasenha123"  # Vaza no repositório!
```

**O que fazer SEMPRE:**
```yaml
# ✅ SEMPRE ISSO!
env:
  SENHA: ${{ secrets.MINHA_SENHA }}  # Seguro!
```

**Secrets gerenciados:**
- GitHub: Settings → Secrets and variables → Actions
- GitLab: Settings → CI/CD → Variables
- Jenkins: Credentials plugin

### 4.3 Trunk-Based Development (TBD)

**O que é?** Trabalhar em branches pequenas e de curta duração.

**Antigo (Git Flow):**
```
feature/big-feature (2 semanas)
    ↓
develop (merge complexo)
    ↓
release (1 semana de teste)
    ↓
main/production
```

**Moderno (TBD):**
```
feature/small-change (1 dia)
    ↓
main (merge direto, testes rodam)
    ↓
production (deploy automático)
```

**Por que TBD com CI/CD?**
- Menos conflitos de merge
- Feedback mais rápido
- Deploys mais frequentes
- Menos bugs de integração

### 4.4 Feature Flags: Deploy sem Medo

**Problema:** "E se meu código novo quebrar tudo?"

**Solução:** Feature flags!

```javascript
// No seu código
if (featureFlags.NOVA_FUNCIONALIDADE) {
    // Código novo
} else {
    // Código antigo
}
```

**Benefícios:**
- Deploy código sem ativar funcionalidade
- Ativar para alguns usuários primeiro
- Desligar rápido se der problema
- Teste A/B fácil

---

## ⚠️ Seção 5: Problemas Comuns (E Como Resolver)

### 5.1 "Minha Pipeline Demora Muito!"

**Sintomas:**
- Desenvolvedores não esperam pelo feedback
- Commit e vai tomar café...
- Pipeline trava outras mudanças

**Soluções:**
1. **Identifique o gargalo:**
   ```yaml
   # Adicione timers
   - name: Start timer
     run: echo "START_TIME=$(date +%s)" >> $GITHUB_ENV
   
   # ... seus steps ...
   
   - name: End timer
     run: |
       END_TIME=$(date +%s)
       DURATION=$((END_TIME - START_TIME))
       echo "Levou $DURATION segundos"
   ```

2. **Estratégias:**
   - **Cache:** Dependências, imagens Docker
   - **Paralelismo:** Jobs independentes rodam juntos
   - **Split:** Pipeline curta para feedback + longa para tudo

### 5.2 "Testes Flaky" (Os que Falham Aleatoriamente)

**O que são:** Testes que às vezes passam, às vezes falham.

**Por que acontece:**
- Dependência externa (API, banco)
- Timing issues (muito rápido/lento)
- Estado compartilhado (um teste afeta outro)

**Soluções:**
1. **Identifique:** Marque testes flaky
2. **Isole:** Rode separadamente
3. **Melhore:** Mock externos, reset estado
4. **Monitore:** Track falhas intermitentes

```yaml
# Estratégia: Retry automático
- name: Run tests with retry
  run: |
    for i in {1..3}; do
      npm test && break || sleep 5
    done
```

### 5.3 "Build Breaker" - O Commit que Quebra Tudo

**O que é:** Um commit que faz a pipeline falhar.

**Como lidar:**
1. **Prioridade #1:** Corrigir imediatamente
2. **Reverter:** Volte o commit problemático
3. **Hotfix:** Corrija rápido na main
4. **Prevenção:** Code review, testes locais

<div style="background: #fee2e2; padding: 1.5rem; border-left: 4px solid #ef4444; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>🚫 Regra sagrada:</strong>
  <p><strong>NUNCA ignore uma pipeline falhando.</strong> Se está vermelho, pare tudo e corrija. Pipeline verde = confiança.</p>
</div>

### 5.4 "Funciona na Minha Máquina!"

**Problema clássico:** Código roda local, quebra na pipeline.

**Causas:**
- Dependências diferentes
- Variáveis de ambiente
- Sistema operacional
- Versões de ferramentas

**Solução:** Containerização (Docker)!

```yaml
# Use containers consistentes
jobs:
  test:
    container: node:18-alpine  # Mesmo ambiente sempre
    steps:
      - run: npm test
```

---

## 🎨 Seção 6: Estratégias Avançadas de Deploy

### 6.1 Blue-Green Deployment (Azul-Verde)

**Analogia:** Dois teatros idênticos.

**Funcionamento:**
```
TEATRO AZUL: Usuários atuais
TEATRO VERDE: Nova versão (testando)

1. Usuários no AZUL
2. Deploy nova versão no VERDE
3. Testa VERDE
4. Troca tráfego: AZUL → VERDE
5. AZUL vira backup
```

**Vantagens:**
- Zero downtime
- Rollback instantâneo (volta para AZUL)
- Teste antes de liberar

### 6.2 Canary Release (Release Canário)

**Analogia:** Canários em minas de carvão.

**Funcionamento:**
```
100% usuários → versão antiga
  ↓
5% usuários → nova versão (canários)
  ↓
Se ok: 25% → 50% → 100%
Se ruim: volta 0%
```

**Vantagens:**
- Risco baixo (só 5% afetados)
- Feedback real de usuários
- Rollback fácil

### 6.3 Feature Flags + Canary

**Combo poderosa:**
1. Deploy código com feature flag OFF
2. Ativar flag para 5% dos usuários (Canary)
3. Monitorar métricas
4. Se ok: ativar para todos
5. Se ruim: desativar flag

```javascript
// Exemplo prático
if (featureFlag.isEnabled('nova-ui', userId)) {
    renderNovaUI();
} else {
    renderUIAntiga();
}
```

---

## 📊 Seção 7: Métricas - O Que Medir?

### 7.1 As 4 Métricas do DORA (Google)

**1. Lead Time for Changes**
- **O que é:** Tempo do commit até produção
- **Bom:** < 1 dia
- **Ruim:** > 1 mês
- **Como medir:** Data do commit → data do deploy

**2. Deployment Frequency**
- **O que é:** Com que frequência faz deploy
- **Bom:** Múltiplos por dia
- **Ruim:** Mensal
- **Como medir:** Contar deploys por período

**3. Change Failure Rate**
- **O que é:** % de deploys que causam problemas
- **Bom:** < 15%
- **Ruim:** > 45%
- **Como medir:** (Deploys com problemas / Total deploys) × 100

**4. Mean Time to Recovery (MTTR)**
- **O que é:** Tempo para recuperar de falha
- **Bom:** < 1 hora
- **Ruim:** > 1 semana
- **Como medir:** Tempo do incidente até resolução

<div style="background: #dbeafe; padding: 1.5rem; border-left: 4px solid #3b82f6; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>📈 Dica de métricas:</strong>
  <p>Comece medindo apenas o <strong>Lead Time</strong>. É a métrica mais fácil e mostra rapidamente se suas melhorias estão funcionando.</p>
</div>

### 7.2 Métricas de Pipeline

**Tempo de execução:**
- Build: < 5 min
- Testes: < 10 min
- Pipeline completa: < 30 min

**Taxa de sucesso:**
- Aceitável: > 90%
- Bom: > 95%
- Excelente: > 98%

**Custo:**
- Custo por build
- Custo por deploy
- ROI (Retorno sobre investimento)

---

## 🚀 Seção 8: Próximos Passos - Sua Jornada Continua

### 8.1 Primeiros Passos Práticos

**Nível 1: Bebê (Primeira semana)**
1. Crie conta no GitHub/GitLab
2. Siga um tutorial de "Hello World" de CI/CD
3. Automatize testes de um projeto pessoal
4. Comemore seu primeiro deploy automático! 🎉

**Nível 2: Caminhando (Primeiro mês)**
1. Adicione cache à sua pipeline
2. Configure notificações (Slack/Email)
3. Adicione análise de código (SonarQube)
4. Implemente deploy automático para staging

**Nível 3: Correndo (Primeiro trimestre)**
1. Implemente Blue-Green ou Canary
2. Configure monitoramento da pipeline
3. Automatize rollback
4. Documente todo o processo

### 8.2 Projetos para Praticar

**Projeto 1: Pipeline Simples**
- Objetivo: Testes + Build
- Ferramenta: GitHub Actions
- Dificuldade: ⭐☆☆☆☆

**Projeto 2: Pipeline Completa**
- Objetivo: Testes + Build + Deploy
- Ferramenta: GitLab CI
- Dificuldade: ⭐⭐☆☆☆

**Projeto 3: Pipeline Empresarial**
- Objetivo: Tudo + Segurança + Monitoramento
- Ferramenta: Jenkins
- Dificuldade: ⭐⭐⭐⭐☆

### 8.3 Recursos para Aprender Mais

**Livros recomendados:**
- "Accelerate" - Nicole Forsgren (a Bíblia)
- "Continuous Delivery" - Jez Humble (clássico)
- "The DevOps Handbook" - Gene Kim (prático)

**Cursos online:**
- CI/CD Fundamentals (Coursera)
- GitHub Actions (YouTube - free)
- Jenkins Masterclass (Udemy)

**Comunidades:**
- /r/devops no Reddit
- DevOps Brasil no Telegram
- CNCF Slack (canal #ci-cd)

**Blogs para seguir:**
- Martin Fowler (martinfowler.com)
- DZone CI/CD
- DevOps.com

---

## ✅ Conclusão - Você Conseguiu!

### 🎉 Parabéns por chegar até aqui!

Você acabou de aprender um dos tópicos mais importantes do desenvolvimento moderno. Vamos recapitular:

**O que você aprendeu:**

1. **CI/CD não é bicho de 7 cabeças** - É apenas automação inteligente
2. **CI = Integração Contínua** - Testar código frequentemente
3. **CD = Entrega Contínua** - Ter código sempre pronto para produção
4. **CD = Implantação Contínua** - Deploy automático (opcional)
5. **Pipeline = Receita automatizada** - Passo a passo do código à produção
6. **Ferramentas variam** - Escolha baseada em seu contexto
7. **Boas práticas existem** - Segurança, velocidade, métricas
8. **Problemas têm solução** - Pipeline lenta, testes flaky, etc.

### 🏆 Seu Certificado Espera!

Agora você está pronto para o desafio final: o **quiz de 30 perguntas**.

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 1rem; color: white; text-align: center; margin: 2rem 0;">
  <h3 style="color: white; margin-bottom: 1rem;">🎯 Hora do Quiz!</h3>
  <p style="margin-bottom: 1rem;"><strong>30 perguntas • 25 minutos • Nota mínima: 70%</strong></p>
  <p style="margin-bottom: 1.5rem;">Use tudo que aprendeu. As perguntas cobrem exatamente o conteúdo deste curso.</p>
  
  <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
    <p style="margin: 0;"><strong>Dicas para o quiz:</strong></p>
    <ul style="text-align: left; margin: 0.5rem 0 0 0; padding-left: 1.5rem;">
      <li>CI = Integração Contínua</li>
      <li>Delivery ≠ Deployment (manual vs automático)</li>
      <li>Pipeline lenta = anti-padrão</li>
      <li>GitHub Actions = SaaS, Jenkins = Self-hosted</li>
    </ul>
  </div>
  
  <p><strong>Você vai se surpreender com quanto aprendeu! 💪</strong></p>
</div>