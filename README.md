# HealthyMe — Your Daily Wellness Companion

A modern wellness web app for teenagers, inspired by the **HBSC (Health Behaviour in School-aged Children)** study. HealthyMe helps users build healthy daily habits through mood tracking, sleep and hydration logs, exercise logging, daily challenges, achievements, and a supportive AI assistant.

The app is designed as a clean, responsive product with light/dark themes, gamification (XP, levels, badges, streaks), and a mobile-friendly layout.

---

## Features

- **Authentication** — Register, login, password reset, and user profiles (username, age, avatar)
- **Onboarding** — Guided setup for new users
- **Dashboard** — Wellness score, daily quote, streak, and quick links to trackers
- **Mood tracker** — Log mood and notes with history
- **Sleep tracker** — Bedtime/wake-up logging with weekly chart
- **Water tracker** — Daily glass goal with visual progress
- **Exercise tracker** — Log activities with weekly stats
- **Daily challenges** — One focused task per day with XP rewards
- **Achievements** — Unlockable badges
- **Statistics** — Charts for mood, sleep, water, exercise, and wellness trends
- **AI assistant** — Rule-based wellness guidance (stress, sleep, anxiety, habits)
- **Settings** — Theme (light/dark), notifications, language, sound

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev/) | UI framework |
| [Vite 6](https://vitejs.dev/) | Build tool and dev server |
| [React Router 7](https://reactrouter.com/) | Client-side routing |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling and responsive layout |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) | Statistics and tracker charts |
| [React Icons](https://react-icons.github.io/react-icons/) | Icon set |
| [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) | Celebration effects on challenge completion |

**Frontend architecture**

- `src/pages/` — Route-level views (Landing, Auth, Dashboard, trackers, etc.)
- `src/components/` — Reusable UI (Card, Button, layout, skeletons)
- `src/context/` — `AuthContext`, `WellnessContext`, `ThemeContext`
- `src/lib/` — Supabase client and Edge Function API client
- `src/utils/` — Helpers (wellness score, challenges, achievements, AI responses)

### Backend

| Technology | Purpose |
|------------|---------|
| [Supabase Auth](https://supabase.com/docs/guides/auth) | User registration, login, sessions, metadata |
| [Supabase PostgreSQL](https://supabase.com/docs/guides/database) | Persistent storage for profiles and wellness data |
| [Supabase Edge Functions](https://supabase.com/docs/guides/functions) | Server-side API (`wellness-api`) — all data access goes through here |
| [Deno](https://deno.com/) | Runtime for Edge Functions |

**Backend architecture**

- The browser **does not** talk to the database directly.
- The React app uses Supabase Auth for sessions, then calls the **`wellness-api`** Edge Function for profile and wellness CRUD.
- Registration is handled server-side (no confirmation email required when configured in Supabase).
- Database tables: `profiles`, `moods`, `sleep_entries`, `water_entries`, `exercise_entries`, `completed_challenges`.

**Local fallback (no Supabase)** — If environment variables are missing, the app can run with `localStorage` for demo/offline use.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- A [Supabase](https://supabase.com/) project (for full backend features)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for migrations and deploying Edge Functions)

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example file and fill in your Supabase project values:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Find these in the Supabase dashboard under **Project Settings → API**.

> Never commit `.env` or expose your **service role** key. Only the anon key belongs in the frontend.

### 3. Supabase setup (optional but recommended)

Link your project and apply the database schema:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

Deploy the Edge Function:

```bash
supabase functions deploy wellness-api
```

In **Authentication → Providers → Email**, you may disable **Confirm email** if you want instant signup without verification emails.

### 4. Run locally

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### 5. Production build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
healthyme/
├── src/
│   ├── components/     # UI and layout
│   ├── context/        # Global state
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Supabase + API client
│   ├── pages/          # App screens
│   └── utils/          # Business logic helpers
├── supabase/
│   ├── functions/
│   │   └── wellness-api/   # Edge Function API
│   └── migrations/         # SQL schema
├── .env.example
└── package.json
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---
