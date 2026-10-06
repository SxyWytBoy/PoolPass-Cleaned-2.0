# PoolPass

PoolPass is a modern web application that allows users to discover and book private or hotel pools in the UK for day use.

## 🌟 Features

- Search by location, date, and number of guests
- Filter pools by:
  - Amenities (e.g., loungers, showers, food & drink)
  - Accessibility
  - Pet-friendliness
  - Time of day and pricing
- Responsive, user-friendly interface
- Guest accounts: book pools (date, morning/afternoon/full day, guests, extras), cancel bookings, leave reviews
- Host accounts: create and publish listings, upload photos, set hours and extras, accept or decline bookings
- Waitlist, host applications and a contact form

## 🛠 Tech Stack

- **Framework:** Vite + React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI)
- **Backend:** Supabase
- **State / Data Fetching:** TanStack Query
- **Forms:** React Hook Form + Zod
- **Routing:** React Router v6
- **Hosting:** GitHub Pages (workflow included), or any static host

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/SxyWytBoy/PoolPass-Cleaned-2.0.git
cd PoolPass-Cleaned-2.0
npm install
```

### Real hotel venues and partner listings

Until hotels join, the site lists real UK hotel pools that offer day access
(`src/lib/venues.ts`). These are information-only: facts, a link to the hotel's own
website, an illustrative image, and no prices, reviews or booking. PoolPass is not
affiliated with them, and the details should be re-checked before launch.

When a hotel becomes a partner, its host links their listing to the venue in the host
dashboard. Once that listing is live, it replaces the venue's information page. On
Supabase, only an admin can set that link (`pools.venue_slug`), so a host can't claim
a hotel they don't represent.

### Demo mode (no setup needed)

If no Supabase credentials are set, PoolPass runs on a built-in **browser demo backend**
(`src/lib/local-backend.ts`). It comes with six sample pools and two accounts, and every
feature works. Data is saved in the visitor's own browser, so it is not shared between people.

| Account | Email | Password |
| ------- | ----- | -------- |
| Guest | `guest@poolpass.demo` | `poolpass123` |
| Host | `host@poolpass.demo` | `poolpass123` |

### Connecting Supabase (shared, real data)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql). It creates the tables,
   security policies, the rating trigger and the `pool-images` storage bucket.
3. Copy the example env file and add your project URL and anon key (Project Settings > API):

```bash
cp .env.example .env
```

With credentials set, the app uses Supabase automatically.

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── components/    # Reusable UI components
├── pages/         # Route-level page components
├── hooks/         # Custom React hooks
├── lib/           # Supabase client, demo backend, seed data and helpers
└── types/         # TypeScript type definitions
```

## 🔐 Environment Variables

See `.env.example` for all required variables. Never commit your `.env` file.

## 📦 Deployment

### GitHub Pages (included)

`.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.
One-off setup: in the repository go to **Settings > Pages** and set **Source** to **GitHub Actions**.
The site is then served at `https://<owner>.github.io/<repo>/`.

To use Supabase on the deployed site, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
as repository secrets (**Settings > Secrets and variables > Actions**).

### Other static hosts

Run `npm run build` and serve the `dist` folder. Unknown paths must fall back to `index.html`;
`vercel.json` (Vercel) and `public/_redirects` (Netlify) already handle this.

| Variable | Purpose |
| -------- | ------- |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Use Supabase instead of the demo backend |
| `VITE_BASE_PATH` | Serve from a sub-path, e.g. `/PoolPass-Cleaned-2.0/` |
| `VITE_ROUTER_MODE` | `browser` (default), `hash` or `memory` for hosts without URL rewrites |
