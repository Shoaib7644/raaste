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
      className={`raaste-cassette-side-deck pointer-events-auto grid w-[min(27rem,calc(100vw-1.5rem))] grid-cols-2 gap-1.5 rounded-[0.8rem] border border-[rgba(242,223,184,0.2)] bg-[linear-gradient(180deg,rgba(57,47,37,0.54),rgba(16,13,10,0.5))] p-1.5 shadow-[inset_0_1px_0_rgba(242,223,184,0.12),0_10px_24px_rgba(0,0,0,0.2)] backdrop-blur-[3px] ${
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
            className={`raaste-button-touch raaste-tape-side-button relative flex min-h-[3.15rem] flex-col items-start justify-center overflow-hidden rounded-[0.55rem] border px-3 py-2 text-left uppercase transition focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.82)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(22,19,15,0.72)] sm:min-h-[3.35rem] sm:px-3.5 ${
              selected
                ? 'raaste-tape-side-button-active border-[rgba(242,223,184,0.58)] bg-[rgba(226,197,145,0.86)] text-[#241b15] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-2px_0_rgba(36,27,21,0.18),0_0_16px_rgba(242,223,184,0.14)]'
                : 'border-[rgba(242,223,184,0.2)] bg-[rgba(30,25,20,0.64)] text-print-paper/82 shadow-[inset_0_2px_8px_rgba(0,0,0,0.26)] hover:border-[rgba(242,223,184,0.38)] hover:bg-[rgba(54,43,32,0.68)] hover:text-print-cream'
            }`}
            type="button"
            aria-pressed={selected}
            aria-label={`${side.side} — ${side.label}`}
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
            <span className="raaste-tape-screw left-1.5 top-1.5" aria-hidden="true" />
            <span className="raaste-tape-screw bottom-1.5 right-1.5" aria-hidden="true" />
            <span className="relative flex w-full items-center justify-between gap-2">
              <span className="text-[10px] font-black tracking-[0.18em] sm:text-[11px]">
                {side.side}
                <span className="opacity-55" aria-hidden="true"> &mdash;</span>
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-45" aria-hidden="true" />
            </span>
            <span className="relative mt-0.5 text-[8px] font-black leading-tight tracking-[0.11em] sm:text-[9px]">
              <span className="sr-only" aria-hidden="true"> </span>
              {side.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
