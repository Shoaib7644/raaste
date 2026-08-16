"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { experiences } from './experiences'

export type ExperiencesContextType = {
  currentExperience: {
    slug: string
    title: string
    hindiTitle: string
    tagline: string
    microcopy: string
    stationMark: string
    playlistId: string
    backgroundImage: string
  }
  setCurrentExperience: (experience: {
    slug: string
    title: string
    hindiTitle: string
    tagline: string
    microcopy: string
    stationMark: string
    playlistId: string
    backgroundImage: string
  }) => void
}

export const ExperiencesContext = createContext<ExperiencesContextType | null>(null)

export function useExperiences() {
  const context = useContext(ExperiencesContext)
  if (!context) {
    throw new Error('useExperiences must be used within an ExperiencesProvider')
  }
  return context
}

export function ExperiencesProvider({ children }: { children: ReactNode }) {
  const [currentExperience, setCurrentExperience] = useState<{
    slug: string
    title: string
    hindiTitle: string
    tagline: string
    microcopy: string
    stationMark: string
    playlistId: string
    backgroundImage: string
  }>(experiences[0]) // default to first experience

  const value = {
    currentExperience,
    setCurrentExperience
  }

  return (
    <ExperiencesContext.Provider value={value}>
      {children}
    </ExperiencesContext.Provider>
  )
}
