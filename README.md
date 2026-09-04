# Basta Manibela

Frontend for the Basta Manibela used-vehicle marketplace, built with Next.js
14 (App Router), TypeScript, and Tailwind CSS.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's here

- `/` — homepage: hero, trust strip, featured listings, browse-by-type,
  financing teaser, contact
- `/browse` — filterable inventory grid
- `/listing/[id]` — vehicle detail, financing estimate, reservation form
- `/favorites` — saved vehicles (currently stored in the browser's
  localStorage)
- `/financing` — full loan calculator (pure client-side math, no API needed)
- `/login` — UI stub, not wired to real auth yet

## Architecture note: this is frontend-only right now

All data comes from `lib/data/vehicles.json` through `lib/api/listings.ts`.
Every function in that file is `async` and shaped exactly like a real API
call would be (it can throw, it returns the same types a real endpoint
would). **When the backend is ready, only `lib/api/listings.ts` needs to
change** — swap the mock logic for real `fetch()` calls or a Supabase/Prisma
client. No component should need to change.

Same idea for favorites: `lib/useFavorites.ts` currently reads/writes
`localStorage`. Once accounts exist, swap its internals for calls to
`/api/favorites?userId=...` — the `toggle()` / `isFavorite()` interface used
by components stays the same.

## Suggested next steps (backend phase)

1. **Database**: Supabase (Postgres + Storage for photos + Auth) is a solid
   default — generous free tier, easy migration path.
2. **Auth**: Clerk or NextAuth/Auth.js, with Google + Facebook login.
3. **Reservations**: `submitReservation()` in `lib/api/listings.ts` should
   write to a `reservations` table and notify the dealership (email or a
   Messenger webhook).
4. **Images**: move from placeholder stock photos to real vehicle photos in
   Supabase Storage or Cloudinary.
5. **Payments** (if adding deposits later): PayMongo supports GCash/Maya/cards
   for PH customers.

## Design tokens

Colors, type, and layout choices are documented inline in
`tailwind.config.ts` and `app/globals.css` — pulled directly from the Basta
Manibela logo (black/gold/silver) rather than a generic template palette.
