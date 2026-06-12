## 🌐 Deploy

- **Frontend:** https://frontend-black-iota-54.vercel.app
- **Backend:** https://pw-p-lab-gestor-de-tarefas-pessoal.vercel.app

---

## ⚙️ Instalação Local

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
Cria um ficheiro `.env` na raiz:
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

### 5. Instalar dependências do frontend
```bash
cd frontend
npm install
```

---

## ▶️ Executar Localmente

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