# QubeLinx

Premium link-in-bio platform. Create one beautiful page for everything you share.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion, Recharts, dnd-kit, Lucide
- Demo persistence via local JSON store
- Supabase-ready schema + clients (`supabase/schema.sql`)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo account

- Email: `krishna@qubelinx.com`
- Password: `qubelinx123`
- Public page: [/krishna](http://localhost:3000/krishna)

## Environment

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Optional Supabase (production):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

When Supabase vars are unset, QubeLinx runs in full demo mode with file-backed storage in `.data/`.

## Product surfaces

- Landing page
- Auth (Google / Apple / email — demo OAuth simulated)
- Onboarding (username → profile → links → theme)
- Dashboard (overview, links, appearance, analytics, settings)
- Live phone preview
- Public profile pages with SEO metadata
- QR + share modal
- Drag-and-drop link ordering
- Light / dark / system themes

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
