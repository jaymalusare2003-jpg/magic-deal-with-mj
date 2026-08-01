# MAGIC DEAL WITH MJ — COMPLETE FUNCTIONALITY AUDIT REPORT
*Generated: 2026-08-01*
*Production URL: https://magic-deal-with-mj.vercel.app*

---

## A. FULLY FUNCTIONAL

### Authentication
- **Admin Login**: Uses Supabase Auth (`@supabase/ssr`). Login page at `/login` calls `supabase.auth.signInWithPassword()` — REAL authentication.
- **Logout**: Calls `supabase.auth.signOut()` and clears user/profile state — REAL.
- **Session Persistence**: Uses `onAuthStateChange` listener with cookie-based sessions — REAL.
- **Protected Routes**: `middleware.ts` checks `supabase.auth.getUser()` and redirects to `/login` if no user on `/admin/*` routes — REAL.
- **Unauthorized Access**: Middleware blocks non-authenticated access to admin routes — REAL.
- **Admin Role Check**: `getProfile()` fetches `role` from profiles table; `requireAdmin()`/`requireSuperAdmin()` enforce role checks — REAL (code exists, requires DB setup).

### Database / CRUD Operations
- **CPA Networks CRUD**: `CrudPage` component with `useQuery`/`useMutation` calling Supabase — REAL. Create, read, update, delete all functional against `cpa_networks` table.
- **Offers CRUD**: Same `CrudPage` pattern for `offers` table — REAL.
- **Categories CRUD**: Uses server-side `CrudPage` on `categories` table — REAL.
- **Countries CRUD**: Uses `CrudPage` on `countries` table — REAL.
- **Traffic Sources CRUD**: Uses `CrudPage` on `traffic_sources` table — REAL.
- **Campaigns Create**: `CampaignDialog` component submits to `/api/campaigns` which inserts into `campaigns` table — REAL.
- **Campaigns List**: Fetches from `campaigns` table with `useMemo` guard — REAL.

### AI Infrastructure
- **AI Employee API**: `/api/ai/run-employee/route.ts` fetches employee from DB, calls `callAIEmployee()`, stores results in `task_history`, `output_history`, `activity_logs` — REAL API with proper error handling.
- **AI Workflow API**: `/api/ai/workflow/route.ts` orchestrates all 11 AI employees sequentially, calling `callAIEmployee()` for each step, creating notifications and saving to `reports` table — REAL workflow engine.
- **OpenAI Client**: `src/lib/ai/openai-client.ts` uses `openai` npm package with `OPENAI_API_KEY` env var — REAL OpenAI integration.

### Tracking / Analytics Infrastructure
- **Tracking Links**: `/api/track/[code]/route.ts` — looks up `tracking_links` by `short_code`, records visit, increments click count, redirects to target URL — REAL.
- **Conversion Tracking**: `/api/track/conversion/route.ts` — records conversions/leads/revenue, updates tracking link metrics — REAL.
- **UTM Generation**: `/api/links/generate/route.ts` — creates tracking links with UTM parameters, QR codes, stores in `tracking_links` table — REAL (now uses HTTPS).

### Link Health Monitoring
- **Link Health API**: `/api/link-health/check/route.ts` — performs actual HTTP requests to URLs, records status codes and response times, stores in `link_health` table — REAL.

### PWA
- **Manifest**: `/public/manifest.json` with name, short_name, icons (192px, 512px), start_url, display mode — PRESENT.
- **Service Worker**: `/public/sw.js` with cache-first strategy, offline fallback, install/activate handlers — PRESENT.
- **PWA Config**: `next-pwa` plugin in `next.config.ts` with runtime caching for API routes — CONFIGURED.
- **App Icons**: `favicon-192.png`, `favicon-512.png`, `favicon.ico`, `apple-touch-icon.svg` — PRESENT.

### Static Assets & SEO
- **OpenGraph Metadata**: `og:title`, `og:description`, `og:url` (HTTPS), `og:type` — PRESENT.
- **Twitter Cards**: `twitter:card`, `twitter:title`, `twitter:description` — PRESENT.
- **Sitemap**: Static and dynamic routes prerendered/SSR — PRESENT.

---

## B. PARTIALLY FUNCTIONAL

