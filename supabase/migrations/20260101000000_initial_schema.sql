-- HealthyMe schema – accessed only via Edge Functions (service role)

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text default '',
  age text default '',
  avatar text default 'indigo',
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  last_active_date date,
  badges jsonb default '[]'::jsonb,
  completed_challenges integer default 0,
  onboarding_complete boolean default false,
  notifications boolean default true,
  language text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.moods (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  mood text not null,
  notes text default '',
  updated_at timestamptz default now(),
  unique (user_id, date)
);

create table if not exists public.sleep_entries (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  bedtime text not null,
  wake_time text not null,
  hours numeric(4,1) default 0,
  updated_at timestamptz default now(),
  unique (user_id, date)
);

create table if not exists public.water_entries (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  glasses integer default 0,
  updated_at timestamptz default now(),
  unique (user_id, date)
);

create table if not exists public.exercise_entries (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  type text not null,
  minutes integer default 0,
  calories integer,
  created_at timestamptz default now()
);

create table if not exists public.challenge_completions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  challenge_id text not null,
  xp integer default 0,
  completed_at timestamptz default now(),
  unique (user_id, date, challenge_id)
);

create index if not exists moods_user_date_idx on public.moods (user_id, date desc);
create index if not exists sleep_user_date_idx on public.sleep_entries (user_id, date desc);
create index if not exists water_user_date_idx on public.water_entries (user_id, date desc);
create index if not exists exercise_user_date_idx on public.exercise_entries (user_id, date desc);
create index if not exists challenges_user_date_idx on public.challenge_completions (user_id, date desc);

-- Block direct client DB access; Edge Functions use service role
alter table public.profiles enable row level security;
alter table public.moods enable row level security;
alter table public.sleep_entries enable row level security;
alter table public.water_entries enable row level security;
alter table public.exercise_entries enable row level security;
alter table public.challenge_completions enable row level security;

revoke all on public.profiles from anon, authenticated;
revoke all on public.moods from anon, authenticated;
revoke all on public.sleep_entries from anon, authenticated;
revoke all on public.water_entries from anon, authenticated;
revoke all on public.exercise_entries from anon, authenticated;
revoke all on public.challenge_completions from anon, authenticated;
