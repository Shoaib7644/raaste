"use client"

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useExperiences } from '../lib/experiences-context'
import { experiences } from '../lib/experiences'
import Atmosphere from './Atmosphere'
import RaasteLogo from './RaasteLogo'
import CassetteSideSelector from './CassetteSideSelector'
import ExperienceCapsules from './ExperienceCapsules'
import MusicPlayer from './MusicPlayer'
import ActiveListenerCount from './ActiveListenerCount'
import ShareExperienceButton from './ShareExperienceButton'

const INSTAGRAM_URL = 'https://www.instagram.com/clive_shoaib?igsh=b25raGxrbDl3djVx&utm_source=qr'
const LINKEDIN_URL = 'https://www.linkedin.com/in/shoaib-ahmed-52b4445a'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="4.5" y="4.5" width="15" height="15" rx="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.8" cy="7.2" r="1" fill="currentColor" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.8 8.9H3.9v10h2.9v-10ZM5.4 7.5a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Zm13.7 5.9c0-3-1.6-4.8-4.1-4.8-1.5 0-2.5.7-3 1.5V8.9H9.2v10h2.9v-5.4c0-1.4.7-2.3 1.9-2.3 1.1 0 2 .7 2 2.4v5.3h2.9v-5.5Z"
      />
    </svg>
  )
}