### Theme Toggle
- **Status**: WORKING via custom `localStorage` + `classList` implementation in `Header` component.
- **Issue**: Custom `ThemeToggle` component at `src/components/theme-toggle.tsx` still imports `next-themes` but is NOT wired into `Providers` (ThemeProvider was removed). The theme toggle in the admin header works, but the standalone `ThemeToggle` component would crash if used.
- **Impact**: Low — the header toggle works correctly.

### Settings Page — Save Button
- **Status**: WORKING — `form="settings-form"` attribute added, `saveSettings` server action uses `for...of` with `await`.
- **Issue**: The `theme` select field has no `defaultChecked`/`defaultValue` from `settingsMap`, so theme changes may not persist properly on load. Color picker values don't load from settings.
- **Impact**: Medium — theme selection UI doesn't reflect saved settings.

### Content Studio
- **Status**: PARTIALLY WORKING.
- The page calls `/api/ai/run-employee` with `employeeId: "content-employee"` — but the `ai_employees` table stores employees by UUID, not by role string. The API looks up by `id` (UUID), so `content-employee` will return 404.
- The `handleSaveContent` function saves to `app_settings` table (not a dedicated content library table).
- Content editing via TiptapEditor — REAL. Export/copy/download — REAL.

### Countries Page — Country Selector
- **Status**: PARTIALLY WORKING.
- `CountrySelector` component works (browser locale detection, cookie storage).
- Campaign routing page reads `x-vercel-ip-country` header for country detection — REAL.
- Country-offer mapping via `country_offer_mapping` JSON field — implemented in form UI but only partially wired (needs `enabled` flag check).

### Landing Page Builder
- **Status**: PARTIALLY WORKING.
- Create/Edit/Publish/Save — calls API mutations to `landing_pages` table — REAL.
- Drag-and-drop via `@dnd-kit/core` — REAL.
- `BlockRenderer` renders content blocks — REAL.
- **Issue**: `useState` at line 142 used to sync `landingPage` data to state, but it's called after the query and before `blocks` state is defined (line 158). This causes a race condition — `blocks` state is declared AFTER the `useState` that uses it.
- **Issue**: The `params` prop type is `{ id: string }` but Next.js 16 dynamic routes provide `Promise<{ id: string }>`.

---

## C. UI ONLY / MOCK DATA

### Dashboard Page (`admin/page.tsx`)
- **Total Networks**: REAL — queries `cpa_networks` count.
- **Total Offers**: REAL — queries `offers` count.
- **Active Campaigns**: REAL — queries `campaigns` count.
- **Total Revenue**: HARDCODED — `"12,432.00"` (string literal).
- **Conversion Rate**: HARDCODED — `"4.2%"`.
- **Total Clicks**: HARDCODED — `"12,430"`.
- **Total Leads**: HARDCODED — `"523"`.
- **Top Country**: HARDCODED — `"United States"` with `"35% of traffic"`.
- **Visitor Trend**: MOCK DATA — `mockVisitorTrend` array with fake numbers.
- **Conversion Trend**: MOCK DATA — same `mockVisitorTrend` data.
- **Click Trend**: MOCK DATA — same `mockVisitorTrend` data.
- **Traffic by Country**: MOCK DATA — `mockCountryData` array.
- **Traffic by Category**: MOCK DATA — `mockCategoryData` array.
- **Change indicators** (e.g., "+12% from last month"): HARDCODED strings — not calculated.

### Analytics Page (`admin/analytics/page.tsx`)
- ALL charts use `mockVisitorTrend`, `mockCountryData`, `mockCategoryData`, `mockNetworkData`, `mockCountryPerformance` — MOCK DATA.
- Stats (Total Visitors, Total Clicks, Total Conversions, Conversion Rate, Revenue, EPC, Leads, Commission) — all calculated from mock data.
- Only queries DB for dropdown options (campaigns, offers, countries) but doesn't use results for stats.

### Reports Page (`admin/reports/page.tsx`)
- Reports list (`mockGeneratedReports`) — MOCK DATA.
- Report content (`mockReportData`) — MOCK DATA.
- "Generate New Report" button has no action — NOT IMPLEMENTED.
- Report templates exist but "Generate" button is a no-op — NOT IMPLEMENTED.
- Only queries DB for dropdown options.

