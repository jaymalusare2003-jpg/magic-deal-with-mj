# MAGIC DEAL WITH MJ

AI-Powered CPA Affiliate Marketing Management Platform

## Deployment

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the schema from `src/lib/db/schema.sql`
3. This will create all tables with default data (countries, categories, CPA networks, AI employees)

### 2. Get Supabase Credentials

From your Supabase project settings:
- Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

#### Option B: Using Vercel Dashboard
1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repository
4. Set Environment Variables (see below)
5. Deploy

### 4. Environment Variables

Set these in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=your-vercel-app-url
```

### 5. Create Admin Account

After deployment:
1. Go to your app URL
2. Click "Admin Login"
3. Sign up with your email and password
4. In Supabase SQL Editor, update your role to super_admin:
```sql
UPDATE profiles SET role = 'super_admin' WHERE email = 'your-email@example.com';
```

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- Secure Admin authentication with Supabase Auth
- AI Employee system with 11 specialized agents
- CPA Network management (AdsBlueMedia, CPAGrip, + custom)
- Offer management with country targeting
- Landing Page Builder with drag-drop editor
- Dynamic country-based offer routing
- Campaign management with UTM tracking
- Analytics dashboard with charts
- AI-powered reports
- Compliance center
- Link health monitoring
- PWA installable app
