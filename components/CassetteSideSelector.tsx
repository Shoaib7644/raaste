"use client"

import { dadsCassetteSides, experiences } from '../lib/experiences'
import { useExperiences } from '../lib/experiences-context'

export default function CassetteSideSelector() {
  const { currentExperience, setCurrentExperience } = useExperiences()

  if (currentExperience.slug !== 'dads-cassette') {
    return null
  }

  const cassetteExperience = experiences.find((experience) => experience.slug === 'dads-cassette')
  if (!cassetteExperience) {
    return null
  }

  return (
    <div className="pointer-events-auto flex max-w-[min(18rem,calc(100vw-1.5rem))] items-center justify-center rounded-full border border-[rgba(242,223,184,0.22)] bg-[rgba(36,27,21,0.32)] p-1 shadow-[0_8px_22px_rgba(0,0,0,0.16)] backdrop-blur-[2px]" aria-label="Dad's Cassette sides">
      {dadsCassetteSides.map((side) => {
        const selected = currentExperience.playlistId === side.playlistId

        return (
          <button
            key={side.id}
            className={`raaste-button-touch inline-flex min-h-8 min-w-[5.6rem] items-center justify-center rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] transition focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.82)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(22,19,15,0.72)] sm:min-w-[6.2rem] sm:text-[10px] ${
              selected
                ? 'border-[rgba(242,223,184,0.68)] bg-[rgba(242,223,184,0.78)] text-[#241b15] shadow-[inset_0_0_0_1px_rgba(36,27,21,0.14),0_0_12px_rgba(242,223,184,0.12)]'
                : 'border-transparent bg-[rgba(242,223,184,0.16)] text-print-paper/88 hover:bg-[rgba(242,223,184,0.28)] hover:text-print-cream'
            }`}
            type="button"
            aria-pressed={selected}
            aria-label={`${side.side}: ${side.label}`}
            onClick={() => {
              setCurrentExperience({
                ...cassetteExperience,
                playlistId: side.playlistId,
              })
            }}
          >
            <span>{side.side}</span>
            {selected && <span className="ml-1.5" aria-hidden="true">✓</span>}
          </button>
        )
      })}
    </div>
  )
}
