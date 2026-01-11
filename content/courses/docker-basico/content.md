# Curso de Docker: Containers do Zero

> **Domine containers em 30 minutos!** Neste curso rápido, você vai entender os conceitos essenciais do Docker e como containers revolucionaram a forma como desenvolvemos e entregamos software.

## 🎯 O que você vai aprender em 30 minutos?

- ✅ **O que são containers** e por que são tão importantes
- ✅ **Como o Docker funciona** na prática
- ✅ **Comandos essenciais** que todo dev precisa conhecer
- ✅ **Comparação real** com máquinas virtuais
- ✅ **Primeiros passos** para começar a usar hoje mesmo

---

## 🚢 Capítulo 1: O Mundo Antes dos Containers

### 1.1 O Problema Clássico: "Funciona na Minha Máquina!"

**Cenário comum:**
```bash
# Desenvolvedor A (Mac):
✅ Aplicação funciona perfeitamente!

# Desenvolvedor B (Windows):
❌ "Não consigo rodar, falta uma biblioteca!"

# Servidor de Produção (Linux):
❌ "Erro de permissão, versão do Python diferente!"
```

**Por que isso acontece?**
- Sistemas operacionais diferentes
- Versões de bibliotecas diferentes
- Configurações de ambiente únicas
- Dependências específicas

### 1.2 A Solução Antiga: Máquinas Virtuais

**Como funcionava:**
```
SERVIDOR FÍSICO
├── Sistema Operacional Host
│   ├── Hipervisor (VMware, VirtualBox)
│   │   ├── MÁQUINA VIRTUAL 1
│   │   │   ├── Sistema Operacional Convidado
│   │   │   ├── Bibliotecas
│   │   │   └── Sua Aplicação
│   │   ├── MÁQUINA VIRTUAL 2
│   │   │   ├── Outro Sistema Operacional
│   │   │   ├── Outras Bibliotecas
│   │   │   └── Outra Aplicação
```

**Problemas das VMs:**
- **Pesadas:** Cada VM tem seu próprio SO completo
- **Lentas:** Boot demorado, consumo alto de recursos
- **Complexas:** Muita configuração necessária

---

## 📦 Capítulo 2: Containers - A Revolução

### 2.1 O que É um Container? (Analogia da Caixa de Transporte)

**Pense assim:** Um container de navio de carga!

```
CONTÊINER DE NAVIO:
├── Produto (sua aplicação)
├── Embalagem (dependências)
├── Instruções (configurações)
└── Pode ser transportado para:
    - Qualquer navio
    - Qualquer porto
    - Qualquer país
    → E funciona igual!
```

**Container Docker funciona da mesma forma:**
- **Contém** sua aplicação + dependências
- **Isolado** do resto do sistema
- **Portátil** - roda em qualquer lugar
- **Consistente** - funciona igual em todos os lugares

### 2.2 Como Funciona? (Arquitetura Simples)

```
SEU COMPUTADOR
├── Sistema Operacional (Linux, Mac, Windows)
│   ├── Docker Engine
│   │   ├── CONTAINER 1 (App Node.js)
│   │   │   ├── Node.js 18
│   │   │   ├── Bibliotecas
│   │   │   └── Seu código
│   │   ├── CONTAINER 2 (App Python)
│   │   │   ├── Python 3.11
│   │   │   ├── Bibliotecas
│   │   │   └── Seu código
│   │   └── CONTAINER N... (todos compartilham o kernel!)
```

<div style="background: #f0f9ff; padding: 1.5rem; border-left: 4px solid #0ea5e9; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>💡 Ponto-chave:</strong>
  <p>Containers <strong>compartilham o kernel do sistema operacional host</strong>, enquanto VMs precisam de um kernel completo cada uma. Isso torna containers muito mais leves e rápidos.</p>
</div>

### 2.3 Containers vs VMs: Comparação Visual

| Característica | Container (Docker) | Máquina Virtual |
|----------------|-------------------|-----------------|
| **Tamanho** | MBs (leve) | GBs (pesado) |
| **Inicialização** | Segundos | Minutos |
| **Performance** | Quase nativa | Overhead significativo |
| **Portabilidade** | Alta (mesma imagem) | Média (depende do hypervisor) |
| **Isolamento** | Processo/nível de SO | Hardware completo |

**Exemplo numérico:**
```bash
# Container Docker
Tamanho: ~50MB      Boot: 2 segundos     Memória: 100MB

# Máquina Virtual
Tamanho: ~2GB       Boot: 60 segundos    Memória: 1GB
```

---

## 🏗️ Capítulo 3: Os Pilares do Docker

### 3.1 Imagem: O Molde

**Pense numa imagem como:** Uma receita de bolo ou um molde de biscoito.

**O que contém uma imagem Docker:**
- Sistema operacional mínimo (Linux Alpine, Ubuntu slim)
- Sua aplicação (código compilado ou interpretado)
- Dependências (bibliotecas, frameworks)
- Configurações (variáveis de ambiente, portas)
- Comandos padrão (o que roda ao iniciar)

