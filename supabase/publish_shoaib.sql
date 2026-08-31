-- Run supabase/published_raastes.sql first.
-- Update v_curated_songs after final curation if you want song chips in the page/OG image.

do $$
declare
  v_playlist_id text := 'PLgObA3pAqvOh87Z03QG8Z4xE-uqlAWSBy';
  v_curated_songs jsonb := '[]'::jsonb;
begin
  insert into public.published_raastes (
    request_id,
    slug,
    display_name,
    title,
    hindi_title,
    tagline,
    description,
    playlist_id,
    background_image,
    curated_songs,
    og_accent,
    is_published,
    published_at
  )
  values (
    null,
    'shoaib',
    'Shoaib',
    'SHOAIB''S RAASTE',
    'शोएब की प्लेलिस्ट',
    'A mixtape made from songs that stayed.',
    'A personal RAASTE playlist by Shoaib. Indian Road Radio for the long way home.',
    v_playlist_id,
    '/images/custom-raaste.webp',
    v_curated_songs,
    '#9f3f2f',
    true,
    now()
  )
  on conflict (slug) do update set
    display_name = excluded.display_name,
    title = excluded.title,
    hindi_title = excluded.hindi_title,
    tagline = excluded.tagline,
    description = excluded.description,
    playlist_id = excluded.playlist_id,
    background_image = excluded.background_image,
    curated_songs = excluded.curated_songs,
    og_accent = excluded.og_accent,
    is_published = excluded.is_published,
    published_at = coalesce(public.published_raastes.published_at, now());
end $$;
