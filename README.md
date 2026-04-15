# Fénix Finanzas

Control financiero interno de Fénix Academy. Dashboard con suscripciones, marketing, nóminas y gastos personales.

## Stack

- **Next.js 14** (App Router, standalone)
- **Supabase** — Proyecto: `amyzbfafqdbmoyhvrkxm`
- **Tailwind CSS + shadcn/ui**
- **Docker** — Deploy via Easypanel

## Variables de entorno (Easypanel)

Configurar como **Build Args** Y **Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL=https://amyzbfafqdbmoyhvrkxm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFteXpiZmFmcWRibW95aHZya3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzI3OTIsImV4cCI6MjA5MTg0ODc5Mn0.lfnjVn2ebylPV50ZuUThbqIfWespYnLb-FZT8o2hbeM
```

## Base de datos

Ejecutar `supabase/migrations/001_schema.sql` en el SQL Editor del proyecto Supabase.

## Dev local

```bash
npm install
npm run dev
```