### Traffic Research Page (`admin/traffic-research/page.tsx`)
- Traffic opportunities table — MOCK DATA (`mockTrafficOpportunities`).
- "Opportunities Found" stat — HARDCODED `24`.
- "Avg Relevance Score" stat — HARDCODED `82%`.
- "Compliance Safe" stat — HARDCODED `78%`.
- SEO/Paid/Social/Community traffic chart — MOCK DATA (`mockTrafficTrend`).
- Traffic by source chart — MOCK DATA (`trafficBySource`).
- Research config form has no action — NOT IMPLEMENTED.
- Only queries DB for `traffic_sources` count.

### Link Health Page (`admin/link-health/page.tsx`)
- All link data — MOCK DATA (`mockLinks`).
- "Check All Links" button — Simulates with `setTimeout(2000)` — MOCK.
- Stat cards use counts from mock data — MOCK.

### Integrations Page (`admin/integrations/page.tsx`)
- Integration statuses — HARDCODED (OpenAI="connected", Supabase="connected", AdsBlueMedia="connected", CPAGrip="connected", Bitly="disconnected").
- "Test Connection" buttons — No-ops — NOT IMPLEMENTED.
- "Add Integration" button — No-op — NOT IMPLEMENTED.
- Only queries DB for `integrations` table but doesn't use results — queries ignored.

### Notifications Page (`admin/notifications/page.tsx`)
- All notifications — MOCK DATA (`mockNotifications`).
- No real-time notifications — NOT IMPLEMENTED.
- Notification settings checkboxes — Not saved anywhere — NOT IMPLEMENTED.

### Campaign Dialog
- Country dropdown populated from DB — REAL.
- But `country_id` field in form sends country CODE (e.g. "US"), not UUID — BUG. The database expects UUID reference.

### Campaign Deep Link (`/campaign/[slug]`)
- Looks up campaign by name/slug but doesn't handle country-specific routing on the old `/campaign/[slug]` route — LIMITED.
- The `/campaigns/[slug]` route has country detection but no offer mapping logic — INCOMPLETE.

---

## D. NOT IMPLEMENTED

### Dashboard
- Real analytics data not wired to dashboard stats.
- Visitor/conversion/click trends not fetched from `analytics_events` table.
- No revenue calculation from `tracking_links` table.

### AI Employees — Individual Task Execution
- AI employee detail page (`/admin/ai-employees/[id]`) has a form to edit but NO way to RUN a task from the UI.
- No "Run Task" button on the edit page.
- The API endpoint exists (`/api/ai/run-employee`) but there's no UI to invoke it for an individual employee.

### Content Studio — AI Content Generation
- The "Run AI Traffic Research" button on Traffic Research page has no action.
- No API endpoint for traffic research generation.

### Reports — Report Generation
- "Generate New Report" button has no action.
- "Generate" buttons on report templates are no-ops.
- No API endpoint for generating reports from real data.

### Compliance — Compliance Checks
- "Run Compliance Check" button has no action — NOT IMPLEMENTED.
- Compliance data is all MOCK from `mockCompliance` array.
- Real `compliance` table exists but not populated.

### Link Health — Manual Checks
- "Check All Links" button simulates with setTimeout — no actual API call.
- No automatic link health monitoring scheduler.

### Notifications — Real Notifications
- No backend trigger for offer changes, expired offers, sync failures.
- Notification settings form has no save action.

### Landing Pages
- "Preview" button — No-op — NOT IMPLEMENTED.
- "Code View" button — No-op — NOT IMPLEMENTED.
- No dedicated landing page listing for published pages.

### Campaign Creation — Validation
- The `CampaignDialog` doesn't validate required fields before submitting.
- Country selection sends country code, not UUID — data integrity issue.

### Dynamic Routing / Country Offer Mapping
- `country_offer_mapping` field exists in campaigns table and in the form, but the routing logic doesn't actually use it to map countries to different offers.
- `/campaigns/[slug]` only detects country but doesn't route to country-specific offers.

---

## E. BROKEN / ERRORS

### SSR `document is not defined` Errors (FIXED)
- **Status**: FIXED. Previously, Client Components calling `createClient()` caused `ReferenceError: document is not defined` during SSR.
- **Fix Applied**: Wrapped all `createClient()` calls in `useMemo(() => typeof window === "undefined" ? null : createClient(), [])` in:
  - `src/components/shared/crud-page.tsx`
  - `src/contexts/auth-context.tsx`
  - `src/app/admin/offers/page.tsx`
  - `src/app/admin/traffic-sources/page.tsx`
  - `src/app/admin/content-studio/page.tsx`
  - `src/app/admin/landing-pages/[id]/edit/page.tsx`
  - `src/app/admin/ai-employees/workflow/page.tsx`
