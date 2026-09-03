-- Run supabase/published_raastes.sql first.
-- This publishes Syed Yusuf's curated request as /u/yusuf.

do $$
declare
  v_request_id uuid := '5b0dd04e-56b3-4073-85bc-1fa2f79a469b';
  v_playlist_id text := 'PLBiKfA_dXD5s';
  v_curated_songs jsonb := '[
    { "title": "Ehsaas", "artist": "Faheem Abdullah, Duha Shah, Vaibhav Pani, Hyder Dar" },
    { "title": "Tum", "artist": "Murtaza Qizilbash" },
    { "title": "Faasle", "artist": "Kaavish, Quratulain Balouch" },
    { "title": "Bolna", "artist": "Tanishk Bagchi, Arijit Singh, Asees Kaur" },
    { "title": "Lambiya Judaiyan", "artist": "Bilal Saeed" },
    { "title": "A Thousand Years", "artist": "Christina Perri" },
    { "title": "past life", "artist": "Ariana Grande" },
    { "title": "Style", "artist": "Taylor Swift" },
    { "title": "Rude", "artist": "MAGIC!" }
  ]'::jsonb;
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
    v_request_id,
    'yusuf',
    'Yusuf',
    'YUSUF''S RAASTE',
    'यूसुफ़ की प्लेलिस्ट',
    'A mixtape made from songs that stayed.',
    'A personal RAASTE playlist by Yusuf. Indian Road Radio for songs, memory, and the long way home.',
    v_playlist_id,
    '/images/custom-raaste.webp',
    v_curated_songs,
    '#526344',
    true,
    now()
  )
  on conflict (slug) do update set
    request_id = excluded.request_id,
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

  update public.song_requests
  set
    status = 'published',
    published_slug = 'yusuf',
    updated_at = now()
  where id = v_request_id;
end $$;
