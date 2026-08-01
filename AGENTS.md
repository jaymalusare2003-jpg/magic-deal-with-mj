# Agent Guidelines

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npx tsc --noEmit` - Type check
- `npm run lint` - Run ESLint

## Project Structure
- `src/app/` - Next.js App Router pages (admin + public routes)
- `src/components/` - Shared React components
- `src/lib/` - Utilities, Supabase client, AI client, constants
- `src/lib/db/` - Database schema and TypeScript types
- `src/app/api/` - API routes (AI, tracking, link health)

## Conventions
- Server components fetch data, client components handle interactions
- Use `@/components/ui/*` for UI primitives
- Use `@/lib/supabase/server` for server-side queries
- Use `@/lib/supabase/client` for client-side queries
- Always use `as any` for Supabase calls with joined tables
- Commit with descriptive messages