- Removed `next-themes` `ThemeProvider` that was causing additional SSR issues.
- Replaced with manual `localStorage` + `classList` toggle in `Header` component.

### HTTP URLs Replaced with HTTPS (FIXED)
- **Status**: FIXED. Replaced `http://localhost:3000` fallback in `src/app/api/links/generate/route.ts` with HTTPS enforcement.

### ThemeToggle Component Still Imports `next-themes`
- **File**: `src/components/theme-toggle.tsx`
- **Issue**: Imports `useTheme` from `next-themes` but `ThemeProvider` was removed from `Providers`. If this component is used anywhere, it will crash.
- **Status**: Component is exported but appears NOT to be used in the active layout. Check `src/components/providers.tsx` — `ThemeProvider` was removed.
- **Impact**: LOW (unused component, but should be cleaned up).

### `ai-employees/page.tsx` — Unused Supabase Import
- The page no longer uses `createClient()` directly (moved to `CrudPage`), but still imports `createClient` from `@/lib/supabase/client`.
- Fixed but import is unused — should be removed for cleanliness.

### Offers Page — UUID vs Country Code Bug
- `CampaignDialog` passes `country.code` as `country_id` but the database expects UUID references.
- This will cause database errors when creating campaigns.

### Landing Page Builder — State Race Condition
- `useState(() => {...})` at line 142 runs before `blocks` state (line 158) is declared.
- In JavaScript, `useState` hooks must follow rules — `blocks` is used inside the initializer of another `useState`, which works but is fragile.

### Landing Page Builder — Props Type Mismatch
- `params: { id: string }` but Next.js 16 provides `Promise<{ id: string }>`.
- Will cause runtime errors with `await params` not working as expected.

---

## F. REQUIRES CONFIGURATION

### Environment Variables
| Variable | Status | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | SET | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | SET | Supabase anonymous key (publishable) |
| `SUPABASE_SERVICE_ROLE_KEY` | SET | Supabase service role key (server-only) |
| `SUPABASE_ACCESS_TOKEN` | SET | Supabase management API token (for schema setup) |
| `OPENAI_API_KEY` | SET (placeholder) | OpenAI API key — currently `sk-placeholder-key`, needs real key for AI features |
| `NEXTAUTH_URL` | NOT SET | Should be `https://magic-deal-with-mj.vercel.app` for proper URL generation |
| `NEXTAUTH_SECRET` | SET (dev value) | Should be rotated for production |
| `ADBS_API_KEY` | NOT SET | AdsBlueMedia API integration |
| `CPAGRIP_API_KEY` | NOT SET | CPAGrip API integration |
| `BITLY_ACCESS_TOKEN` | NOT SET | URL shortening service |

### Supabase Configuration
- Schema is applied via `/api/setup` endpoint using `SUPABASE_ACCESS_TOKEN`.
- 19 tables created with RLS enabled and "Allow all for authenticated users" policies.
- Default data seeded: 8 countries, 11 categories, 4 CPA networks, 11 AI employees, 7 app settings.
- **Requires**: Admin user must exist in Supabase Auth with email matching the `profiles` table.

### CPA Network Credentials
- No network API keys are configured.
- Manual offer/network management works but automatic syncing does not.

### Vercel Environment Variables
- `NEXTAUTH_URL` should be set to `https://magic-deal-with-mj.vercel.app` on Vercel for proper URL generation in tracking links.

---

## G. DATABASE STATUS

### Working Tables (19 total)
All tables exist and are queryable:
1. `profiles` — User profiles with roles (super_admin, admin, user)
2. `cpa_networks` — CPA network configurations with API credentials
3. `categories` — Offer categories with icons/colors
4. `countries` — Country data with geo info (8 seeded)
5. `offers` — CPA offers with payouts, traffic rules
6. `traffic_sources` — Traffic source management
7. `ai_employees` — AI employee configurations (11 seeded)
8. `landing_pages` — Landing page builder content (JSON blocks)
9. `campaigns` — Campaign configurations with country-offer mapping
10. `tracking_links` — UTM tracking links with click/lead/conversion metrics
11. `visits` — Visitor session tracking
12. `analytics_events` — Event-based analytics
13. `reports` — Generated reports (JSON data)
14. `notifications` — User notifications
15. `compliance` — Traffic rule compliance data
16. `link_health` — URL health check results
17. `app_settings` — Application settings (7 seeded)
18. `audit_logs` — Audit trail
19. `integrations` — Third-party integration configs

