# Gestor de Tarefas Pessoal

**Projeto 01 — CTeSP TPSI | ESTG-IPVC**  
**Aluno:** David Faria — N 36660

Aplicação web fullstack para gestão de tarefas pessoais do dia a dia, com autenticação, calendário mensal interativo, categorias, prioridades, horários e recorrência.

---

## Tecnologias

**Backend:** Node.js · Express · Prisma ORM v5 · PostgreSQL · JWT · bcryptjs

**Frontend:** React · react-big-calendar · moment.js · react-datepicker

**Deploy:** Vercel · Neon PostgreSQL

---

## Funcionalidades

- Registo e login com JWT
- Calendário mensal interativo
- Criar, editar e eliminar tarefas
- Categorias: Casa, Trabalho, Escola, Outro
- Prioridades: Baixa, Media, Alta
- Hora opcional por tarefa
- Repeticao: diaria, semanal, mensal, anual
- Filtros por prioridade e estado
- Pesquisa de tarefas por titulo
- Estatisticas: total, concluidas, pendentes
- Notificacoes no browser para tarefas proximas
- Perfil com edicao de nome e password
- Redirecionamento automatico ao expirar sessao

---

## Deploy

- **Frontend:** https://frontend-black-iota-54.vercel.app
- **Backend:** https://pw-p-lab-gestor-de-tarefas-pessoal.vercel.app

---

## Instalacao Local

### Pre-requisitos
- Node.js v18+
- PostgreSQL

### 1. Clonar o repositorio
```bash
git clone https://github.com/DavidFaria11/PW-P-LAB-Gestor-de-tarefas-pessoal-36660.git
cd PW-P-LAB-Gestor-de-tarefas-pessoal-36660
```

### 2. Instalar dependencias do backend
```bash
npm install
```

### 3. Configurar variaveis de ambiente
Cria um ficheiro `.env` na raiz com base no `.env.example`:
```env
DATABASE_URL="postgresql://postgres:SUAPASSWORD@localhost:5432/taskmanager"
JWT_SECRET="segredo123"
PORT=5000
```

### 4. Criar a base de dados
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Instalar dependencias do frontend
```bash
cd frontend
npm install
```

---

## Executar Localmente

**Terminal 1 — Backend**
```bash
npm run dev
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm start
```

Abre `http://localhost:3000` no browser.

---

## Endpoints da API

| Metodo | Endpoint | Descricao | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registar utilizador | Nao |
| POST | `/api/auth/login` | Login e obter token JWT | Nao |
| GET | `/api/tasks` | Listar tarefas | JWT |
| POST | `/api/tasks` | Criar tarefa | JWT |
| PUT | `/api/tasks/:id` | Atualizar tarefa | JWT |
| DELETE | `/api/tasks/:id` | Eliminar tarefa | JWT |
| GET | `/api/tasks/stats` | Estatisticas | JWT |
| GET | `/api/user` | Ver perfil | JWT |
| PUT | `/api/user` | Atualizar perfil | JWT |

---

## Autor

**David Faria** — N 36660  
CTeSP TPSI | ESTG-IPVC | 2025/2026