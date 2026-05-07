# NestJS Prisma Monorepo Template

A starter template for building modern full-stack applications using **Turborepo**, **NestJS** with **Prisma**, **Vite**, and **Prometheus**. This monorepo is pre-configured with industry-standard tooling and best practices so you can focus on building features instead of configuring infrastructure.

## 🌟 What's Included

### Backend (`apps/backend`)
- **NestJS**: Scalable and modular framework.
- **Authentication Ready**: Pre-configured guards for JWT and API Token auth.
- **Environment Safety**: Strict environment variable validation using Zod.
- **Type-safe Validation**: Request validation using `nestjs-zod`.
- **API Documentation**: Auto-generated Swagger UI available at `/swagger`.
- **Metrics**: Prometheus client installed, exposing metrics at `/metrics`.
- **Testing**: Setup for Unit, Integration, and E2E tests.
- **Docker**: Includes a production-ready `Dockerfile.backend`.

### Frontend (`apps/webapp`)
- **Vite**: Lightning-fast build tool and dev server.
- **Vanilla Setup**: Lightweight plain HTML/JS starting point (easy to swap with your framework of choice). Includes a built-in UI to trigger and display requests to the backend's `/health` endpoint.

### Shared Packages
- **Database (`packages/database`)**: Shared Prisma schema, migrations, and database client.
- **TypeScript (`packages/typescript-config`)**: Base `tsconfig.json` files for consistent typings across the monorepo.

### Tooling
- **Biome**: A high-performance, all-in-one tool for linting and formatting (replaces ESLint & Prettier for a cleaner, faster experience).

## 🚀 Getting Started

### 1. Installation

```bash
# Install dependencies
pnpm install
```

### 2. Environment Configuration

Set up the required environment variables:
1. **Backend**: Copy `apps/backend/env/.env.example` to `apps/backend/env/.env.local`
2. **Webapp**: Copy `apps/webapp/.env.example` to `apps/webapp/.env`
3. **Database**: Copy `packages/database/.env.example` to `packages/database/.env.local`

Update the `.env` files with your local setup credentials. The backend strictly validates these variables using a Zod schema and will fail to start if any required values are missing or incorrectly formatted.

### 3. Database Setup

```bash
# Apply database migrations
pnpm db:migrate:local

# Generate the Prisma client
pnpm db:generate
```

### 4. Start (Dev mode)

```bash
# Run all applications in development mode
pnpm dev
```

- **Backend / Swagger**: `http://localhost:3000/swagger`
- **Frontend Vite App**: (Check the terminal for the exact Vite localhost port)

### 5. Start with Docker Compose

You can run the entire stack (PostgreSQL, Backend, and a built version of the Webapp via Nginx) using Docker Compose:

```bash
# Ensure the webapp is built first so Nginx has static files to serve
pnpm build

# Start the services in the background
docker compose -f docker-compose.local.yml up -d
```

- **Backend / Swagger**: `http://localhost:3000/swagger` (or the `BACKEND_HOST_PORT` defined in your root `.env`)
- **Frontend Web App**: `http://localhost:8080` (or the `WEBAPP_HOST_PORT` defined in your root `.env`)
- **Prometheus**: `http://localhost:9090` (or the `PROMETHEUS_HOST_PORT` defined in your root `.env`)

## 🛠️ Monorepo Scripts

Run these from the root directory:

- `pnpm dev`: Start all development servers concurrently.
- `pnpm build`: Build all applications and packages.
- `pnpm db:generate`: Regenerate the Prisma client.
- `pnpm db:migrate:local`: Apply migrations (Local environment).
- `pnpm format-and-lint`: Check code style and formatting across all packages using **Biome**.
- `pnpm format-and-lint:fix`: Auto-fix lint and formatting issues with **Biome**.

*Testing commands like `pnpm test:unit` are available within the respective app directories (e.g., `apps/backend`).*

## 🔒 Pre-configured Security

The template provides two ways to secure your endpoints out-of-the-box:
- **JWT**: Send `Bearer <token>` in the `Authorization` header. Supports verification via **JWT Secret** or **Public JWKS**.
- **API Key**: Send your key in the `api-key` header.