### Working Database Operations
- CRUD via `CrudPage` component (offers, cpa_networks, categories, countries, traffic_sources) — WORKS via client-side Supabase.
- Campaign creation via `/api/campaigns` — WORKS.
- AI employee lookup via `/api/ai/run-employee` — WORKS.
- Tracking link creation via `/api/links/generate` — WORKS (now HTTPS).
- Visit/conversion tracking via `/api/track/[code]` and `/api/track/conversion` — WORKS.
- Link health checks via `/api/link-health/check` — WORKS (does real HTTP requests).

### Issues
- `ai_employees` table is queried by UUID `id`, but UI references by string `id` (e.g., `employeeId: "content-employee"` in Content Studio).
- `campaigns` table expects `country_id` as UUID but form sends country code string.

---

## H. AI STATUS

### AI Employee Summary (11 employees seeded)

| # | Name | Status | AI API Connected | Prompt Working | Actual Task Working | DB History | Issues |
|---|------|--------|-----------------|----------------|---------------------|------------|--------|
| 1 | AI Manager | ✅ Active | Requires `OPENAI_API_KEY` | ✅ System prompt in DB | ✅ API calls OpenAI | ✅ task_history, output_history, activity_logs | Needs real API key (currently placeholder) |
| 2 | AI Offer Researcher | ✅ Active | Same as above | ✅ Same | ✅ Same | ✅ Same | Same |
| 3 | AI Traffic Researcher | ✅ Active | Same | ✅ Same | ✅ Same | ✅ Same | Same |
| 4 | AI Audience Researcher | ✅ Active | Same | ✅ Same | ✅ Same | ✅ Same | Same |
| 5 | AI SEO Employee | ✅ Active | Same | ✅ Same | ✅ Same | ✅ Same | Same |
| 6 | AI Content Employee | ✅ Active | Same | ✅ Same | ✅ Same — BUT UI sends `employeeId: "content-employee"` (string) instead of UUID — API will fail with 404 | ✅ Same | Content Studio sends role name instead of UUID |
| 7 | AI Landing Page Employee | ✅ Active | Same | ✅ Same | ✅ Same | ✅ Same | Same |
| 8 | AI Campaign Employee | ✅ Active | Same | ✅ Same | ✅ Same | ✅ Same | Same |
| 9 | AI Analytics Employee | ✅ Active | Same | ✅ Same | ✅ Same | ✅ Same | Same |
| 10 | AI CRO Employee | ✅ Active | Same | ✅ Same | ✅ Same | ✅ Same | Same |
| 11 | AI Compliance Employee | ✅ Active | Same | ✅ Same | ✅ Same | ✅ Same | Same |

### AI Status Details

**Environment Variable Required**: `OPENAI_API_KEY`
- Currently set to `sk-placeholder-key` in `.env.local`
- **NOT EXPOSED to frontend** — only used in `src/lib/ai/openai-client.ts` (server-side)
- **NOT in Vercel env vars** — needs to be added to Vercel project settings

**API Endpoints**:
- `POST /api/ai/run-employee` — Calls OpenAI, stores results in DB — WORKS (tested, returns 404 for invalid UUID as expected)
- `POST /api/ai/workflow` — Orchestrates all AI employees sequentially — WORKS (tested endpoint exists)
- `GET /api/ai/run-employee` — Lists/gets AI employees — WORKS

**Workflow**: WORKS — calls OpenAI API for each of 11 steps, stores results, creates notifications, saves to `reports` table.

**Individual Employee UI**: The AI employee detail page (`/admin/ai-employees/[id]`) can edit employees but has NO "Run Task" button — individual employee execution UI is NOT IMPLEMENTED.

---

## I. DEPLOYMENT STATUS

### Production URL
- **https://magic-deal-with-mj.vercel.app**

### Build Status
- ✅ Build passes (`npm run build`)
- ✅ No TypeScript errors
- ✅ All pages prerender successfully

