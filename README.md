# Servicios SaaS

Base lista para producción con:
- Next.js 14 (App Router) + TypeScript
- Prisma (PostgreSQL) + NextAuth
- Tailwind CSS + shadcn/ui
- Roles: ADMIN, STAFF, CUSTOMER
- Proveedores de pago: Coinbase Commerce o Stripe
- Validación de env vars con zod
- Logging con pino
- Tests con Vitest + Playwright

## Requisitos
- Node 20
- PostgreSQL

## Setup local
```bash
cp .env.example .env
# editar valores
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

## Tests
```bash
npm test
npx playwright test
```

## Deploy
Usa el `Dockerfile` y `render.yaml` como referencia para producción.
