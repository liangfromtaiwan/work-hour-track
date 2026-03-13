# Work hours tracker

Lightweight freelance work-hours tracking for monthly contract and cap visibility. No backend — data is stored in the browser (localStorage).

## Contract rules

- **Monthly contract:** 15 hours  
- **Monthly max:** 30 hours  
- Over 15h requires discussion with the employer before more work.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Tech

- Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui  
- Persistence: `localStorage`  
- Seed data is loaded once when the app has no stored entries.

## Project layout

- `src/app/` — page and layout  
- `src/components/dashboard/` — summary cards, status banner, month filter, time entry form and table  
- `src/components/ui/` — shadcn components  
- `src/hooks/use-entries.ts` — entries state and localStorage sync  
- `src/lib/` — constants, hours calculations, storage helpers, seed data  
- `src/types/time-entry.ts` — `TimeEntry`, `MonthYear` types  
