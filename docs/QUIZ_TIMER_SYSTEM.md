# Sistema de Timer para Quiz

## Visão Geral

Este sistema implementa um timer regressivo completo para os quizzes da plataforma, com estados bem definidos e tratamento de expiração.

## Arquitetura

### 1. Hook `useQuizTimer` (`/src/hooks/useQuizTimer.ts`)

Hook personalizado que gerencia todo o estado e lógica do timer.

**Estados do Timer:**
- `not_started`: Quiz não foi iniciado
- `in_progress`: Timer rodando (decrementa a cada segundo)
- `finished`: Quiz completado antes do tempo expirar
- `expired`: Tempo esgotado

**API do Hook:**
```typescript
const {
  timeRemaining,    // Tempo restante em segundos
  timerState,       // Estado atual do timer
  formattedTime,    // Tempo formatado em mm:ss
  startTimer,       // Inicia o timer
  pauseTimer,       // Pausa o timer (se necessário)
  resetTimer,       // Reseta para o estado inicial
  finishQuiz,       // Marca como finalizado
} = useQuizTimer(timeLimit, onExpire);
```

**Características:**
- Countdown automático com `setInterval`
- Callback `onExpire` chamado quando tempo expira
- Limpeza automática de intervalos
- Formatação de tempo em `mm:ss`
- Gerenciamento de estado com `useState` e `useRef`

### 2. Componente Quiz (`/src/components/courses/Quiz.tsx`)

Atualizado para suportar timer e bloqueio de interações.

**Novas Props:**
- `isExpired?: boolean` - Indica se o tempo expirou
- `onStart?: () => void` - Callback chamado na primeira resposta

**Comportamento:**
- Bloqueia seleção de respostas quando `isExpired === true`
- Desabilita botões de navegação quando expirado
- Inicia timer automaticamente na primeira resposta
- Adiciona opacidade visual aos elementos bloqueados

### 3. QuizPageClient (`/src/app/cursos/[slug]/quiz/QuizPageClient.tsx`)

Integra o timer com a interface do usuário.

**Recursos Implementados:**

1. **Exibição do Timer**
   - Badge com countdown em tempo real
   - Cores dinâmicas baseadas no tempo restante:
     - Verde/Cinza: > 5 minutos
     - Amarelo: 1-5 minutos
     - Vermelho: < 1 minuto ou expirado
   - Ícone de relógio ao lado do timer

2. **Modal de Expiração**
   - Aparece automaticamente quando tempo expira
   - Não pode ser fechado clicando fora ou ESC
   - Única opção: "Refazer Quiz"
   - Design com ícone de alerta e cores de aviso
   - Mensagem clara sobre perda de respostas

3. **Integração com Fluxo do Quiz**
   - Timer inicia na primeira resposta
   - Timer para quando quiz é completado
   - Reset completo ao tentar novamente
   - Passa estado de expiração para componente Quiz

## Configuração no YAML

Cada quiz deve incluir o campo `time_limit` em segundos:

```yaml
quiz:
  course_id: git-basico
  title: Quiz de Git e GitHub
  time_limit: 600  # 10 minutos
  passing_score: 70
  questions:
    # ...
```

**Valores Recomendados:**
- Quiz rápido (5-10 perguntas): 120-300 segundos (2-5 min)
- Quiz médio (10-15 perguntas): 600-900 segundos (10-15 min)
- Quiz longo (15+ perguntas): 1200-1800 segundos (20-30 min)

**Valor Padrão:**
Se não especificado, o valor padrão é `1800` segundos (30 minutos) definido no schema Zod.

## Fluxo de Uso

1. **Início**
   - Usuário entra na página do quiz
   - Timer exibe o tempo total mas não está rodando
   - Estado: `not_started`

2. **Primeira Resposta**
   - Usuário seleciona primeira resposta
   - Callback `onStart()` é chamado
   - Timer inicia countdown
   - Estado: `in_progress`

3. **Durante o Quiz**
   - Timer decrementa a cada segundo
   - Badge muda de cor conforme tempo restante
   - Usuário navega e responde normalmente

4. **Conclusão Normal**
   - Usuário clica "Finalizar Quiz"
   - `finishQuiz()` é chamado
   - Timer para
   - Estado: `finished`

5. **Expiração**
   - Tempo chega a 0
   - Callback `onExpire()` é chamado
   - Modal aparece automaticamente
   - Todas as interações são bloqueadas
   - Estado: `expired`
   - Usuário deve clicar "Refazer Quiz" para tentar novamente

## Componentes UI Utilizados

- `Badge` - Exibição do timer com cores dinâmicas
- `Dialog` - Modal de expiração não-dismissível
- `AlertTriangle` - Ícone de aviso no modal
- `Clock` - Ícone ao lado do timer
- `RotateCcw` - Ícone no botão de refazer

## Prevenção de Manipulação

O sistema foi projetado para minimizar manipulação:

1. **Estado em Memória**: Timer roda no cliente mas não pode ser facilmente modificado
2. **Validação no Backend**: (Futuro) Tempo de início/fim podem ser validados no servidor
3. **Refresh da Página**: Ao fazer refresh, o quiz é reiniciado (perde progresso)
4. **LocalStorage**: Não armazena estado do timer para evitar manipulação

## Melhorias Futuras

Possíveis evoluções do sistema:

1. **Persistência do Timer**
   - Salvar tempo de início no localStorage
   - Validar tempo restante ao recarregar página
   - Prevenir refresh como forma de resetar tempo

2. **Validação Backend**
   - Enviar timestamp de início ao começar quiz
   - Validar tempo decorrido ao submeter respostas
   - Rejeitar submissões após time_limit

3. **Pausas Controladas**
   - Permitir pausar timer em situações específicas
   - Limitar número/duração de pausas

4. **Analytics**
   - Rastrear tempo médio de conclusão
   - Identificar perguntas que consomem mais tempo
   - Taxa de expiração por quiz

5. **Avisos de Tempo**
   - Notificação aos 5 minutos
   - Notificação ao 1 minuto
   - Som/vibração ao expirar (opcional)

## Testing

Para testar o sistema:

1. Configure um quiz com `time_limit: 60` (1 minuto)
2. Acesse o quiz e responda a primeira pergunta
3. Observe o timer decrementando em tempo real
4. Aguarde o tempo expirar ou navegue devagar
5. Verifique se o modal aparece corretamente
6. Teste o botão "Refazer Quiz"

## Exemplo de Quiz com Timer

```yaml
quiz:
  course_id: git-basico
  title: Quiz de Git e GitHub
  time_limit: 120  # 2 minutos
  passing_score: 70
  questions:
    - id: q1
      type: multiple_choice_single
      question: Qual comando cria um novo branch no Git?
      options:
        - "git branch <nome>"
        - "git make-branch <nome>"
        - "git new <nome>"
        - "git create-branch <nome>"
      correct_answer: 0
      explanation: O comando git branch <nome> cria um novo branch localmente.
      points: 10
```

## Suporte e Manutenção

**Arquivos Principais:**
- `/src/hooks/useQuizTimer.ts` - Lógica do timer
- `/src/components/courses/Quiz.tsx` - Componente do quiz
- `/src/app/cursos/[slug]/quiz/QuizPageClient.tsx` - Página do quiz
- `/src/lib/schemas/quiz.ts` - Schema com validação do time_limit

**Dependências:**
- React (useState, useEffect, useCallback, useRef)
- Lucide React (ícones)
- Componentes UI (Dialog, Badge, Button)
