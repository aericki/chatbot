# ChatBot da Barbearia / Barbearia ChatBot

Um aplicativo de chatbot em tempo real para agendamento de serviços de barbearia. Este projeto utiliza **Socket.io** para comunicação bidirecional em tempo real, **Express** para o backend, **Prisma** para persistência de dados (SQLite por padrão) e **React** para o frontend.

A aplicação diferencia usuários novos e usuários de retorno. Usuários registrados (cujo cadastro foi salvo localmente) iniciam diretamente o fluxo de agendamento, enquanto novos usuários passam pelo fluxo de cadastro.

## 📌 Índice

- [Recursos](#recursos)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
  - [Pré-requisitos](#pré-requisitos)
  - [Configuração do Backend](#configuração-do-backend)
  - [Configuração do Frontend](#configuração-do-frontend)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Contato](#contato)

---

## 🚀 Recursos

- **Agendamento de Serviços:** Permite agendar serviços (ex.: Corte, Barba, Corte e Barba, Coloração) especificando dia e horário.
- **Fluxo Personalizado:** Fluxo de conversa diferente para novos usuários e usuários de retorno.
- **Comunicação em Tempo Real:** Implementada com Socket.io para uma experiência de chat interativo.
- **Persistência de Dados:** Agenda armazenada no banco de dados via Prisma (SQLite).
- **Interface Moderna:** Frontend em React com layout responsivo e estilizado (ex.: Tailwind CSS).

---

## 🛠 Tecnologias Utilizadas

- **Backend:** Node.js, Express, Socket.io, Prisma, SQLite, TypeScript
- **Frontend:** React, Socket.io-client, TypeScript, Tailwind CSS (ou seu framework CSS preferido)

---

## ⚙️ Instalação

### 🔹 Pré-requisitos

- [Node.js](https://nodejs.org/) (v14 ou superior)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### 🔹 Configuração do Backend

1. **Clone o repositório e navegue até o diretório do backend:**

   ```bash
   git clone https://github.com/seu-usuario/chatbot.git
   cd chatbot/backend
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o Prisma:**

   Crie um arquivo `.env` na raiz do backend e defina a variável `DATABASE_URL`:

   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. **Execute a migração inicial e gere o Prisma Client:**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Inicie o servidor:**

   ```bash
   npm run dev
   ```

   O servidor rodará na porta `3000` (ou conforme configurado).

### 🔹 Configuração do Frontend

1. **Navegue até o diretório do frontend:**

   ```bash
   cd ../frontend
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Inicie o aplicativo React:**

   ```bash
   npm start
   ```

   O aplicativo será iniciado, geralmente em `http://localhost:5173` ou em outra porta definida pelo Vite/CRA.

---

## 💬 Uso

### Fluxo do Chat

- **Usuário Novo:**
  - O chatbot solicita as informações: primeiro nome, sobrenome e telefone.
  - Em seguida, pergunta qual serviço deseja agendar, o dia e o horário.
  - Após o agendamento ser confirmado, ele é salvo no banco de dados.
  - O usuário pode, então, optar por realizar um novo agendamento clicando no botão "Novo Agendamento".

- **Usuário de Retorno:**
  - Se os dados do usuário já estiverem salvos (via localStorage), o frontend os envia automaticamente na conexão.
  - O chatbot inicia o fluxo diretamente no agendamento, solicitando somente o serviço, o dia e o horário.

---

## 📂 Estrutura do Projeto

```plaintext
chatbot/
├── backend/
│   ├── src/
│   │   ├── server.ts         # Lógica do backend com Express, Socket.io e Prisma
│   │   └── utils/
│   │       └── prisma.ts     # Configuração do Prisma Client
│   ├── .env                  # Variáveis de ambiente (DATABASE_URL)
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── ChatBot.tsx       # Componente principal do chat
    │   └── index.tsx
    ├── package.json
    └── tsconfig.json
```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto.
2. Crie uma branch com a sua feature:

   ```bash
   git checkout -b minha-feature
   ```

3. Realize as alterações e faça commit:

   ```bash
   git commit -m 'Minha nova feature'
   ```

4. Envie sua branch:

   ```bash
   git push origin minha-feature
   ```

5. Abra um Pull Request explicando suas alterações.

---

## 📜 Licença

Este projeto está licenciado sob a **MIT License**.

---

## 📩 Contato

Para dúvidas ou sugestões, entre em contato via **aerickidev@gmail.com**.