**Exemplos de imagens populares:**
- `node:18-alpine` (Node.js em Alpine Linux - 100MB)
- `python:3.11-slim` (Python slim - 120MB)
- `nginx:alpine` (Servidor web - 40MB)
- `postgres:15` (Banco de dados - 380MB)

### 3.2 Container: A Instância em Execução

**Pense num container como:** O bolo assado da receita.

**Relação Imagem → Container:**
```
IMAGEM (node:18)                 CONTAINER (em execução)
├── Node.js 18                   ├── Node.js 18 (rodando)
├── Linux Alpine                 ├── Processo do seu app
├── Diretório /app               ├── Sistema de arquivos
└── Comando: node app.js         └── Porta 3000 exposta
```

**Importante:** Você pode ter múltiplos containers rodando da MESMA imagem!

```
node:18 (IMAGEM)
├── Container 1 (App Frontend) na porta 3000
├── Container 2 (App Backend) na porta 8080
└── Container 3 (Worker) processando fila
```

### 3.3 Dockerfile: A Receita

**O Dockerfile é o arquivo de texto** que ensina o Docker como construir sua imagem personalizada.

**Exemplo super simples:**
```dockerfile
# Dockerfile
FROM node:18-alpine          # Imagem base (molde inicial)
WORKDIR /app                 # Diretório de trabalho
COPY package*.json ./        # Copia arquivos de dependência
RUN npm install              # Instala dependências
COPY . .                     # Copia o código da aplicação
EXPOSE 3000                  # Expõe porta 3000
CMD ["npm", "start"]         # Comando padrão ao iniciar
```

<div style="background: #dcfce7; padding: 1.5rem; border-left: 4px solid #22c55e; border-radius: 0.5rem; margin: 1.5rem 0;">
  <strong>✅ Dica rápida:</strong>
  <p>Um Dockerfile é como um script de instalação automática para sua aplicação. Ele garante que qualquer pessoa (ou servidor) consiga criar exatamente o mesmo ambiente.</p>
</div>

---

## 🛠️ Capítulo 4: Comandos Essenciais (Os 8 que Você Precisa)

### 4.1 O Ciclo de Vida Básico

```
1. docker build       # Cria imagem do Dockerfile
2. docker run         # Roda container da imagem
3. docker ps          # Lista containers em execução
4. docker stop        # Para container
5. docker rm          # Remove container parado
6. docker images      # Lista imagens locais
7. docker rmi         # Remove imagem
8. docker logs        # Vê logs do container
```

### 4.2 Exemplos Práticos Passo a Passo

**Passo 1: Criar uma imagem**
```bash
# No diretório com seu Dockerfile
docker build -t minha-app:1.0 .
# -t = tag (nome da imagem)
# . = diretório atual (onde está o Dockerfile)
```

**Passo 2: Rodar um container**
```bash
docker run -d -p 3000:3000 --name meu-app minha-app:1.0
# -d = detach (roda em background)
# -p 3000:3000 = mapeia porta host:container
# --name = nome amigável para o container
```

**Passo 3: Verificar se está rodando**
```bash
docker ps
# Saída:
# CONTAINER ID   IMAGE           STATUS         PORTS
# abc123def456   minha-app:1.0   Up 2 minutes   0.0.0.0:3000->3000/tcp
```

**Passo 4: Ver logs da aplicação**
```bash
docker logs meu-app
# Mostra o output do console da sua aplicação
```

**Passo 5: Parar o container**
```bash
docker stop meu-app
# Para graciosamente (envia sinal SIGTERM)

docker rm meu-app
# Remove o container (após parar)
```

### 4.3 Comandos Úteis do Dia a Dia

**Entrar no container (shell):**
```bash
docker exec -it meu-app sh
# -it = modo interativo com terminal
# sh = shell (ou bash, se disponível)
```

**Copiar arquivos:**
```bash
# Do host para o container
docker cp arquivo.txt meu-app:/app/arquivo.txt

# Do container para o host
docker cp meu-app:/app/logs.txt ./logs.txt
```

**Inspecionar container:**
```bash
docker inspect meu-app
# Mostra TODAS as informações do container
```

---

## 🎯 Capítulo 5: Casos de Uso Reais

### 5.1 Desenvolvimento Local

**Problema:** Time com 5 desenvolvedores, cada um com setup diferente.

**Solução Docker:**
```dockerfile
# Dockerfile.dev
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
CMD ["npm", "run", "dev"]
```

```bash
# Todos os devs rodam:
docker build -f Dockerfile.dev -t app-dev .
docker run -p 3000:3000 -v $(pwd):/app app-dev
# -v = volume (sincroniza código do host com container)
```

**Resultado:** Mesmo ambiente para todos!

### 5.2 Ambiente de Testes CI/CD

**Pipeline de testes automatizados:**
```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    container: node:18  # Ambiente consistente!
    steps:
      - run: npm test   # Testes rodam no container
```

**Vantagem:** Mesmo ambiente que produção!

