# Servicios SaaS (mini)

Base listo para:
- Next.js 14 (App Router) + TypeScript
- Prisma (PostgreSQL)
- Admin panel básico (cookie demo) con cambio de precios (historial vía AuditLog)
- Rutas SSR para listar servicios y precios vigentes

> Nota: El login es **DEMO** con cookie `role`. Para producción integrá NextAuth.

## Requisitos
- Node 20
- PostgreSQL (o Render Postgres)
- `DATABASE_URL` en `.env`

## Setup local
```bash
cp .env.example .env
# edita DATABASE_URL
npm i
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

- Admin demo: entra a `/login` y elegí rol `ADMIN` o `STAFF` (setea cookie). Luego `/admin`.
- Lista de servicios: `/servicios`

## Cambiar precio (admin)
- Ir a `/admin/precios/[serviceId]` desde la tabla de servicios (`/admin/servicios` → click “Editar” y copia el ID de la URL para construirla rápidamente).
- El flujo cierra el precio anterior (isCurrent=false, activeTo=now) y crea uno nuevo vigente.

## Deploy en Render
- Crea un servicio Web (Node) y una base PostgreSQL.
- Variables de entorno: `DATABASE_URL`, `NEXTAUTH_URL` (si luego integrás NextAuth), `PUBLIC_BASE_URL`.
- Build: `npm ci && npm run build`
- Start: `npm run start`

### render.yaml (opcional)
Incluido en el repo.

## TODO (para producción)
- NextAuth + credenciales reales
- Protección robusta /admin (middleware con sesión)
- Coinbase Commerce o Stripe + webhooks
- UI (Tailwind/shadcn) y diseño
