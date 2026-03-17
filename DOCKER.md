# Docker (sem banco no compose)

Este projeto sobe apenas backend e frontend via Docker Compose.
O banco deve estar rodando externamente.

## 1) Preparar variaveis

Na raiz do projeto, copie o arquivo de exemplo:

```bash
cp .env.docker.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.docker.example .env
```

Edite o arquivo `.env` e ajuste principalmente `DATABASE_URL` e `JWT_SECRET`.

## 2) Subir os servicos

```bash
docker compose up --build
```

## 3) Acessos

- Frontend: http://localhost:3000
- Backend: http://localhost:3333/alive

## Observacoes

- O backend usa Prisma e conecta no banco definido por `DATABASE_URL`.
- Em Docker Desktop no Windows/Mac, `host.docker.internal` funciona para acessar servicos no host.
