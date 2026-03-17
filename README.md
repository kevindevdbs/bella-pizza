# 🍕 Bella Pizza - Plataforma de E-commerce de Pizzas

Uma **plataforma completa e moderna** para gerenciamento e venda de pizzas, desenvolvida com as melhores práticas de arquitetura de software e tecnologias atuais do mercado.

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?logo=postgresql)](https://www.postgresql.org/)

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Features](#-features)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Setup e Instalação](#-setup-e-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Comandos Disponíveis](#-comandos-disponíveis)
- [API Documentation](#-api-documentation)
- [Contribuindo](#-contribuindo)

---

## 🎯 Visão Geral

Bella Pizza é uma solução **full-stack** para e-commerce de pizzas com suporte a múltiplas plataformas:

- **Web**: Dashboard administrativo e aplicação de cliente com Next.js
- **Mobile**: Aplicação nativa com React Native (Expo) para iOS/Android
- **Backend**: API REST robusta com Express.js e PostgreSQL

A plataforma foi desenvolvida com foco em **escalabilidade**, **performance** e **experiência do usuário**.

---

## 🚀 Stack Tecnológica

### Backend

| Tecnologia     | Versão | Propósito                    |
| -------------- | ------ | ---------------------------- |
| **Node.js**    | LTS    | Runtime JavaScript           |
| **Express.js** | ^5.2.1 | Framework web e API          |
| **TypeScript** | ^5.9.3 | Type safety                  |
| **Prisma**     | ^7.4.2 | ORM e gerenciamento de banco |
| **PostgreSQL** | Latest | Banco de dados relacional    |
| **JWT**        | ^9.0.3 | Autenticação                 |
| **bcryptjs**   | ^3.0.3 | Hashing de senhas            |
| **Socket.io**  | ^4.8.3 | Comunicação real-time        |
| **Multer**     | ^2.1.1 | Upload de arquivos           |
| **Cloudinary** | ^2.9.0 | Gerenciamento de imagens     |
| **Zod**        | ^4.3.6 | Validação de schemas         |

### Frontend Web

| Tecnologia           | Versão   | Propósito                  |
| -------------------- | -------- | -------------------------- |
| **Next.js**          | 16.1.6   | Framework React full-stack |
| **React**            | 19.2.3   | Biblioteca UI              |
| **TypeScript**       | ^5       | Type safety                |
| **TailwindCSS**      | ^4       | Utility-first CSS          |
| **shadcn/ui**        | ^4.0.5   | Componentes reutilizáveis  |
| **Socket.io Client** | ^4.8.3   | Comunicação real-time      |
| **Lucide Icons**     | ^0.577.0 | Ícones modernos            |

### Mobile

| Tecnologia       | Versão  | Propósito                     |
| ---------------- | ------- | ----------------------------- |
| **React Native** | 0.83.2  | Framework mobile              |
| **Expo**         | ~55.0.6 | Plataforma de desenvolvimento |
| **Expo Router**  | ~55.0.5 | Roteamento nativo             |
| **TypeScript**   | ~5.9.2  | Type safety                   |
| **Axios**        | ^1.13.6 | Cliente HTTP                  |
| **AsyncStorage** | 2.2.0   | Persistência local            |

### DevOps & Tools

- **Docker** & **Docker Compose** - Containerização
- **Prisma Migrations** - Controle de versão de banco
- **tsx** - TypeScript executor

---

## 🏗️ Arquitetura

### Arquitetura Monorepo

O projeto segue a estrutura de **monorepo** com 3 pacotes independentes mas integrados:

```
bella-pizza/
├── packages/
│   ├── backend/          # API REST (Express + Prisma)
│   ├── frontend/         # Web App (Next.js)
│   └── mobile/           # App Mobile (React Native)
├── docker-compose.yml    # Orquestração de contêineres
└── DOCKER.md            # Documentação Docker
```

### Padrão de Arquitetura Backend

```
src/
├── controllers/    # Lógica de requisição/resposta
├── services/       # Lógica de negócio
├── schemas/        # Validação com Zod
├── middlewares/    # Autenticação, autorização
├── config/         # Configurações (DB, Cloudinary, etc)
├── lib/            # Utilitários (Prisma, Socket.io)
├── routes.ts       # Definição de rotas
└── server.ts       # Inicialização da aplicação
```

### Padrão de Arquitetura Frontend

```
src/
├── app/           # Rotas e layouts (App Router)
├── components/    # Componentes reutilizáveis
├── actions/       # Server actions
├── hooks/         # Custom hooks
├── lib/           # Utilitários
└── types/         # Type definitions
```

---

## ✨ Features

### 👤 Autenticação & Autorização

- ✅ Registro e login de usuários
- ✅ JWT com refresh tokens
- ✅ Hashing seguro de senhas (bcryptjs)
- ✅ Autorização baseada em roles (Admin/User)
- ✅ Middlewares de autenticação

### 🍕 Gerenciamento de Produtos

- ✅ CRUD completo de pizzas/categorias
- ✅ Upload de imagens via Cloudinary
- ✅ Validação de dados com Zod
- ✅ Suporte a múltiplos tamanhos

### 📦 Gerenciamento de Pedidos

- ✅ Carrinho de compras
- ✅ Processamento de pedidos
- ✅ Histórico de pedidos
- ✅ Status de pedidos em tempo real
- ✅ Notas adicionais em items

### 🌐 Interface Moderna

- ✅ Design responsivo com TailwindCSS
- ✅ Componentes shadcn/ui
- ✅ Dark mode support
- ✅ Experiência mobile-first

### 🔄 Real-time

- ✅ WebSocket com Socket.io
- ✅ Atualizações instantâneas de pedidos
- ✅ Notificações em tempo real

### 📱 Multiplataforma

- ✅ Web (Next.js)
- ✅ Mobile iOS/Android (React Native)
- ✅ Suporte a web na versão mobile

---

## 📂 Estrutura do Projeto

### Backend (`packages/backend/`)

```
src/
├── controllers/
│   ├── category/     # Gerenciamento de categorias
│   ├── order/        # Gerenciamento de pedidos
│   ├── product/      # Gerenciamento de produtos
│   └── user/         # Gerenciamento de usuários
├── services/         # Lógica de negócio isolada
├── schemas/          # Validação com Zod
├── middlewares/      # Auth, validação, etc
├── config/           # Cloudinary, Multer
└── lib/              # Prisma, Socket.io
prisma/              # Schema e migrations
```

### Frontend (`packages/frontend/`)

```
src/
├── app/
│   ├── dashboard/    # Área administrativa
│   ├── login/        # Página de login
│   ├── register/     # Página de registro
│   └── (tabs)/       # Páginas principais
├── components/
│   ├── dashboard/    # Componentes admin
│   ├── forms/        # Formulários
│   └── ui/           # Componentes base
├── actions/          # Server actions
├── hooks/            # Custom hooks
└── lib/              # Utilitários
```

### Mobile (`packages/mobile/`)

```
app/
├── (authenticated)/  # Rotas autenticadas
├── (tabs)/          # Tabs principais
├── login.tsx        # Tela de login
├── index.tsx        # Home
└── +html.tsx        # Layout
components/          # Componentes reutilizáveis
config/              # Configurações API
contexts/            # Auth context
services/            # Serviços de API
```

---

## 🔧 Setup e Instalação

### Pré-requisitos

- **Node.js** 18+
- **Docker** e **Docker Compose** (para rodar localmente com containers)
- **PostgreSQL** 14+ (para desenvolvimento local)
- **npm** ou **yarn**

### Instalação Local

#### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/bella-pizza.git
cd bella-pizza
```

#### 2. Instale as dependências

```bash
# Instalar dependências de todos os pacotes
npm install
# ou
yarn install
```

#### 3. Configure as variáveis de ambiente

```bash
# Crie arquivos .env em cada pacote
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env
cp packages/mobile/.env.example packages/mobile/.env
```

#### 4. Configure o banco de dados

```bash
cd packages/backend

# Rode as migrations
npx prisma migrate deploy

# (Opcional) Abra Prisma Studio para visualizar dados
npx prisma studio
```

#### 5. Inicie os serviços

**Terminal 1 - Backend**

```bash
cd packages/backend
npm run dev
# Roda em http://localhost:3333
```

**Terminal 2 - Frontend**

```bash
cd packages/frontend
npm run dev
# Roda em http://localhost:3000
```

**Terminal 3 - Mobile**

```bash
cd packages/mobile
npm start
# Pressione 'i' para iOS ou 'a' para Android
```

### Instalação com Docker

```bash
# Usando Docker Compose
docker-compose up -d

# Backend: http://localhost:3333
# Frontend: http://localhost:3000
```

---

## 🔐 Variáveis de Ambiente

### Backend (`.env`)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bella_pizza"

# Server
PORT=3333
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_super_secreta_aqui

# Cloudinary (para upload de imagens)
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### Mobile (`.env`)

```env
REACT_APP_API_URL=http://localhost:3333
```

---

## 📝 Comandos Disponíveis

### Backend

```bash
npm run dev              # Iniciar servidor em modo de desenvolvimento
npm run build            # Compilar TypeScript
npm run prod             # Iniciar em production
```

### Frontend

```bash
npm run dev              # Iniciar Next.js em desenvolvimento
npm run build            # Build para produção
npm run start            # Iniciar build de produção
npm run lint             # Executar ESLint
```

### Mobile

```bash
npm start                # Iniciar Expo
npm run android          # Abrir no Android Emulator
npm run ios              # Abrir no iOS Simulator
npm run web              # Abrir no navegador
```

### Database (Prisma)

```bash
npx prisma migrate dev --name "nome_da_migracao"
npx prisma migrate deploy
npx prisma studio
npx prisma generate
```

---

## 📚 API Documentation

### Autenticação

- **POST** `/auth/register` - Registrar novo usuário
- **POST** `/auth/login` - Fazer login

### Categorias

- **GET** `/categories` - Listar todas as categorias
- **POST** `/categories` - Criar categoria (Admin)
- **PUT** `/categories/:id` - Atualizar categoria (Admin)
- **DELETE** `/categories/:id` - Deletar categoria (Admin)

### Produtos

- **GET** `/products` - Listar produtos
- **GET** `/products/:id` - Detalhes do produto
- **POST** `/products` - Criar produto (Admin)
- **PUT** `/products/:id` - Atualizar produto (Admin)
- **DELETE** `/products/:id` - Deletar produto (Admin)

### Pedidos

- **GET** `/orders` - Listar pedidos do usuário
- **POST** `/orders` - Criar novo pedido
- **GET** `/orders/:id` - Detalhes do pedido
- **PUT** `/orders/:id` - Atualizar status (Admin)

### Usuários

- **GET** `/users/profile` - Perfil do usuário logado
- **PUT** `/users/profile` - Atualizar perfil

---

## 🎓 O que Demonstra Este Projeto

### Arquitetura & Design

- ✅ **Monorepo** bem estruturado
- ✅ **Separação de responsabilidades** entre camadas
- ✅ **MVC pattern** no backend
- ✅ **Clean Code** principles
- ✅ **SOLID principles**

### Backend

- ✅ API REST RESTful
- ✅ **ORM** com Prisma
- ✅ **Autenticação** JWT
- ✅ **Autorização** baseada em roles
- ✅ **Validação** com Zod
- ✅ **Middlewares** customizados
- ✅ **WebSocket** com Socket.io
- ✅ **Upload** de arquivos
- ✅ **Migrations** de banco de dados

### Frontend

- ✅ **Next.js 16** com App Router
- ✅ **Server Actions**
- ✅ **TypeScript** completo
- ✅ **Componentes** reutilizáveis
- ✅ **Styling** com TailwindCSS
- ✅ **UI Design System** com shadcn

### Mobile

- ✅ **React Native** com Expo
- ✅ **Navigation** nativa
- ✅ **Context API** para estado
- ✅ **Async Storage** para persistência
- ✅ **HTTP Requests** com Axios

### DevOps

- ✅ **Docker** containerização
- ✅ **Docker Compose** orquestração
- ✅ **Environment variables** management

---

## 👨‍💻 Contribuindo

As contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a Licença ISC - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 📧 Contato

Para dúvidas ou sugestões sobre o projeto, abra uma [issue](https://github.com/seu-usuario/bella-pizza/issues).

---

**Desenvolvido com ❤️ para a melhor experiência em pedidos de pizzas.**
