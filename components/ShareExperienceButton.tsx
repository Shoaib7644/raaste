"use client"

import { useEffect, useState } from 'react'
import { useExperiences } from '../lib/experiences-context'

const shareTextBySlug: Record<string, string> = {
  salon: 'Step into a neighborhood salon from another India.',
  dhaba: 'A little roadside radio, somewhere on the highway.',
  'dads-cassette': 'Some songs are inherited.',
}

export default function ShareExperienceButton() {
  const { currentExperience } = useExperiences()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return

    const timer = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timer)
  }, [copied])

  const handleShare = async () => {
    const url = window.location.href
    const title = currentExperience.slug.startsWith('u/')
      ? `${currentExperience.title} - RAASTE`
      : `${currentExperience.title} — RAASTE`
    const text = shareTextBySlug[currentExperience.slug] ?? 'Tune into RAASTE — Indian Road Radio.'
    const browserNavigator = window.navigator

    try {
      if (browserNavigator.share) {
        await browserNavigator.share({ title, text, url })
        return
      }

      await browserNavigator.clipboard.writeText(url)
      setCopied(true)
    } catch (error) {
      if ((error as DOMException)?.name === 'AbortError') return

      try {
        await browserNavigator.clipboard.writeText(url)
        setCopied(true)
      } catch {
        setCopied(false)
      }
    }
  }

  return (
    <button
      className="pointer-events-auto inline-flex min-h-7 items-center justify-center rounded-full border border-[rgba(242,223,184,0.32)] bg-[rgba(10,8,5,0.46)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-print-cream/88 shadow-[0_7px_18px_rgba(0,0,0,0.22)] backdrop-blur-[4px] transition hover:border-[rgba(242,223,184,0.52)] hover:bg-[rgba(36,27,21,0.58)] hover:text-print-cream focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.78)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(22,19,15,0.72)]"
      type="button"
      aria-label={`Share ${currentExperience.title} experience`}
      aria-live="polite"
      onClick={handleShare}
    >
      {copied ? 'link copied' : 'share this experience ↗'}
    </button>
  )
}
