"use client"

import Link from 'next/link'
import { useExperiences } from '../lib/experiences-context'
import { experiences } from '../lib/experiences'

const liveSlugs = new Set(['salon', 'dhaba', 'dads-cassette'])

const capsuleItems = [
  { slug: 'salon', label: 'SALON 1998', status: 'LIVE' },
  { slug: 'dhaba', label: 'DHABA', status: 'LIVE' },
  { slug: 'dads-cassette', label: "DAD'S CASSETTE", status: 'LIVE/NEW' },
  { slug: 'bus', label: 'BUS', status: 'SOON' },
  { slug: 'monsoon', label: 'MONSOON', status: 'SOON' },
  { slug: 'truck', label: 'TRUCK', status: 'SOON' },
]

export default function ExperienceCapsules() {
  const { currentExperience, setCurrentExperience } = useExperiences()

  return (
    <nav className="pointer-events-auto flex max-w-[min(44rem,calc(100vw-1.5rem))] flex-wrap items-center justify-center gap-1.5 sm:gap-2" aria-label="RAASTE experiences">
      {capsuleItems.map((item) => {
        const isLive = liveSlugs.has(item.slug)
        const isActive = currentExperience.slug === item.slug
        const selectedExperience = experiences.find((experience) => experience.slug === item.slug)
        const sharedClasses =
          'inline-flex min-h-9 items-center justify-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] transition focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.86)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(22,19,15,0.72)] sm:min-h-8 sm:px-3.5'

        if (!isLive || !selectedExperience) {
          return (
            <button
              key={item.slug}
              className={`${sharedClasses} cursor-not-allowed border-[rgba(242,223,184,0.24)] bg-[rgba(242,223,184,0.28)] text-[#f2dfb8]/76`}
              type="button"
              disabled
              aria-disabled="true"
              aria-label={`${item.label} coming soon`}
            >
              <span>{item.label}</span>
              <span className="ml-1.5 text-[8px] tracking-[0.14em] opacity-72">{item.status}</span>
            </button>
          )
        }

        return (
          <Link
            key={item.slug}
            href={`/${item.slug}`}
            className={`${sharedClasses} ${
              isActive
                ? 'border-[rgba(242,223,184,0.82)] bg-[rgba(242,223,184,0.86)] text-[#241b15] shadow-[0_0_18px_rgba(242,223,184,0.18)]'
                : 'border-[rgba(242,223,184,0.42)] bg-[rgba(242,223,184,0.68)] text-[#241b15]/90 hover:border-[rgba(242,223,184,0.78)] hover:bg-[rgba(242,223,184,0.82)]'
            }`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`${item.label} experience`}
            onClick={() => setCurrentExperience(selectedExperience)}
          >
            <span>{item.label}</span>
            {isActive && <span className="ml-1.5 text-[10px]" aria-hidden="true">✓</span>}
          </Link>
        )
      })}
    </nav>
  )
}
