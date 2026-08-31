create extension if not exists pgcrypto;

create table if not exists public.published_raastes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.song_requests(id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  display_name text not null check (char_length(display_name) between 1 and 80),
  title text not null check (char_length(title) between 1 and 120),
  hindi_title text check (hindi_title is null or char_length(hindi_title) <= 80),
  tagline text not null check (char_length(tagline) between 1 and 200),
  description text not null check (char_length(description) between 1 and 500),
  playlist_id text not null check (
    char_length(playlist_id) between 3 and 120
    and playlist_id <> 'REPLACE_WITH_PLAYLIST_ID'
  ),
  background_image text not null default '/images/dads-cassette.webp' check (char_length(background_image) <= 180),
  curated_songs jsonb not null default '[]'::jsonb check (
    jsonb_typeof(curated_songs) = 'array'
    and jsonb_array_length(curated_songs) <= 15
  ),
  og_accent text not null default '#9f3f2f' check (og_accent ~ '^#[0-9a-fA-F]{6}$'),
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists published_raastes_slug_published_idx
  on public.published_raastes (slug)
  where is_published = true;

create index if not exists published_raastes_request_id_idx
  on public.published_raastes (request_id);

create or replace function public.set_published_raastes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists published_raastes_set_updated_at on public.published_raastes;

create trigger published_raastes_set_updated_at
before update on public.published_raastes
for each row
execute function public.set_published_raastes_updated_at();

alter table public.published_raastes enable row level security;

drop policy if exists "Published RAASTEs are publicly readable" on public.published_raastes;

create policy "Published RAASTEs are publicly readable"
on public.published_raastes
for select
using (is_published = true);
