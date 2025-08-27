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

El script de seeds crea:
- Configuración inicial con proveedor de pagos Coinbase y moneda USD.
- Usuario administrador `admin@demo.com` / contraseña `Admin123!`.
- Tres servicios de ejemplo con precios vigentes.
- Cupón de bienvenida `BIENVENIDA10`.
Cambiar las credenciales después del primer inicio de sesión.

## Variables de entorno
Ver `.env.example` para la lista completa. Variables principales:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `EMAIL_SERVER_*` o `RESEND_API_KEY`
- `CLOUDINARY_*` (opcional)
- `COINBASE_COMMERCE_API_KEY` / `COINBASE_COMMERCE_WEBHOOK_SECRET`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` (opcional)
- `PUBLIC_BASE_URL`

## Tests
```bash
npm test
npm run test:e2e
```

## Deploy
Usa el `Dockerfile` y `render.yaml` como referencia para producción.