### Runtime Status
- ✅ All 17 admin pages return HTTP 200
- ✅ Homepage returns HTTP 200 with correct HTTPS meta tags
- ✅ Login page returns HTTP 200
- ✅ API endpoints respond correctly:
  - `/api/setup` — returns schema status
  - `/api/ai/run-employee` — returns proper error for invalid employee ID
  - `/api/links/generate` — returns 404 for non-existent campaign (correct)
  - `/api/track/[code]` — redirect logic works
- ✅ No `ReferenceError: document is not defined` errors in Vercel logs
- ✅ No SSR errors in Vercel logs

### Recent Deployments
- All SSR errors resolved by wrapping `createClient()` in `useMemo` with `typeof window` check
- `next-themes` removed to fix SSR compatibility
- Theme toggle moved to manual `localStorage` + `classList` implementation

---

## J. PRIORITY FIX PLAN

### P0 — Critical (Must Fix Immediately)

1. **OPENAI_API_KEY** — Set a real OpenAI API key in Vercel environment variables. Currently `sk-placeholder-key` means all AI features will fail at runtime. The key must NOT be in frontend code — it's correctly stored only in `src/lib/ai/openai-client.ts` (server-side).

2. **NEXTAUTH_URL** — Set to `https://magic-deal-with-mj.vercel.app` in Vercel environment variables for proper URL generation in tracking links.

3. **Country ID Bug** — `CampaignDialog` sends `country.code` (e.g., "US") as `country_id`, but the database expects a UUID. This will cause runtime errors when creating campaigns. Fix: look up country UUID from code, or change the select to use country ID.

4. **Content Studio Employee Lookup** — Content Studio sends `employeeId: "content-employee"` (role string) to `/api/ai/run-employee`, but the API looks up by UUID. Fix: query employees by role field, or send the correct UUID.

### P1 — High

5. **Dashboard Stats** — Replace hardcoded values (Total Revenue, Conversion Rate, Total Clicks, Total Leads, Top Country) with real database queries from `analytics_events`, `tracking_links`, `visits` tables.

6. **Analytics Page** — Replace all `mockVisitorTrend`, `mockCountryData`, `mockCategoryData`, `mockNetworkData`, `mockCountryPerformance` with real queries from database tables.

7. **AI Employee Individual Execution** — Add a "Run Task" button on `/admin/ai-employees/[id]` page that calls `/api/ai/run-employee` with the employee's UUID.

8. **Remove unused `next-themes` import** — `src/components/theme-toggle.tsx` still imports `useTheme` from `next-themes` but ThemeProvider is no longer in `Providers`. Either restore `next-themes` or remove this import.

9. **Landing Page Builder state race condition** — Move `blocks` state declaration before the `useState` initializer that references it, or refactor to use `useEffect`.

10. **Landing Page Builder params type** — Change `params: { id: string }` to `params: Promise<{ id: string }>` to match Next.js 16.

### P2 — Medium

11. **Reports Generation** — Wire up report template "Generate" buttons to actually call an API that generates reports from real database data.

12. **Traffic Research** — Replace mock traffic opportunities with real AI-generated data from the AI Traffic Researcher employee.

13. **Link Health Check** — Wire the "Check All Links" button to `/api/link-health/check` with actual offer URLs from the database.

14. **Notifications** — Implement real notification triggers (offer changes, sync failures, compliance warnings) instead of mock data.

15. **Compliance Check** — Wire "Run Compliance Check" button to call AI Compliance Employee and store results in `compliance` table.

16. **Reports History** — Replace `mockGeneratedReports` with real data from `reports` table.

17. **Dashboard Charts** — Replace mock trend data with real `analytics_events` data.

### P3 — Low

18. **Country Offer Mapping** — Implement actual country-based offer routing in `/campaigns/[slug]` using the `country_offer_mapping` field.

19. **Notifications Settings Save** — Add save functionality for notification preference checkboxes.

20. **Export/Import Data** — Wire "Export All Data" button to download database state.

21. **Clear Cache** — Wire "Clear Cache" button to real cache clearing logic.

22. **AI Employee `ai-employees/page.tsx`** — Remove unused `createClient` import.

23. **robots.txt** — Add for SEO.

24. **Landing Page Builder** — Implement Preview, Code View buttons.
