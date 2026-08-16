"use client"

import Link from 'next/link'
import { useExperiences } from '../lib/experiences-context'
import { experiences } from '../lib/experiences'
import { useState, useEffect } from 'react'

export default function ExperienceSelector() {
  const { currentExperience } = useExperiences()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof Element && !event.target.closest('.experience-selector')) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="experience-selector relative z-40 inline-block overflow-visible">
      <button
        className="pointer-events-auto inline-flex items-center justify-center gap-1 px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-print-paper/85 transition hover:text-print-cream focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.65)]"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Select experience"
        type="button"
      >
        {currentExperience.title}
        <span aria-hidden="true">{open ? '˄' : '˅'}</span>
      </button>
      {open && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2">
          <div className="raaste-dropdown-enter bg-radio-charcoal relative w-64 overflow-hidden rounded-md border border-[rgba(242,223,184,0.22)] shadow-lg">
            <div className="raaste-ink-speckle absolute inset-0" aria-hidden="true" />
            <div className="relative border-b border-[rgba(242,223,184,0.14)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-print-paper/70">
              RAASTE / STATIONS
            </div>
            <div className="relative px-2 pt-1 pb-2 space-y-1">
              {experiences.map((exp) => (
                <Link
                  key={exp.slug}
                  href={`/${exp.slug}`}
                  className="block rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-print-paper/82 hover:bg-[rgba(242,223,184,0.1)] hover:text-print-cream focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.7)]"
                  onClick={() => {
                    setOpen(false)
                  }}
                >
                  {exp.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
