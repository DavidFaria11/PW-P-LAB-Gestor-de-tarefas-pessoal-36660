---

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js v18+
- PostgreSQL

### 1. Clonar o repositório
```bash
git clone https://github.com/DavidFaria11/PW-P-LAB-Gestor-de-tarefas-pessoal-36660.git
cd PW-P-LAB-Gestor-de-tarefas-pessoal-36660
```

### 2. Instalar dependências do backend
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Cria um ficheiro `.env` na raiz com o seguinte conteúdo:
```env
DATABASE_URL="postgresql://postgres:SUAPASSWORD@localhost:5432/taskmanager"
JWT_SECRET="segredo123"
PORT=5000
```

### 4. Criar a base de dados e aplicar migrações
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Instalar dependências do frontend
```bash
cd frontend
npm install
```

---

## ▶️ Executar a Aplicação

Precisas de dois terminais abertos em simultâneo:

**Terminal 1 — Backend**
```bash
npm run dev
```
O servidor arranca em `http://localhost:5000`

**Terminal 2 — Frontend**
```bash
cd frontend
npm start
```
A aplicação abre em `http://localhost:3000`

---

## 🔗 Endpoints da API

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registar utilizador |
| POST | `/api/auth/login` | Login e obter token JWT |

### Tarefas (requer token JWT)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/tasks` | Listar tarefas (suporta filtros) |
| POST | `/api/tasks` | Criar tarefa |
| PUT | `/api/tasks/:id` | Atualizar tarefa |
| DELETE | `/api/tasks/:id` | Eliminar tarefa |
| GET | `/api/tasks/stats` | Estatísticas das tarefas |

### Perfil (requer token JWT)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/user` | Ver perfil |
| PUT | `/api/user` | Atualizar nome ou password |

---

## ✨ Funcionalidades

- ✅ Registo e login com JWT
- ✅ Calendário semanal com navegação por semanas
- ✅ Criar, editar e eliminar tarefas
- ✅ Categorias: Casa, Trabalho, Escola, Outro
- ✅ Prioridades: Baixa, Média, Alta
- ✅ Hora opcional por tarefa
- ✅ Repetição: diária, semanal, mensal, anual
- ✅ Filtros por prioridade e estado
- ✅ Pesquisa de tarefas por título
- ✅ Estatísticas: total, concluídas, pendentes
- ✅ Página de perfil com edição de nome e password
- ✅ Redireccionamento automático ao expirar sessão
- ✅ Confirmação antes de eliminar tarefa

---

## 👤 Autor

**David Faria** — Nº 36660  
CTeSP TPSI | ESTG-IPVC  
2025/2026