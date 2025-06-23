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
git clone <repository-url>
cd <project-name>
```

2. Configure as variáveis de ambiente:
```bash
cp .env-example .env
```

3. Edite o arquivo `.env` com suas configurações:
```env
NODE_ENV=production
PORT=3333
DATABASE_URL=postgresql://your_db_user:your_db_password@db:5432/your_db_name?schema=public
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DATABASE=your_db_name
```

## 🐳 Execução com Docker (Recomendado)

### Desenvolvimento
```bash
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
# Executar tudo com Docker Compose
docker-compose up --build

# Executar em background
docker-compose up -d --build
```

## 💻 Execução Local

1. Instale as dependências:
```bash
npm install
```

2. Execute as migrações:
```bash
npm run prisma:migrate
```

3. Execute o seed dos dados:
```bash
npm run seed:dev
```

4. Inicie o servidor de desenvolvimento:
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