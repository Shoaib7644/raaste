"use client"

import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'

const MIN_SONGS = 5
const MAX_SONGS = 15

type Song = {
  title: string
  artist: string
}

const emptySong = (): Song => ({ title: '', artist: '' })

export default function RequestSongForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [note, setNote] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [songs, setSongs] = useState<Song[]>(() => Array.from({ length: MIN_SONGS }, emptySong))
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validSongCount = useMemo(
    () => songs.filter((song) => song.title.trim()).length,
    [songs],
  )

  const updateSong = (index: number, field: keyof Song, value: string) => {
    setSongs((currentSongs) =>
      currentSongs.map((song, songIndex) =>
        songIndex === index ? { ...song, [field]: value } : song,
      ),
    )
  }

  const addSong = () => {
    if (songs.length >= MAX_SONGS) return
    setSongs((currentSongs) => [...currentSongs, emptySong()])
  }

  const removeSong = (index: number) => {
    if (songs.length <= MIN_SONGS) return
    setSongs((currentSongs) => currentSongs.filter((_, songIndex) => songIndex !== index))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    setError('')

    if (validSongCount < MIN_SONGS) {
      setError(`Add at least ${MIN_SONGS} song titles before sending.`)
      return
    }

    if (!consent) {
      setError('Please confirm that RAASTE can contact you about this request.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/song-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          city,
          songs,
          note,
          consent,
          website,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.error || 'Could not send your songs. Please try again.')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Could not send your songs. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section className="mx-auto flex min-h-[58vh] w-full max-w-2xl flex-col items-center justify-center text-center">
        <div className="raaste-request-panel relative w-full overflow-hidden rounded-md border border-[rgba(242,223,184,0.24)] bg-[rgba(22,19,15,0.54)] px-5 py-8 text-print-paper shadow-2xl backdrop-blur-[6px] sm:px-8 sm:py-10">
          <div className="raaste-ink-speckle absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-print-paper/64">
              Make Your RAASTE
            </p>
            <h1 className="font-raaste-display mt-3 text-4xl font-bold leading-none text-print-cream sm:text-5xl">
              Your songs are on their way.
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-print-cream/86 sm:text-base">
              Thanks for sharing a little piece of your RAASTE. We&apos;ll listen, curate, and get back to you if your personal page makes it onto the radio.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-print-paper/66">
              Keep an eye on your inbox.
            </p>
            <Link
              href="/"
              className="raaste-button-touch mt-7 inline-flex min-h-9 items-center justify-center rounded-full border border-[rgba(242,223,184,0.38)] bg-[rgba(242,223,184,0.76)] px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#241b15] shadow-[0_8px_18px_rgba(0,0,0,0.2)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.78)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(22,19,15,0.72)]"
            >
              Back to RAASTE
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-print-paper/70">
          RAASTE requests
        </p>
        <h1 className="font-raaste-display raaste-print-soft mt-3 text-5xl font-bold leading-none text-print-cream sm:text-6xl">
          Make your own RAASTE
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-print-cream/84 sm:text-base">
          Give us 5-15 songs that mean something to you. We&apos;ll listen, curate, and may turn them into a personal RAASTE page.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="raaste-request-panel relative mt-8 overflow-hidden rounded-md border border-[rgba(242,223,184,0.22)] bg-[rgba(22,19,15,0.52)] px-4 py-5 text-print-paper shadow-2xl backdrop-blur-[6px] sm:mt-10 sm:px-6 sm:py-6"
      >
        <div className="raaste-ink-speckle absolute inset-0" aria-hidden="true" />
        <div className="relative space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold uppercase tracking-[0.16em] text-print-paper/78">
              Name
              <input
                className="mt-2 w-full rounded-md border border-[rgba(242,223,184,0.24)] bg-[rgba(10,8,5,0.48)] px-3 py-2.5 text-sm normal-case tracking-normal text-print-cream outline-none transition placeholder:text-print-paper/42 focus:border-[rgba(242,223,184,0.68)] focus:ring-1 focus:ring-[rgba(242,223,184,0.42)]"
                required
                maxLength={80}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
              />
            </label>

            <label className="block text-xs font-bold uppercase tracking-[0.16em] text-print-paper/78">
              Email
              <input
                className="mt-2 w-full rounded-md border border-[rgba(242,223,184,0.24)] bg-[rgba(10,8,5,0.48)] px-3 py-2.5 text-sm normal-case tracking-normal text-print-cream outline-none transition placeholder:text-print-paper/42 focus:border-[rgba(242,223,184,0.68)] focus:ring-1 focus:ring-[rgba(242,223,184,0.42)]"
                required
                type="email"
                maxLength={120}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your@email.com"
              />
              <span className="mt-1.5 block text-[10px] font-medium normal-case leading-4 tracking-normal text-print-paper/55">
                We&apos;ll use this only to contact you if your RAASTE is ready.
              </span>
            </label>
          </div>

          <label className="block text-xs font-bold uppercase tracking-[0.16em] text-print-paper/78">
            City
            <input
              className="mt-2 w-full rounded-md border border-[rgba(242,223,184,0.24)] bg-[rgba(10,8,5,0.48)] px-3 py-2.5 text-sm normal-case tracking-normal text-print-cream outline-none transition placeholder:text-print-paper/42 focus:border-[rgba(242,223,184,0.68)] focus:ring-1 focus:ring-[rgba(242,223,184,0.42)]"
              maxLength={80}
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Where are you from? (optional)"
            />
          </label>

          <div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-print-paper/78">
                  Songs
                </h2>
                <p className="mt-1 text-xs text-print-paper/58">
                  {validSongCount}/{MIN_SONGS} minimum. Add up to {MAX_SONGS}.
                </p>
              </div>
              <button
                className="raaste-button-touch rounded-full border border-[rgba(242,223,184,0.3)] bg-[rgba(242,223,184,0.14)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-print-cream disabled:cursor-not-allowed disabled:opacity-42"
                type="button"
                onClick={addSong}
                disabled={songs.length >= MAX_SONGS}
              >
                + Add another song
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {songs.map((song, index) => (
                <fieldset
                  key={`song-${index}`}
                  className="grid gap-2 rounded-md border border-[rgba(242,223,184,0.16)] bg-[rgba(10,8,5,0.26)] p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
                >
                  <legend className="px-1 text-[10px] font-black uppercase tracking-[0.16em] text-print-paper/58">
                    Song {index + 1}
                  </legend>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-print-paper/70">
                    Song title
                    <input
                      className="mt-1.5 w-full rounded-md border border-[rgba(242,223,184,0.2)] bg-[rgba(10,8,5,0.5)] px-3 py-2 text-sm normal-case tracking-normal text-print-cream outline-none transition placeholder:text-print-paper/38 focus:border-[rgba(242,223,184,0.62)] focus:ring-1 focus:ring-[rgba(242,223,184,0.34)]"
                      required
                      maxLength={120}
                      value={song.title}
                      onChange={(event) => updateSong(index, 'title', event.target.value)}
                      placeholder="Pal Pal Dil Ke Paas"
                    />
                  </label>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-print-paper/70">
                    Artist / singer
                    <input
                      className="mt-1.5 w-full rounded-md border border-[rgba(242,223,184,0.2)] bg-[rgba(10,8,5,0.5)] px-3 py-2 text-sm normal-case tracking-normal text-print-cream outline-none transition placeholder:text-print-paper/38 focus:border-[rgba(242,223,184,0.62)] focus:ring-1 focus:ring-[rgba(242,223,184,0.34)]"
                      maxLength={120}
                      value={song.artist}
                      onChange={(event) => updateSong(index, 'artist', event.target.value)}
                      placeholder="Kishore Kumar"
                    />
                  </label>
                  {songs.length > MIN_SONGS && (
                    <button
                      className="raaste-button-touch rounded-full px-2 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-print-paper/62 hover:text-print-cream focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.68)]"
                      type="button"
                      onClick={() => removeSong(index)}
                    >
                      Remove
                    </button>
                  )}
                </fieldset>
              ))}
            </div>
          </div>

          <label className="block text-xs font-bold uppercase tracking-[0.16em] text-print-paper/78">
            Note / dedication
            <textarea
              className="mt-2 min-h-28 w-full resize-y rounded-md border border-[rgba(242,223,184,0.24)] bg-[rgba(10,8,5,0.48)] px-3 py-2.5 text-sm normal-case tracking-normal text-print-cream outline-none transition placeholder:text-print-paper/42 focus:border-[rgba(242,223,184,0.68)] focus:ring-1 focus:ring-[rgba(242,223,184,0.42)]"
              maxLength={800}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Why do these songs matter to you? (optional)"
            />
          </label>

          <label className="hidden" aria-hidden="true">
            Website
            <input
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </label>

          <label className="flex items-start gap-3 text-sm leading-5 text-print-cream/82">
            <input
              className="mt-1 h-4 w-4 rounded border-[rgba(242,223,184,0.5)] bg-transparent accent-[#d9bf8f]"
              type="checkbox"
              required
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>I&apos;d like to hear from RAASTE when my playlist/page is ready.</span>
          </label>

          {error && (
            <p className="rounded-md border border-[rgba(159,63,47,0.42)] bg-[rgba(159,63,47,0.18)] px-3 py-2 text-sm text-print-cream" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-xs leading-5 text-print-paper/56">
              No automatic publishing. We listen first.
            </p>
            <button
              className="raaste-button-touch inline-flex min-h-10 w-full items-center justify-center rounded-full border border-[rgba(242,223,184,0.46)] bg-[rgba(242,223,184,0.82)] px-5 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#241b15] shadow-[0_9px_20px_rgba(0,0,0,0.24)] transition disabled:cursor-not-allowed disabled:opacity-58 sm:w-auto"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send My Songs'}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
