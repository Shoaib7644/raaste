"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { loadYouTubeAPI } from './youtube'

export type MusicPlayerContextType = {
  player: any | null
  videoTitle: string
  videoArtist: string
  isPlaying: boolean
  isBuffering: boolean
  playerState: number | null
  play: () => void
  pause: () => void
  next: () => void
  previous: () => void
  setVideoTitle: (title: string) => void
  setVideoArtist: (artist: string) => void
  setPlayerState: (state: number) => void
  setPlayer: (player: any) => void
}

export const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null)

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider')
  }
  return context
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<any | null>(null)
  const [videoTitle, setVideoTitle] = useState('')
  const [videoArtist, setVideoArtist] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [playerState, setRawPlayerState] = useState<number | null>(null)

  useEffect(() => {
    loadYouTubeAPI().then(() => {
      // The player will be created in the MusicPlayer component
    })
  }, [])

  const play = () => {
    if (player) {
      player.playVideo()
    }
  }

  const pause = () => {
    if (player) {
      player.pauseVideo()
    }
  }

  const next = () => {
    if (player) {
      player.nextVideo()
    }
  }

  const previous = () => {
    if (player) {
      player.previousVideo()
    }
  }

  const setPlayerState = (state: number) => {
    setRawPlayerState(state)

    const ytState = typeof window !== 'undefined' ? window.YT?.PlayerState : null
    const playing = ytState?.PLAYING ?? 1
    const paused = ytState?.PAUSED ?? 2
    const buffering = ytState?.BUFFERING ?? 3
    const cued = ytState?.CUED ?? 5
    const ended = ytState?.ENDED ?? 0
    const unstarted = ytState?.UNSTARTED ?? -1

    setIsBuffering(state === buffering)

    if (state === playing) {
      setIsPlaying(true)
      return
    }

    if (state === paused || state === cued || state === ended || state === unstarted) {
      setIsPlaying(false)
    }
  }

  const value = {
    player,
    videoTitle,
    videoArtist,
    isPlaying,
    isBuffering,
    playerState,
    play,
    pause,
    next,
    previous,
    setVideoTitle,
    setVideoArtist,
    setPlayerState,
    setPlayer
  }

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  )
}
