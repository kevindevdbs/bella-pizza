# 📋 Documentação de Contexto do Projeto - Sistema de Pizzaria

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias e Versões](#tecnologias-e-versões)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Modelagem do Banco de Dados](#modelagem-do-banco-de-dados)
6. [Middlewares](#middlewares)
7. [Validação com Schemas](#validação-com-schemas)
8. [Endpoints](#endpoints)
9. [Fluxo de Requisição](#fluxo-de-requisição)
10. [Configurações do Projeto](#configurações-do-projeto)
11. [Observações Importantes](#observações-importantes)
12. [Como Iniciar o Projeto](#como-iniciar-o-projeto)

---

## 🎯 Visão Geral

Sistema backend de gerenciamento de pizzaria desenvolvido com Node.js, TypeScript, Express, Prisma ORM, PostgreSQL, Zod e Socket.IO.

O backend expõe endpoints para:

- autenticação e consulta do usuário logado
- cadastro e listagem de categorias
- cadastro, listagem, filtragem por categoria e exclusão lógica de produtos
- criação, envio, finalização, detalhamento, listagem e exclusão de pedidos
- adição, atualização e remoção de itens em pedidos
- consulta de pedido ativo por mesa
- publicação de eventos em tempo real para o namespace /orders

O projeto segue uma separação entre rotas, middlewares, controllers e services, concentrando a lógica de negócio na camada de services, com publicação de eventos em tempo real via Socket.IO para o painel administrativo.

---

## 🏗️ Arquitetura

O projeto segue o padrão MVC + Service Layer, com o fluxo:

```text
Requisição HTTP -> Rotas -> Middlewares -> Controller -> Service -> Prisma -> Banco de Dados -> Service -> Controller -> Resposta HTTP
```

Fluxo de eventos em tempo real:

```text
Service -> OrderRealtimePublisher -> Namespace Socket.IO (/orders) -> Cliente Admin
```

### Camadas da Arquitetura

1. Rotas: definem endpoints e encadeamento de middlewares.
2. Middlewares: tratam autenticação, autorização, upload e validação com Zod.
3. Controllers: recebem req/res, extraem body ou query e chamam services.
4. Services: concentram regras de negócio e acesso ao banco.
5. Prisma Client: faz a comunicação com PostgreSQL usando o adaptador @prisma/adapter-pg.
6. Realtime Publisher: emite eventos de ciclo de vida dos pedidos para clientes conectados no namespace /orders.

### Princípios Aplicados

- Separação de responsabilidades por operação.
- Controllers enxutos, com lógica principal nos services.
- Validação centralizada por schema.
- Reutilização de middlewares entre recursos.
- Soft delete de produtos via campo disabled.
- Emissão de eventos de pedido em operações de criação, envio, finalização e manipulação de itens.

---

## 🚀 Tecnologias e Versões

### Dependências de Produção

| Tecnologia         | Versão  | Finalidade                             |
| ------------------ | ------- | -------------------------------------- |
| express            | ^5.2.1  | Framework web para API REST            |
| @prisma/client     | ^7.4.2  | ORM                                    |
| @prisma/adapter-pg | ^7.4.2  | Adaptador PostgreSQL do Prisma         |
| bcryptjs           | ^3.0.3  | Hash de senha                          |
| cloudinary         | ^2.9.0  | Upload e hospedagem de imagens         |
| cors               | ^2.8.6  | Habilitação de CORS                    |
| dotenv             | ^17.3.1 | Variáveis de ambiente                  |
| jsonwebtoken       | ^9.0.3  | Geração e validação de JWT             |
| multer             | ^2.1.1  | Upload multipart/form-data             |
| pg                 | ^8.20.0 | Driver PostgreSQL                      |
| socket.io          | ^4.8.3  | Comunicação em tempo real              |
| tsx                | ^4.21.0 | Execução TypeScript em desenvolvimento |
| zod                | ^4.3.6  | Validação e tipagem de entrada         |

### Dependências de Desenvolvimento

| Tecnologia          | Versão  | Finalidade               |
| ------------------- | ------- | ------------------------ |
| @types/cors         | ^2.8.19 | Tipos do CORS            |
| @types/express      | ^5.0.6  | Tipos do Express         |
| @types/jsonwebtoken | ^9.0.10 | Tipos do JWT             |
| @types/multer       | ^2.1.0  | Tipos do Multer          |
| @types/node         | ^25.3.5 | Tipos do Node.js         |
| @types/pg           | ^8.18.0 | Tipos do driver pg       |
| prisma              | ^7.4.2  | CLI do Prisma            |
| typescript          | ^5.9.3  | Compilação e verificação |

### Banco de Dados

- PostgreSQL
- Prisma Client gerado em src/generated/prisma
- Conexão resolvida a partir de DATABASE_URL via prisma.config.ts e também usada em src/lib/prisma.ts

---

## 📁 Estrutura de Pastas

```text
backend/
├── prisma/
│   ├── migrations/
│   │   ├── 0_init/
│   │   ├── 20260307001802_create_tables/
│   │   ├── 20260307002215_delete_license_keys/
│   │   └── 20260307010417_password_added_to_user_table/
│   └── schema.prisma
├── src/
│   ├── @types/
│   │   └── express/
│   ├── config/
│   │   ├── cloudinary.ts
│   │   └── multer.ts
│   ├── controllers/
│   │   ├── category/
│   │   ├── order/
│   │   ├── product/
│   │   └── user/
│   ├── generated/
│   │   └── prisma/
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── socket.ts
│   ├── middlewares/
│   │   ├── isAdmin.ts
│   │   ├── isAuthenticated.ts
│   │   └── validateSchema.ts
│   ├── schemas/
│   │   ├── categorySchema.ts
│   │   ├── orderSchema.ts
│   │   ├── productSchema.ts
│   │   └── userSchema.ts
│   ├── services/
│   │   ├── category/
│   │   ├── order/
│   │   ├── product/
│   │   └── user/
│   ├── routes.ts
│   └── server.ts
├── CONTEXTO_PROJETO.md
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

### Convenções de Nomenclatura

- Controllers: ActionEntityController.ts
- Services: ActionEntityService.ts
- Schemas: entitySchema.ts
- Middlewares: descrição direta do papel do middleware

---

## 🗄️ Modelagem do Banco de Dados

### Diagrama de Relacionamentos

```text
User (1)
  └─ role: STAFF | ADMIN

Category (1) ─────< (N) Product
                         │
                         └─< (N) Item >─┐
                                        │
Order (1) ─────────────────────────────┘
  └─ items: Item[]
```

### Entidades e Atributos

#### User

```ts
{
  id: string;
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "STAFF";
  createdAt: Date;
  updatedAt: Date;
}
```

#### Category

```ts
{
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  products: Product[];
}
```

#### Product

```ts
{
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  disabled: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  items: Item[];
}
```

Preço é armazenado em centavos como inteiro.

#### Order

```ts
{
  id: string;
  table: number;
  status: boolean;
  draft: boolean;
  name?: string;
  items: Item[];
  createdAt: Date;
  updatedAt: Date;
}
```

- status false = pendente
- status true = pronto
- draft true = rascunho
- draft false = pedido enviado

#### Item

```ts
{
  id: string;
  amount: number;
  note?: string;
  orderId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Regras de Relacionamento e Exclusão

- Category -> Product com onDelete: Cascade
- Product -> Item com onDelete: Cascade
- Order -> Item com onDelete: Cascade
- Na criação de pedido, rascunhos abertos da mesma mesa são removidos de forma transacional
- Exclusão de produto na API é lógica, alterando disabled para true
- Exclusão de pedido na API é física, removendo o registro

---

## 🛡️ Middlewares

### isAuthenticated

Responsável por validar o header Authorization no formato Bearer token.

Fluxo:

1. Lê req.headers.authorization.
2. Se não existir, responde 401 com { error: "Token não fornecido" }.
3. Valida o token com jsonwebtoken.verify usando JWT_SECRET.
4. Extrai sub e atribui em req.user_id.
5. Em caso de falha, responde 401 com { error: "Token inválido" }.

### isAdmin

Responsável por garantir que o usuário autenticado tenha role ADMIN.

Fluxo:

1. Lê req.user_id.
2. Busca o usuário no banco.
3. Se não houver usuário autenticado, responde 401 com { message: "Usuário não autenticado" }.
4. Se o usuário não existir, responde 404 com { message: "Usuário sem Permissão" }.
5. Se role for diferente de ADMIN, responde 403 com { message: "Usuário sem Permissão" }.
6. Caso válido, chama next().

### validateSchema

Responsável por validar entrada com Zod.

Comportamento atual:

- em requisições GET e DELETE valida req.query
- nas demais valida req.body
- usa parseAsync
- em erro de validação retorna 400 com z.flattenError(error)
- em erro inesperado retorna 500 com { error: "Erro Interno do Servidor." }

Exemplo de resposta de validação:

```json
{
  "error": {
    "formErrors": [],
    "fieldErrors": {
      "email": ["Email inválido"]
    }
  }
}
```

### upload.single("file")

Middleware do Multer usado na criação de produto.

Regras configuradas:

- armazenamento em memória
- tamanho máximo de 4 MB
- tipos permitidos: image/jpeg, image/jpg, image/png
- erro de tipo inválido: Formato de Arquivo inválido use (PNG , JPEG ou JPG)

---

## ✅ Validação com Schemas

Os schemas ficam em src/schemas e cobrem body ou query conforme o método HTTP.

### User Schemas

#### createUserSchema

```ts
{
  id?: string;
  name: string;
  password: string;
  email: string;
  role: "ADMIN" | "STAFF";
}
```

Regras:

- name mínimo de 3 caracteres
- password mínimo de 6 caracteres
- email válido
- role default STAFF

#### authUserSchema

```ts
{
  email: string;
  password: string;
}
```

Regras:

- email válido
- password mínimo de 6 caracteres

### Category Schema

#### createCategorySchema

```ts
{
  name: string;
}
```

Regra:

- name mínimo de 2 caracteres

### Product Schemas

#### createProductSchema

```ts
{
  name: string;
  price: string;
  description: string;
  category_id: string;
}
```

Regras:

- name obrigatório
- price obrigatório e composto apenas por dígitos
- description obrigatória
- category_id obrigatório

#### listProductSchema

```ts
{
  disabled?: "true" | "false";
}
```

#### listProductsByCategorySchema

```ts
{
  category_id: string;
}
```

### Order Schemas

#### createOrderSchema

```ts
{
  name?: string;
  table: number;
}
```

Regras:

- table deve ser inteiro positivo

#### listOrdersSchema

```ts
{
  draft?: "true" | "false";
}
```

#### detailOrderSchema

```ts
{
  order_id: string;
}
```

#### addItemOrderSchema

```ts
{
  order_id: string;
  product_id: string;
  amount: number;
  note?: string;
}
```

Regras:

- amount deve ser inteiro positivo
- note é opcional e tem no máximo 220 caracteres

#### activeOrderByTableSchema

```ts
{
  table: number;
}
```

Regras:

- table é convertido para número e deve ser inteiro positivo

#### updateOrderItemSchema

```ts
{
  item_id: string;
  amount?: number;
  note?: string;
}
```

Regras:

- item_id obrigatório
- amount, quando enviado, deve ser inteiro positivo
- note, quando enviada, deve ter no máximo 220 caracteres
- é obrigatório enviar pelo menos um dos campos: amount ou note

#### removeItemOrderSchema

```ts
{
  item_id: string;
}
```

#### deleteOrderSchema

```ts
{
  order_id: string;
}
```

#### sendOrderSchema

```ts
{
  name: string;
  order_id: string;
}
```

#### finishOrderSchema

```ts
{
  order_id: string;
}
```

---

## 🌐 Endpoints

## Status

### GET /alive

Verifica se a API está de pé.

Resposta 200:

```json
{
  "message": "Servidor Vivo !"
}
```

## Usuários

### POST /users

Cria um novo usuário.

Middlewares:

- validateSchema(createUserSchema)

Body:

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

Resposta 201:

```json
{
  "createdUser": {
    "id": "uuid-gerado",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "STAFF",
    "createdAt": "2026-03-11T10:30:00.000Z"
  }
}
```

Erros esperados:

- 400: Email já cadastrado.

### POST /session

Autentica um usuário.

Middlewares:

- validateSchema(authUserSchema)

Body:

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

Resposta 200:

```json
{
  "id": "uuid-do-usuario",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "token": "jwt-token"
}
```

Erros esperados:

- 400: Email ou senha inválidos

### GET /me

Retorna o usuário autenticado.

Middlewares:

- isAuthenticated

Headers:

```http
Authorization: Bearer <token>
```

Resposta 200:

```json
{
  "id": "uuid-do-usuario",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF"
}
```

## Categorias

### POST /category

Cria uma categoria.

Middlewares:

- isAuthenticated
- isAdmin
- validateSchema(createCategorySchema)

Resposta 201:

```json
{
  "id": "uuid-gerado",
  "name": "Pizzas Doces",
  "createdAt": "2026-03-11T10:30:00.000Z"
}
```

Erros esperados:

- 400: Categoria já existe

### GET /category

Lista categorias em ordem decrescente de criação.

Middlewares:

- isAuthenticated

Resposta 200:

```json
[
  {
    "id": "uuid-categoria",
    "name": "Pizzas Tradicionais",
    "createdAt": "2026-03-07T00:20:00.000Z",
    "updatedAt": "2026-03-07T00:20:00.000Z"
  }
]
```

## Produtos

### POST /product

Cria um produto com upload de imagem.

Middlewares:

- isAuthenticated
- isAdmin
- upload.single("file")
- validateSchema(createProductSchema)

Body multipart/form-data:

```text
name=Pizza Calabresa
price=4990
description=Pizza de calabresa com cebola
category_id=uuid-da-categoria
file=<arquivo png/jpg/jpeg>
```

Resposta 201:

```json
{
  "id": "uuid-produto",
  "name": "Pizza Calabresa",
  "price": 4990,
  "description": "Pizza de calabresa com cebola",
  "categoryId": "uuid-da-categoria",
  "imageUrl": "https://res.cloudinary.com/...",
  "createdAt": "2026-03-07T01:10:00.000Z"
}
```

Erros esperados:

- 400: Categoria não encontrada
- 400: Já existe um produto com o mesmo nome
- 400: A imagem do produto é obrigatória
- 400: Erro ao fazer o upload da imagem
- 400: Formato de Arquivo inválido use (PNG , JPEG ou JPG)

### GET /products

Lista produtos por disabled.

Middlewares:

- isAuthenticated
- validateSchema(listProductSchema)

Query params:

- disabled=true
- disabled=false
- se omitido, o controller assume false

Resposta 200:

```json
[
  {
    "id": "uuid-produto",
    "name": "Pizza Calabresa",
    "price": 4990,
    "description": "Pizza de calabresa com cebola",
    "imageUrl": "https://res.cloudinary.com/...",
    "disabled": false,
    "categoryId": "uuid-da-categoria",
    "createdAt": "2026-03-07T01:10:00.000Z",
    "updatedAt": "2026-03-07T01:10:00.000Z",
    "category": {
      "id": "uuid-da-categoria",
      "name": "Tradicionais"
    }
  }
]
```

Erros esperados:

- 400: O parâmetro disabled deve ser true ou false

### GET /category/products

Lista produtos de uma categoria.

Middlewares:

- isAuthenticated
- validateSchema(listProductsByCategorySchema)

Query params:

- category_id=uuid-da-categoria

Resposta 200:

```json
{
  "result": [
    {
      "id": "uuid-produto",
      "name": "Pizza Calabresa",
      "price": 4990,
      "description": "Pizza de calabresa com cebola",
      "categoryId": "uuid-da-categoria",
      "imageUrl": "https://res.cloudinary.com/...",
      "createdAt": "2026-03-07T01:10:00.000Z",
      "disabled": false,
      "category": {
        "id": "uuid-da-categoria",
        "name": "Tradicionais"
      }
    }
  ]
}
```

Erros esperados:

- 400: Categoria não encontrada
- 400: Não foi possivel buscar os produtos

### DELETE /product

Realiza exclusão lógica do produto, marcando disabled como true.

Middlewares:

- isAuthenticated
- isAdmin

Query params:

- product_id=uuid-do-produto

Resposta 200:

```json
{
  "message": "Produto deletado com sucesso."
}
```

Erros esperados:

- 400: Produto não encontrado
- 400: Não foi possivel deletar o produto

## Pedidos

### POST /order

Cria um pedido em rascunho.

Middlewares:

- isAuthenticated
- validateSchema(createOrderSchema)

Body:

```json
{
  "name": "Mesa Família",
  "table": 12
}
```

Resposta 201:

```json
{
  "order": {
    "id": "uuid-order",
    "name": "Mesa Família",
    "table": 12,
    "items": [],
    "status": false,
    "draft": true,
    "createdAt": "2026-03-11T10:30:00.000Z"
  }
}
```

Erros esperados:

- 400: Erro ao criar Order

### DELETE /order

Remove um pedido definitivamente.

Middlewares:

- isAuthenticated
- validateSchema(deleteOrderSchema)

Query params:

- order_id=uuid-order

Resposta 200:

```json
{
  "message": "Pedido deletado com sucesso."
}
```

Erros esperados:

- 400: Pedido não encontrado
- 400: Não foi possivel deletar o pedido

### GET /orders

Lista pedidos filtrando por draft.

Middlewares:

- isAuthenticated
- validateSchema(listOrdersSchema)

Query params:

- draft=true
- draft=false
- se omitido, o controller assume true

Resposta 200:

```json
[
  {
    "id": "uuid-order",
    "name": "Carlos",
    "draft": false,
    "table": 12,
    "status": false,
    "createdAt": "2026-03-11T10:30:00.000Z",
    "items": [
      {
        "id": "uuid-item",
        "amount": 2,
        "note": "Sem cebola",
        "product": {
          "id": "uuid-produto",
          "name": "Pizza Calabresa",
          "price": 4990,
          "imageUrl": "https://res.cloudinary.com/...",
          "description": "Pizza de calabresa com cebola"
        }
      }
    ]
  }
]
```

Erros esperados:

- 400: O parâmetro draft deve ser true ou false
- 400: Não foi possivel listar todos os pedidos

### GET /order/detail

Retorna os detalhes completos de um pedido.

Middlewares:

- isAuthenticated
- validateSchema(detailOrderSchema)

Query params:

- order_id=uuid-order

Resposta 200:

```json
{
  "id": "uuid-order",
  "name": "Carlos",
  "table": 12,
  "status": false,
  "draft": false,
  "createdAt": "2026-03-11T10:30:00.000Z",
  "updatedAt": "2026-03-11T10:35:00.000Z",
  "items": [
    {
      "id": "uuid-item",
      "amount": 2,
      "note": "Borda recheada",
      "createdAt": "2026-03-11T10:31:00.000Z",
      "updatedAt": "2026-03-11T10:31:00.000Z",
      "product": {
        "id": "uuid-produto",
        "name": "Pizza Calabresa",
        "price": 4990,
        "description": "Pizza de calabresa com cebola",
        "imageUrl": "https://res.cloudinary.com/..."
      }
    }
  ]
}
```

Erros esperados:

- 400: Order não encontrada
- 400: Não foi possivel buscar os detalhes do pedido

### POST /order/add

Adiciona um item a um pedido.

Middlewares:

- isAuthenticated
- validateSchema(addItemOrderSchema)

Body:

```json
{
  "order_id": "uuid-order",
  "product_id": "uuid-produto",
  "amount": 2,
  "note": "Sem orégano"
}
```

Resposta 201:

```json
{
  "id": "uuid-item",
  "orderId": "uuid-order",
  "productId": "uuid-produto",
  "amount": 2,
  "note": "Sem orégano",
  "createdAt": "2026-03-11T10:31:00.000Z",
  "product": {
    "id": "uuid-produto",
    "name": "Pizza Calabresa",
    "price": 4990,
    "description": "Pizza de calabresa com cebola",
    "imageUrl": "https://res.cloudinary.com/..."
  }
}
```

Erros esperados:

- 400: Order não encontrada
- 400: Produto não encontrado
- 400: Não foi possivel adicionar o item

### GET /order/active-by-table

Busca o pedido ativo de uma mesa (status=false), priorizando pedido enviado (`draft=false`) e, em seguida, o mais recente por atualização.

Middlewares:

- isAuthenticated
- validateSchema(activeOrderByTableSchema)

Query params:

- table=12

Resposta 200:

```json
{
  "order": {
    "id": "uuid-order",
    "table": 12,
    "name": "Carlos",
    "draft": false,
    "status": false,
    "createdAt": "2026-03-11T10:30:00.000Z"
  }
}
```

Erros esperados:

- 400: Nenhum pedido em produção encontrado para esta mesa
- 400: Não foi possivel buscar pedido ativo da mesa

### DELETE /order/remove

Remove um item do pedido.

Middlewares:

- isAuthenticated
- validateSchema(removeItemOrderSchema)

Query params:

- item_id=uuid-item

Resposta 200:

```json
{
  "message": "Item deletado com sucesso."
}
```

Erros esperados:

- 400: Item não encontrado
- 400: Não foi possivel deletar o item

### PUT /order/item

Atualiza um item do pedido (quantidade e/ou observação).

Middlewares:

- isAuthenticated
- validateSchema(updateOrderItemSchema)

Body:

```json
{
  "item_id": "uuid-item",
  "amount": 3,
  "note": "Trocar por massa fina"
}
```

Resposta 200:

```json
{
  "id": "uuid-item",
  "amount": 3,
  "note": "Trocar por massa fina",
  "orderId": "uuid-order",
  "product": {
    "id": "uuid-produto",
    "name": "Pizza Calabresa",
    "price": 4990,
    "description": "Pizza de calabresa com cebola",
    "imageUrl": "https://res.cloudinary.com/..."
  }
}
```

Erros esperados:

- 400: Item não encontrado
- 400: Pedido já finalizado. Não é possível alterar o item
- 400: Não foi possível atualizar o item

### PUT /order/send

Envia o pedido, definindo draft como false e atribuindo o nome informado.

Middlewares:

- isAuthenticated
- validateSchema(sendOrderSchema)

Body:

```json
{
  "name": "Carlos",
  "order_id": "uuid-order"
}
```

Resposta 200:

```json
{
  "id": "uuid-order",
  "name": "Carlos",
  "table": 12,
  "draft": false,
  "status": false,
  "createdAt": "2026-03-11T10:30:00.000Z"
}
```

Erros esperados:

- 400: Pedido não encontrado
- 400: Não foi possivel enviar o pedido

### PUT /order/finish

Finaliza o pedido, definindo status como true.

Middlewares:

- isAuthenticated
- validateSchema(finishOrderSchema)

Body:

```json
{
  "order_id": "uuid-order"
}
```

Resposta 200:

```json
{
  "id": "uuid-order",
  "name": "Carlos",
  "draft": false,
  "table": 12,
  "status": true,
  "items": [],
  "createdAt": "2026-03-11T10:30:00.000Z"
}
```

Erros esperados:

- 400: Pedido não encontrado
- 400: Não foi possível finalizar o pedido

---

## 🔄 Fluxo de Requisição

### Exemplo: Criação de Usuário

```text
1. POST /users
2. validateSchema(createUserSchema) valida req.body
3. CreateUserController recebe req.body e chama CreateUserService
4. CreateUserService verifica email duplicado
5. Senha é criptografada com bcryptjs usando salt 8
6. Usuário é salvo com Prisma
7. Controller responde 201 com { createdUser: ... }
```

### Exemplo: Listagem com Query Validada

```text
1. GET /products?disabled=false
2. validateSchema(listProductSchema) valida req.query
3. ListProductController assume false quando disabled não é enviado
4. ListProductService filtra por disabled e ordena por createdAt desc
5. Controller responde 200 com a lista
```

### Exemplo: Envio de Pedido

```text
1. PUT /order/send
2. isAuthenticated valida JWT
3. validateSchema(sendOrderSchema) valida req.body
4. SendOrderController lê name e order_id
5. SendOrderService verifica se o pedido existe
6. Prisma atualiza draft para false e grava o nome informado
7. Controller responde 200 com o pedido atualizado
```

### Exemplo: Exclusão Lógica de Produto

```text
1. DELETE /product?product_id=uuid
2. isAuthenticated valida JWT
3. isAdmin valida permissão ADMIN
4. DeleteProductController lê product_id de req.query
5. DeleteProductService verifica se o produto existe e não está desabilitado
6. Prisma atualiza disabled para true
7. Controller responde 200 com mensagem de sucesso
```

---

## ⚙️ Configurações do Projeto

### TypeScript

Principais configurações atuais:

- target: ES2020
- module: commonjs
- rootDir: ./src
- outDir: ./dist
- strict: true
- sourceMap: true
- removeComments: true
- types: ["node"]

Checks adicionais habilitados:

- noImplicitAny
- strictNullChecks
- strictFunctionTypes
- strictBindCallApply
- strictPropertyInitialization
- noImplicitThis
- alwaysStrict
- noUnusedLocals
- noUnusedParameters
- noImplicitReturns
- noFallthroughCasesInSwitch
- noUncheckedIndexedAccess
- noImplicitOverride

### Prisma

Generator:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

Datasource em prisma/schema.prisma:

```prisma
datasource db {
  provider = "postgresql"
}
```

O valor da conexão é definido em prisma.config.ts:

```ts
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

Além disso, a aplicação instancia o PrismaClient com PrismaPg em src/lib/prisma.ts.

### Socket.IO

- O servidor HTTP e WebSocket é iniciado em conjunto no mesmo processo.
- Namespace utilizado: /orders
- Autenticação do socket: JWT enviado em handshake.auth.token ou header Authorization.
- Somente usuários ADMIN podem se conectar ao namespace /orders.
- Evento inicial na conexão: orders:connected
- Evento de atualização: orders:event

Tipos de eventos emitidos em orders:event:

- order:created
- order:item-added
- order:item-updated
- order:item-removed
- order:sent
- order:finished
- order:deleted

### Express Server

Middlewares globais:

1. express.json()
2. cors()
3. router

Error handler global:

```ts
app.use((err: Error, _: Request, res: Response, _next: NextFunction) => {
  console.log(err);
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: "Erro Interno do Servidor." });
});
```

Porta:

- usa process.env.PORT
- fallback 3333

### Variáveis de Ambiente

Exemplo mínimo:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/pizzaria?schema=public"
JWT_SECRET="sua-chave-secreta-aqui"
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"
PORT=3333
```

Observação:

- existe arquivo .env.example no diretório backend

### Scripts NPM

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

Comandos úteis:

```bash
npm install
npm run dev
npx prisma generate
npx prisma migrate dev --name nome_da_migracao
npx prisma migrate deploy
npx prisma studio
```

---

## 📝 Observações Importantes

1. A documentação agora reflete os endpoints reais definidos em src/routes.ts.
2. A listagem de produtos usa GET /products, não GET /product.
3. GET e DELETE validam req.query por meio de validateSchema.
4. A criação de usuário responde com um objeto no formato { createdUser: ... }.
5. A criação de pedido responde com um objeto no formato { order: ... }.
6. A exclusão de produto é lógica; a exclusão de pedido e item é física.
7. O filtro padrão de /orders é draft=true quando o parâmetro não é informado.
8. O filtro padrão de /products é disabled=false quando o parâmetro não é informado.
9. O endpoint GET /order/active-by-table retorna o pedido ativo da mesa (status=false).
10. O endpoint PUT /order/item atualiza quantidade e/ou observação do item.
11. Itens de pedido possuem campo opcional note (observação).
12. Na criação de pedido, rascunhos abertos da mesma mesa são removidos antes de criar o novo.
13. O backend emite eventos em tempo real no namespace /orders para clientes ADMIN autenticados.

---

## 🚀 Como Iniciar o Projeto

1. Instale as dependências.

```bash
npm install
```

2. Crie manualmente o arquivo .env no diretório backend e preencha as variáveis obrigatórias.

3. Gere o client do Prisma, se necessário.

```bash
npx prisma generate
```

4. Rode as migrações no banco de desenvolvimento.

```bash
npx prisma migrate dev --name init
```

5. Inicie o servidor.

```bash
npm run dev
```

Servidor padrão: http://localhost:3333

---

Documento atualizado em: 16/03/2026
