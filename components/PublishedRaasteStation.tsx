"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { PublishedRaaste } from '@/lib/published-raastes'
import type { Experience } from '@/lib/experiences'
import { useExperiences } from '@/lib/experiences-context'
import Atmosphere from './Atmosphere'
import MusicPlayer from './MusicPlayer'
import ShareExperienceButton from './ShareExperienceButton'

type PublishedRaasteStationProps = {
  raaste: PublishedRaaste
}

export default function PublishedRaasteStation({ raaste }: PublishedRaasteStationProps) {
  const { setCurrentExperience } = useExperiences()
  const [titleVisible, setTitleVisible] = useState(false)
  const [taglineVisible, setTaglineVisible] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(false)
  const visibleSongs = raaste.curatedSongs.slice(0, 5)

  const personalExperience = useMemo<Experience>(() => ({
    slug: `u/${raaste.slug}`,
    title: raaste.title,
    hindiTitle: raaste.hindiTitle || raaste.displayName,
    tagline: raaste.tagline,
    microcopy: `${raaste.displayName}'s RAASTE is playing`,
    stationMark: 'personal / radio',
    playlistId: raaste.playlistId,
    backgroundImage: raaste.backgroundImage,
  }), [raaste])

  useEffect(() => {
    setCurrentExperience(personalExperience)
  }, [personalExperience, setCurrentExperience])

  useEffect(() => {
    const timer1 = window.setTimeout(() => setTitleVisible(true), 100)
    const timer2 = window.setTimeout(() => setTaglineVisible(true), 280)
    const timer3 = window.setTimeout(() => setControlsVisible(true), 520)

    return () => {
      window.clearTimeout(timer1)
      window.clearTimeout(timer2)
      window.clearTimeout(timer3)
    }
  }, [])

  return (
    <>
      <Atmosphere currentImage={raaste.backgroundImage} />
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 pb-44 pt-20 text-center sm:pb-40 sm:pt-24">
        <div className="-translate-y-16 sm:-translate-y-12">
          <div className={`fade-up text-[11px] font-semibold uppercase tracking-[0.32em] text-print-paper/80 ${titleVisible ? 'visible' : ''}`}>
            {raaste.displayName}&apos;s RAASTE
          </div>
          <h1
            className={`font-raaste-display raaste-sign-rule raaste-print-soft mt-1 text-[3.05rem] font-bold leading-[0.95] text-print-cream sm:text-7xl ${titleVisible ? 'visible fade-up' : 'fade-up'}`}
          >
            {raaste.hindiTitle || raaste.title}
          </h1>
          <div className={`fade-up mt-4 text-[11px] font-medium uppercase tracking-[0.22em] text-print-paper/70 sm:mt-5 ${taglineVisible ? 'visible' : ''}`}>
            made on raaste
          </div>
          <p
            className={`font-raaste-display fade-up mx-auto mt-1 max-w-[32rem] text-xl font-medium leading-tight text-white/90 sm:text-2xl ${taglineVisible ? 'visible' : ''}`}
          >
            {raaste.tagline}
          </p>

          {visibleSongs.length > 0 && (
            <div className={`fade-up mx-auto mt-6 flex max-w-[min(34rem,calc(100vw-2rem))] flex-wrap items-center justify-center gap-1.5 ${taglineVisible ? 'visible' : ''}`} aria-label="Selected songs">
              {visibleSongs.map((song, index) => (
                <span
                  key={`${song.title}-${index}`}
                  className="rounded-full border border-[rgba(242,223,184,0.24)] bg-[rgba(10,8,5,0.38)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-print-cream/82 shadow-[0_7px_18px_rgba(0,0,0,0.18)] backdrop-blur-[4px]"
                >
                  {song.title}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="fixed bottom-[8vh] left-0 right-0 z-20 flex flex-col items-center overflow-visible pointer-events-none sm:bottom-[7vh]">
          <div className={`relative z-20 fade-up ${controlsVisible ? 'visible' : ''}`}>
            <MusicPlayer />
          </div>

          <div className={`relative z-40 mt-2 flex items-center gap-2 overflow-visible fade-up ${controlsVisible ? 'visible' : ''}`}>
            <Link
              href="/request"
              className="raaste-button-touch pointer-events-auto inline-flex min-h-7 items-center justify-center rounded-full border border-[rgba(242,223,184,0.32)] bg-[rgba(242,223,184,0.74)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#241b15] shadow-[0_7px_18px_rgba(0,0,0,0.22)] backdrop-blur-[4px] transition hover:border-[rgba(242,223,184,0.58)] hover:bg-[rgba(242,223,184,0.88)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.78)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(22,19,15,0.72)]"
            >
              Make Your RAASTE
            </Link>
            <ShareExperienceButton />
          </div>
        </div>
      </div>
    </>
  )
}
