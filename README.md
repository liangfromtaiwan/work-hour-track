# Work hours tracker

Lightweight freelance work-hours tracking for monthly contract and cap visibility. Data is stored in **Supabase (PostgreSQL)** when environment variables are set.

## Contract rules

- **Monthly contract:** 15 hours  
- **Monthly max:** 30 hours  
- Over 15h requires discussion with the employer before more work.

## Supabase setup

1. Open your project (for example [Supabase dashboard](https://supabase.com/dashboard/project/skncrqljzromxsbtntku)) → **SQL** → New query.
2. Paste and run the migration in `supabase/migrations/20260211000000_reports_and_time_entries.sql`. It creates `reports` and `time_entries`, enables RLS with anon policies (personal/demo use), and seeds `share_token = demo-report`.
3. **Project Settings → API**: copy **Project URL** and **anon public** key.
4. Copy `.env.example` to `.env.local`, set `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and adjust URL/token if your project differs.

```bash
cp .env.example .env.local
```

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port shown in the terminal).

## Build

```bash
npm run build
npm start
```

## Tech

- Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui  
- Persistence: Supabase (`reports`, `time_entries`) via `src/lib/reports.ts`  
- Optional: `src/lib/storage.ts` is legacy localStorage helpers (not wired to the main hook).

## Project layout

- `src/app/` — page and layout  
- `src/components/dashboard/` — summary cards, month filter, time entry form and table  
- `src/components/ui/` — shadcn components  
- `src/hooks/use-entries.ts` — entries state and Supabase sync  
- `src/lib/` — constants, hours calculations, Supabase client, reports API  
- `src/types/time-entry.ts` — `TimeEntry`, `MonthYear` types  
- `supabase/migrations/` — SQL schema for Supabase  
