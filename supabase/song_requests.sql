create extension if not exists pgcrypto;

create table if not exists public.song_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  email text not null check (char_length(email) between 3 and 120),
  city text check (city is null or char_length(city) <= 80),
  songs jsonb not null check (
    jsonb_typeof(songs) = 'array'
    and jsonb_array_length(songs) between 5 and 15
  ),
  note text check (note is null or char_length(note) <= 800),
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'published', 'rejected')),
  published_slug text unique,
  notification_status text not null default 'not_sent' check (notification_status in ('not_sent', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists song_requests_status_created_at_idx
  on public.song_requests (status, created_at desc);

create index if not exists song_requests_email_created_at_idx
  on public.song_requests (email, created_at desc);

create or replace function public.set_song_requests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists song_requests_set_updated_at on public.song_requests;

create trigger song_requests_set_updated_at
before update on public.song_requests
for each row
execute function public.set_song_requests_updated_at();

alter table public.song_requests enable row level security;