function getIndiaTime() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  void children
  const pathname = usePathname()
  const { currentExperience, setCurrentExperience } = useExperiences()
  const [currentImage, setCurrentImage] = useState<string>(currentExperience.backgroundImage)
  const [previousImage, setPreviousImage] = useState<string | undefined>(undefined)
  const currentImageRef = useRef(currentExperience.backgroundImage)
  const [titleVisible, setTitleVisible] = useState(false)
  const [taglineVisible, setTaglineVisible] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(false)
  const [indiaTime, setIndiaTime] = useState('')
  const [aboutOpen, setAboutOpen] = useState(false)
  const closeAboutButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const syncTime = () => setIndiaTime(`${getIndiaTime()} IST`)

    syncTime()
    const intervalId = window.setInterval(syncTime, 60 * 1000)

    const handleVisibilityChange = () => {
      if (!document.hidden) syncTime()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', syncTime)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', syncTime)
    }
  }, [])

  useEffect(() => {
    if (!aboutOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAboutOpen(false)
      }
    }

    closeAboutButtonRef.current?.focus()
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [aboutOpen])

  // Update images when currentExperience changes
  useEffect(() => {
    const bgImage = currentExperience.backgroundImage
    if (currentImageRef.current === bgImage) return

    setPreviousImage(currentImageRef.current)
    currentImageRef.current = bgImage
    setCurrentImage(bgImage)
  }, [currentExperience.backgroundImage])

  useEffect(() => {
    if (!previousImage) return

    const timer = window.setTimeout(() => setPreviousImage(undefined), 900)
    return () => window.clearTimeout(timer)
  }, [previousImage])

  // Update currentExperience based on pathname
  useEffect(() => {
    const slug = pathname.replace(/^\//, '') || 'salon' // default to salon for root
    const foundExperience = experiences.find(exp => exp.slug === slug)
    if (foundExperience) {
      setCurrentExperience(foundExperience)
    }
  }, [pathname, setCurrentExperience])

  // Staggered fade-in animations
  useEffect(() => {
    const timer1 = setTimeout(() => setTitleVisible(true), 100)
    const timer2 = setTimeout(() => setTaglineVisible(true), 300)
    const timer3 = setTimeout(() => setControlsVisible(true), 600)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <>
      {/* Atmosphere */}
      <Atmosphere currentImage={currentImage} previousImage={previousImage} />
      {/* Header */}
      <div className="absolute top-0 left-0 z-30 flex w-full items-start justify-between px-4 pt-3 sm:px-5 sm:pt-4">
        <div className="flex flex-col items-start gap-2">
          <RaasteLogo />
          <div className="radio-utility-capsule">
            <span className="text-[11px]" aria-hidden="true">◷</span>
            {indiaTime || '\u00a0'}
          </div>
        </div>
        <div className="flex min-h-8 min-w-[6.8rem] justify-end pt-0.5 text-right">
          <ActiveListenerCount />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-16 pb-8 sm:pt-20">
        {/* Title and tagline */}
        <div className="-translate-y-20 text-center sm:-translate-y-16">
          <div className={`fade-up text-[11px] font-semibold uppercase tracking-[0.32em] text-print-paper/80 ${titleVisible ? 'visible' : ''}`}>
            {currentExperience.title}
          </div>
          <h1
            className={`font-raaste-display raaste-sign-rule raaste-print-soft mt-1 text-[3.25rem] font-bold leading-[0.95] text-print-cream sm:text-7xl ${titleVisible ? 'visible fade-up' : 'fade-up'}`}
          >
            {currentExperience.hindiTitle}
          </h1>
          <div className={`fade-up mt-4 text-[11px] font-medium uppercase tracking-[0.22em] text-print-paper/70 sm:mt-5 ${taglineVisible ? 'visible' : ''}`}>
            {currentExperience.stationMark}
          </div>
          <p
            className={`font-raaste-display fade-up mt-1 text-xl font-medium leading-tight text-white/90 sm:text-2xl ${taglineVisible ? 'visible' : ''}`}
          >
            {currentExperience.tagline}
          </p>
        </div>

        {/* Fixed bottom container for player and capsule controls */}
        <div className="fixed left-0 right-0 bottom-[8vh] z-20 flex flex-col items-center overflow-visible pointer-events-none sm:bottom-[7vh]">
          {/* Music player and controls */}
          <div className={`relative z-20 fade-up ${controlsVisible ? 'visible' : ''}`}>
            <MusicPlayer />
          </div>

          {currentExperience.slug === 'dads-cassette' && (
            <div className={`relative z-30 mt-2 overflow-visible fade-up ${controlsVisible ? 'visible' : ''}`}>
              <CassetteSideSelector />
            </div>
          )}

          {/* Experience capsules */}
          <div className={`relative z-40 mt-2 overflow-visible fade-up ${controlsVisible ? 'visible' : ''}`}>
            <ExperienceCapsules />
          </div>

          <div className={`relative z-40 mt-2 overflow-visible fade-up ${controlsVisible ? 'visible' : ''}`}>
            <ShareExperienceButton />
          </div>
        </div>
      </div>

      {aboutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/38 px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="raaste-about-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setAboutOpen(false)
            }
          }}
        >
          <div className="raaste-about-panel bg-radio-charcoal relative w-full max-w-sm overflow-hidden rounded-md border border-[rgba(242,223,184,0.22)] px-5 py-5 text-print-paper shadow-2xl sm:max-w-md sm:px-6">
            <div className="raaste-ink-speckle absolute inset-0" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="raaste-about-title" className="raaste-brand text-base font-black tracking-[0.18em]">
                    RAASTE
                  </h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-print-paper/68">
                    Indian Road Radio.
                  </p>
                </div>
                <button
                  ref={closeAboutButtonRef}
                  className="raaste-button-touch -mt-1 px-1 text-lg leading-none text-print-paper/68 hover:text-print-cream focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.7)]"
                  onClick={() => setAboutOpen(false)}
                  aria-label="Close about"
                  type="button"
                >
                  ×
                </button>
              </div>

              <p className="mt-5 text-sm leading-6 text-print-cream/88">
                A small collection of places, songs and memories from the India we grew up with.
              </p>

              <div className="font-raaste-display mt-5 space-y-1 text-lg leading-6 text-print-cream">
                <p>Barber shops.</p>
                <p>Bus windows.</p>
                <p>Dhaba nights.</p>
                <p>Monsoon drives.</p>
                <p>Dad&apos;s cassettes.</p>
              </div>

              <p className="mt-5 text-sm leading-6 text-print-paper/82">
                No algorithm. Just press play and take the road.
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-print-paper/58">
                Every station is a memory.
              </p>

              <div className="mt-6 flex items-center justify-between gap-4 text-xs text-print-paper/70">
                <span>Made with ♥ by Shoaib.</span>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="raaste-button-touch text-print-paper/78 hover:text-print-cream focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.7)]"
                >
                  Instagram →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <a
        href="#about"
        className="raaste-button-touch fixed bottom-11 left-4 z-30 pointer-events-auto text-xs font-medium uppercase tracking-[0.18em] text-print-paper/70 hover:text-print-cream focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.65)] sm:left-5"
        onClick={(event) => {
          event.preventDefault()
          setAboutOpen(true)
        }}
        aria-haspopup="dialog"
        aria-expanded={aboutOpen}
      >
        about
      </a>

      {/* Footer */}
      <div className="fixed bottom-3 left-0 z-10 flex w-full items-center justify-center gap-3 px-4 text-center text-xs text-white/60">
        <span>made with ♥ by Shoaib</span>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="pointer-events-auto text-white/58 transition hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
        >
          <InstagramIcon />
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="pointer-events-auto text-white/58 transition hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
        >
          <LinkedInIcon />
        </a>
      </div>
    </>
  )
}
