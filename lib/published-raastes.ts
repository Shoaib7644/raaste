import { cache } from 'react'
import { getSupabaseAdmin } from './supabase/server'

export type PublishedRaasteSong = {
  title: string
  artist: string | null
}

export type PublishedRaaste = {
  id: string
  requestId: string | null
  slug: string
  displayName: string
  title: string
  hindiTitle: string | null
  tagline: string
  description: string
  playlistId: string
  backgroundImage: string
  curatedSongs: PublishedRaasteSong[]
  ogAccent: string
  publishedAt: string | null
}

type PublishedRaasteRow = {
  id: string
  request_id: string | null
  slug: string
  display_name: string
  title: string
  hindi_title: string | null
  tagline: string
  description: string
  playlist_id: string
  background_image: string | null
  curated_songs: unknown
  og_accent: string | null
  published_at: string | null
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function parseCuratedSongs(value: unknown): PublishedRaasteSong[] {
  if (!Array.isArray(value)) return []

  return value
    .map((song) => {
      if (!song || typeof song !== 'object') return null

      const item = song as Record<string, unknown>
      const title = typeof item.title === 'string' ? item.title.trim() : ''
      const artist = typeof item.artist === 'string' ? item.artist.trim() : ''

      if (!title) return null

      return {
        title,
        artist: artist || null,
      }
    })
    .filter((song): song is PublishedRaasteSong => Boolean(song))
    .slice(0, 15)
}

function mapPublishedRaaste(row: PublishedRaasteRow): PublishedRaaste {
  return {
    id: row.id,
    requestId: row.request_id,
    slug: row.slug,
    displayName: row.display_name,
    title: row.title,
    hindiTitle: row.hindi_title,
    tagline: row.tagline,
    description: row.description,
    playlistId: row.playlist_id,
    backgroundImage: row.background_image || '/images/dads-cassette.webp',
    curatedSongs: parseCuratedSongs(row.curated_songs),
    ogAccent: row.og_accent || '#9f3f2f',
    publishedAt: row.published_at,
  }
}

export const getPublishedRaasteBySlug = cache(async (slug: string) => {
  const normalizedSlug = slug.trim().toLowerCase()

  if (!slugPattern.test(normalizedSlug)) {
    return null
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('published_raastes')
    .select(
      [
        'id',
        'request_id',
        'slug',
        'display_name',
        'title',
        'hindi_title',
        'tagline',
        'description',
        'playlist_id',
        'background_image',
        'curated_songs',
        'og_accent',
        'published_at',
      ].join(', ')
    )
    .eq('slug', normalizedSlug)
    .eq('is_published', true)
    .maybeSingle<PublishedRaasteRow>()

  if (error) {
    console.error('Unable to load published RAASTE', error)
    return null
  }

  return data ? mapPublishedRaaste(data) : null
})
