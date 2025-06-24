# CCaaS API

API de gerenciamento de clientes para o projeto CCaaS, construída com Fastify, Prisma e PostgreSQL.

## 🚀 Características

- **Fastify**: Framework web rápido e eficiente
- **Prisma**: ORM moderno com type safety
- **PostgreSQL**: Banco de dados robusto
- **Docker**: Containerização completa
- **TypeScript**: Type safety em todo o projeto
- **Health Checks**: Monitoramento de saúde da aplicação

## 📋 Pré-requisitos

- Node.js 18+ 
- Docker e Docker Compose
- PostgreSQL (opcional para desenvolvimento local)

## ⚙️ Configuração

1. Clone o repositório:
```bash
git clone https://github.com/lucasquitan/poc-ccaas.git
cd poc-ccaas
```

2. Configure as variáveis de ambiente:

### Opção 1: Script Automático (Recomendado)
```bash
# Para desenvolvimento local
./setup-env.sh dev

# Para produção (Docker)
./setup-env.sh production

# Para ver a configuração atual
./setup-env.sh show
```

### Opção 2: Configuração Manual
```bash
# Copie o arquivo de exemplo
cp .env-example .env

# Edite o arquivo .env com suas configurações
```

O arquivo `.env-example` contém configurações para diferentes ambientes:

- **Desenvolvimento**: Usa `localhost` como host do banco
- **Produção**: Usa `db` como host do banco (Docker Compose)
- **Teste**: Configuração separada para testes

## 🐳 Execução com Docker (Recomendado)

### Desenvolvimento
```bash
# Configurar ambiente de desenvolvimento
./setup-env.sh dev

# Iniciar apenas o banco de dados
docker-compose up db

# Em outro terminal, executar a aplicação localmente
npm install
npm run prisma:migrate
npm run seed:dev
npm run dev
```

### Produção
```bash
# Configurar ambiente de produção
./setup-env.sh production

# Executar tudo com Docker Compose
docker-compose up --build

# Executar em background
docker-compose up -d --build
```

## 💻 Execução Local

1. Configure o ambiente de desenvolvimento:
```bash
./setup-env.sh dev
```

2. Instale as dependências:
```bash
npm install
```

3. Execute as migrações:
```bash
npm run prisma:migrate
```

4. Execute o seed dos dados:
```bash
npm run seed:dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📚 Scripts Disponíveis

### Desenvolvimento
- `npm run dev` - Servidor de desenvolvimento com hot reload
- `npm run build` - Build de produção otimizado
- `npm run build:dev` - Build de desenvolvimento
- `npm run type-check` - Verificação de tipos TypeScript
- `npm run lint` - Verificação de código
- `npm run lint:fix` - Correção automática de código

### Banco de Dados
- `npm run prisma:generate` - Gera o cliente Prisma
- `npm run prisma:migrate` - Executa migrações em desenvolvimento
- `npm run prisma:migrate:deploy` - Executa migrações em produção
- `npm run prisma:db:push` - Aplica schema diretamente ao banco
- `npm run prisma:reset` - Reseta o banco de dados
- `npm run prisma:studio` - Abre o Prisma Studio
- `npm run seed:dev` - Executa o seed dos dados (desenvolvimento)
- `npm run seed:prod` - Executa o seed dos dados (produção)

### Docker
- `npm run docker:build` - Constrói a imagem Docker
- `npm run docker:run` - Executa o container

## 🔌 Endpoints da API

### Health Check
```http
GET /health
```
Verifica a saúde da aplicação e conectividade com o banco.

### Buscar Cliente por MSISDN
```http
GET /customers?msisdn=5511999999999
```
Retorna os dados do cliente baseado no MSISDN.

## 📊 Sistema de Logging

O sistema possui um middleware de logging personalizado que registra todas as requisições com as seguintes informações:

### Logs Padrão
- **Data e Hora**: Formato brasileiro (DD/MM/YYYY HH:MM:SS)
- **IP do Cliente**: Endereço IP de origem da requisição
- **Método HTTP**: GET, POST, PUT, DELETE, etc.
- **Rota Acessada**: URL completa da requisição
- **Código de Status**: Código HTTP de resposta (200, 404, 500, etc.)
- **Tempo de Resposta**: Tempo em milissegundos para processar a requisição

### Exemplo de Log
```
[25/12/2024 14:30:15] 192.168.1.100 - GET /customers?msisdn=5511999999999 - 200 (45ms)
[25/12/2024 14:30:20] 192.168.1.100 - GET /health - 200 (12ms)
[25/12/2024 14:30:25] 192.168.1.100 - GET /customers - 400 (8ms)
```

### Modo Debug (DEBUG_MODE=true)

Quando a variável `DEBUG_MODE` está habilitada, o sistema também registra:

- **Payload da Requisição**: Body, query parameters e route parameters
- **Payload da Resposta**: Dados retornados pela API (quando aplicável)
- **Logs de Eventos**: Eventos específicos da aplicação (health checks, buscas de clientes, etc.)

### Configuração do Debug Mode

No arquivo `.env`:
```bash
# Habilitar modo debug para logs detalhados
DEBUG_MODE=true
```

### Exemplo de Log com Debug Mode
```
[25/12/2024 14:30:15] 🔍 Customer lookup requested
📊 Data: {
  "msisdn": "5511999999999"
}

