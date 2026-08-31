import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'

const MIN_SONGS = 5
const MAX_SONGS = 15
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000

type IncomingSong = {
  title?: unknown
  artist?: unknown
}

type SongRequestPayload = {
  name?: unknown
  email?: unknown
  city?: unknown
  songs?: unknown
  note?: unknown
  consent?: unknown
  website?: unknown
}

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  let payload: SongRequestPayload

  try {
    payload = await request.json()
  } catch {
    return jsonError('Invalid request body')
  }

  if (text(payload.website)) {
    return jsonError('Invalid request', 400)
  }

  const name = text(payload.name)
  const email = text(payload.email).toLowerCase()
  const city = text(payload.city)
  const note = text(payload.note)

  if (!name || name.length > 80) {
    return jsonError('Please enter your name.')
  }

  if (!email || email.length > 120 || !isValidEmail(email)) {
    return jsonError('Please enter a valid email address.')
  }

  if (city.length > 80) {
    return jsonError('City is too long.')
  }

  if (note.length > 800) {
    return jsonError('Note is too long.')
  }

  if (payload.consent !== true) {
    return jsonError('Please confirm that RAASTE can contact you about this request.')
  }

  if (!Array.isArray(payload.songs)) {
    return jsonError('Please add your songs.')
  }

  if (payload.songs.length < MIN_SONGS || payload.songs.length > MAX_SONGS) {
    return jsonError(`Please send between ${MIN_SONGS} and ${MAX_SONGS} songs.`)
  }

  const songs = payload.songs.map((song) => {
    const item = song as IncomingSong
    return {
      title: text(item.title),
      artist: text(item.artist),
    }
  })

  const hasInvalidSong = songs.some((song) => !song.title || song.title.length > 120 || song.artist.length > 120)
  if (hasInvalidSong) {
    return jsonError('Each song needs a title. Keep song and artist names short.')
  }

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch {
    return jsonError('Song requests are not configured yet.', 503)
  }

  const duplicateSince = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString()
  const { data: existingRequest, error: duplicateError } = await supabase
    .from('song_requests')
    .select('id')
    .eq('email', email)
    .gte('created_at', duplicateSince)
    .limit(1)

  if (duplicateError) {
    return jsonError('Could not check this request. Please try again.', 500)
  }

  if (existingRequest && existingRequest.length > 0) {
    return jsonError('We already received a request from this email recently.', 409)
  }

  const { error } = await supabase.from('song_requests').insert({
    name,
    email,
    city: city || null,
    songs,
    note: note || null,
    status: 'pending',
    notification_status: 'not_sent',
  })

  if (error) {
    return jsonError('Could not save your songs. Please try again.', 500)
  }

  return NextResponse.json({ success: true })
}
