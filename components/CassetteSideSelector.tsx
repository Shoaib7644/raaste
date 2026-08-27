"use client"

import { dadsCassetteSides, experiences } from '../lib/experiences'
import { useExperiences } from '../lib/experiences-context'
import { useEffect, useRef, useState } from 'react'

type SwitchDirection = 'left' | 'right' | null

export default function CassetteSideSelector() {
  const { currentExperience, setCurrentExperience } = useExperiences()
  const [switchDirection, setSwitchDirection] = useState<SwitchDirection>(null)
  const switchTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (switchTimerRef.current) {
        window.clearTimeout(switchTimerRef.current)
      }
    }
  }, [])

  if (currentExperience.slug !== 'dads-cassette') {
    return null
  }

  const cassetteExperience = experiences.find((experience) => experience.slug === 'dads-cassette')
  if (!cassetteExperience) {
    return null
  }

  return (
    <div
      className={`raaste-cassette-side-deck pointer-events-auto flex max-w-[min(34rem,calc(100vw-1.5rem))] flex-wrap items-center justify-center gap-1 rounded-[1.6rem] border border-[rgba(242,223,184,0.22)] bg-[rgba(36,27,21,0.32)] p-1 shadow-[0_8px_22px_rgba(0,0,0,0.16)] backdrop-blur-[2px] ${
        switchDirection === 'right'
          ? 'raaste-cassette-switch-right'
          : switchDirection === 'left'
            ? 'raaste-cassette-switch-left'
            : ''
      }`}
      aria-label="Dad's Cassette sides"
    >
      {dadsCassetteSides.map((side) => {
        const selected = currentExperience.playlistId === side.playlistId
        const currentSideIndex = dadsCassetteSides.findIndex((item) => item.playlistId === currentExperience.playlistId)
        const nextSideIndex = dadsCassetteSides.findIndex((item) => item.playlistId === side.playlistId)

        return (
          <button
            key={side.id}
            className={`raaste-button-touch inline-flex min-h-8 items-center justify-center rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] transition focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.82)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(22,19,15,0.72)] sm:px-3.5 sm:text-[10px] ${
              selected
                ? 'border-[rgba(242,223,184,0.68)] bg-[rgba(242,223,184,0.78)] text-[#241b15] shadow-[inset_0_0_0_1px_rgba(36,27,21,0.14),0_0_12px_rgba(242,223,184,0.12)]'
                : 'border-transparent bg-[rgba(242,223,184,0.16)] text-print-paper/88 hover:bg-[rgba(242,223,184,0.28)] hover:text-print-cream'
            }`}
            type="button"
            aria-pressed={selected}
            aria-label={`${side.side}: ${side.label}`}
            onClick={() => {
              if (selected) return

              if (switchTimerRef.current) {
                window.clearTimeout(switchTimerRef.current)
              }

              setSwitchDirection(nextSideIndex > currentSideIndex ? 'right' : 'left')
              setCurrentExperience({
                ...cassetteExperience,
                playlistId: side.playlistId,
              })
              switchTimerRef.current = window.setTimeout(() => setSwitchDirection(null), 460)
            }}
          >
            <span>{side.side}</span>
            <span className="opacity-70" aria-hidden="true"> · </span>
            <span>{side.label}</span>
            {selected && <span className="ml-1.5" aria-hidden="true">✓</span>}
          </button>
        )
      })}
    </div>
  )
}