📥 Request Payload for GET /customers:
{
  "query": {
    "msisdn": "5511999999999"
  }
}

[25/12/2024 14:30:15] 192.168.1.100 - GET /customers?msisdn=5511999999999 - 200 (45ms)

[25/12/2024 14:30:15] 🔍 Customer found successfully
📊 Data: {
  "msisdn": "5511999999999",
  "customerMSISDN": "5511999999999"
}

📤 Response Payload for GET /customers:
{
  "MSISDN": "5511999999999",
  "CPF": "12345678901",
  "CUSNAME": "João Silva",
  "CUSCOMPANY": "Empresa ABC",
  "OPERATOR": "Vivo",
  "OPERATOR_ID": "VIVO001"
}
```

### Logs de Erro

Requisições com status code >= 400 são automaticamente logadas como erros:
```
[25/12/2024 14:30:25] 192.168.1.100 - GET /customers - 400 (8ms)
[25/12/2024 14:30:30] 192.168.1.100 - GET /customers?msisdn=invalid - 404 (15ms)
```

## 🏗️ Arquitetura

```
src/
├── app.ts                 # Configuração do Fastify
├── server.ts             # Ponto de entrada da aplicação
├── env/                  # Validação de variáveis de ambiente
├── domain/               # Camada de domínio
│   ├── entities/         # Entidades do domínio
│   └── repositories/     # Interfaces dos repositórios
├── routes/               # Rotas da API
├── use-case/             # Casos de uso
└── assets/               # Assets (seed, etc.)
```

## 🔧 Otimizações Implementadas

### Docker
- **Multi-stage build**: Reduz o tamanho da imagem final
- **Usuário não-root**: Melhora a segurança
- **Health checks**: Monitoramento automático
- **Layer caching**: Builds mais rápidos
- **Docker ignore**: Contexto otimizado

### Aplicação
- **Error handling**: Tratamento robusto de erros
- **Input validation**: Validação de parâmetros
- **Health endpoint**: Monitoramento de saúde
- **Type safety**: TypeScript em todo o projeto

### Infraestrutura
- **Restart policies**: Recuperação automática
- **Networks**: Isolamento de rede
- **Volumes**: Persistência de dados
- **Environment variables**: Configuração flexível

## 🚨 Troubleshooting

### Erro de conexão com banco
```bash
# Verificar se o banco está rodando
docker-compose ps

# Ver logs do banco
docker-compose logs db

# Reiniciar serviços
docker-compose restart
```

### Erro de migração
```bash
# Resetar banco e migrações
npm run prisma:reset

# Ou via Docker
docker-compose down -v
docker-compose up --build
```

## 📝 Licença

ISC 