### 5.3 Microserviços

**Aplicação moderna:**
```
App E-commerce:
├── Container 1: Frontend (React)
├── Container 2: Backend API (Node.js)
├── Container 3: Banco de dados (PostgreSQL)
├── Container 4: Cache (Redis)
└── Container 5: Mensageria (RabbitMQ)
```

**Cada serviço:** Sua própria imagem, sua própria escalabilidade.

---

## ⚡ Capítulo 6: Vantagens em 5 Minutos

### 6.1 Para Desenvolvedores

**✅ "Funciona na minha máquina" VIRA "Funciona no container"**
- Ambiente idêntico em dev, test, prod
- Setup rápido para novos desenvolvedores
- Sem conflitos de dependências

**✅ Produtividade aumentada**
- Não perde tempo configurando ambiente
- Foca no código, não no setup
- Testa múltiplas versões facilmente

### 6.2 Para Operações/DevOps

**✅ Deploy consistente**
- Mesma imagem em todos os ambientes
- Rollback fácil (usa imagem anterior)
- Versionamento de ambientes

**✅ Escalabilidade simplificada**
- Sobe novos containers em segundos
- Orquestração com Kubernetes/Docker Swarm
- Auto-scaling baseado em demanda

### 6.3 Para a Empresa

**✅ Redução de custos**
- Menos servidores (containers são leves)
- Melhor utilização de recursos
- Redução de tempo de inatividade

**✅ Velocidade de entrega**
- Deploys mais frequentes
- Menos bugs em produção
- Time-to-market reduzido

---

## 🚀 Capítulo 7: Primeiros Passos HOJE!

### 7.1 Instalação Rápida

**Windows/Mac:**
1. Baixe Docker Desktop: [docker.com/get-started](https://www.docker.com/get-started)
2. Instale (Next, Next, Finish)
3. Abra terminal e teste:
   ```bash
   docker --version
   docker run hello-world
   ```

**Linux (Ubuntu):**
```bash
# Instalação via script oficial
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Reinicie o terminal!
```

### 7.2 Seu Primeiro Projeto Docker (5 minutos)

**Passo 1: Crie um diretório**
```bash
mkdir meu-primeiro-container
cd meu-primeiro-container
```

**Passo 2: Crie um arquivo index.html**
```html
<!-- index.html -->
<h1>Meu primeiro container! 🐳</h1>
<p>Funcionou perfeitamente!</p>
```

**Passo 3: Crie um Dockerfile**
```dockerfile
# Dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
```

**Passo 4: Construa e execute!**
```bash
docker build -t meu-site .
docker run -d -p 8080:80 meu-site
```

**Passo 5: Acesse!**
Abra no navegador: [http://localhost:8080](http://localhost:8080)

🎉 **Parabéns! Você rodou seu primeiro container!**

### 7.3 Próximos Passos no Aprendizado

**Para continuar aprendendo:**

1. **Hoje (15 minutos extras):**
   - Brinque com `docker ps`, `docker logs`, `docker stop`
   - Modifique o index.html e reconstrua a imagem

2. **Esta semana:**
   - Aprenda sobre `docker-compose` (múltiplos containers)
   - Suba um app Node.js + banco de dados
   - Crie volumes para persistir dados

3. **Próximo mês:**
   - Estude orquestração com Docker Swarm/Kubernetes
   - Implemente CI/CD com containers
   - Explore Docker Hub (repositório de imagens)

---

## 📚 Resumo Final

### O que você aprendeu em 30 minutos:

**✅ Containers não são VMs:**
- Mais leves (MB vs GB)
- Mais rápidos (segundos vs minutos)
- Compartilham kernel do host

**✅ Docker tem 3 conceitos principais:**
1. **Imagem:** Molde/Receita
2. **Container:** Instância em execução
3. **Dockerfile:** Instruções para criar imagem

**✅ 8 comandos essenciais:**
```bash
docker build    # Cria imagem
docker run      # Roda container
docker ps       # Lista containers
docker stop     # Para container
docker rm       # Remove container
docker images   # Lista imagens
docker rmi      # Remove imagem
docker logs     # Vê logs
```

**✅ Vantagens práticas:**
- Elimina "funciona na minha máquina"
- Ambiente consistente em dev/test/prod
- Deploy mais rápido e confiável
- Melhor uso de recursos

### 🎓 Você está pronto para:

1. **Usar Docker no dia a dia** para seus projetos
2. **Entender artigos/tutoriais** sobre containers
3. **Participar de discussões** sobre DevOps
4. **Começar a aprender** orquestração (próximo nível!)

---

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 1rem; color: white; text-align: center; margin: 2rem 0;">
  <h3 style="color: white; margin-bottom: 1rem;">🎯 Hora de Praticar!</h3>
  <p style="margin-bottom: 1.5rem;">Teste seu conhecimento com o quiz rápido sobre Docker.</p>
  <p><strong>10 perguntas • 10 minutos • Você consegue! 🐳</strong></p>
</div>