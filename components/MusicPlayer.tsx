"use client"

import { useEffect, useRef, useState } from 'react'
import { useMusicPlayer } from '../lib/MusicPlayerContext'
import { useExperiences } from '../lib/experiences-context'
import { loadYouTubeAPI } from '../lib/youtube'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function cleanYouTubeTitle(title: string) {
  return title
    .replace(/\s*\[[^\]]*(official|video|audio|lyrics?|song)[^\]]*\]\s*/gi, ' ')
    .replace(/\s*\([^)]*(official|video|audio|lyrics?|song)[^)]*\)\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanYouTubeAuthor(author: string) {
  return author
    .replace(/\s*-\s*Topic$/i, '')
    .replace(/\s*VEVO$/i, '')
    .trim()
}

export default function MusicPlayer() {
  const {
    player,
    videoTitle,
    videoArtist,
    isPlaying,
    isBuffering,
    setVideoTitle,
    setVideoArtist,
    setPlayerState,
    setPlayer,
  } = useMusicPlayer()
  const { currentExperience } = useExperiences()
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const playerHostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any | null>(null)
  const loadedPlaylistRef = useRef<string | null>(null)

  const song = videoTitle || currentExperience.microcopy
  const artist = videoTitle ? videoArtist || 'YouTube Music' : ''
  const progress = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0
  const activePlayer = playerRef.current || player

  const syncVideoData = (target = activePlayer) => {
    if (!target?.getVideoData) return

    const data = target.getVideoData()
    const title = cleanYouTubeTitle(data?.title || data?.video_title || '')
    const author = cleanYouTubeAuthor(data?.author || '')

    setVideoTitle(title)
    setVideoArtist(author)
  }

  useEffect(() => {
    if (!playerHostRef.current) return

    let isMounted = true
    loadYouTubeAPI()
      .then(() => {
        if (isMounted) {
          createPlayer()
        }
      })
      .catch(() => {
        setIsPlayerReady(false)
      })

    return () => {
      isMounted = false
    }
  }, [currentExperience])

  const createPlayer = () => {
    if (playerRef.current || !playerHostRef.current) return // already created

    try {
      const youtubeHost = document.createElement('div')
      playerHostRef.current.replaceChildren(youtubeHost)

      const newPlayer = new window.YT.Player(youtubeHost, {
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0,
          controls: 0,
          enablejsapi: 1,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            setIsPlayerReady(true)
            // Do NOT autoplay; wait for user to press play
          },
          onStateChange: (event: any) => {
            setPlayerState(event.data)
            syncVideoData(event.target)
          },
          onError: (event: any) => {
            event.target.nextVideo?.()
          }
        }
      })
      playerRef.current = newPlayer
      window.ytPlayer = newPlayer
      setPlayer(newPlayer)
    } catch (err) {
      setIsPlayerReady(false)
    }
  }

  // Cue the selected station without starting playback.
  useEffect(() => {
    const target = activePlayer
    if (isPlayerReady && target) {
      try {
        target.stopVideo?.()
        loadedPlaylistRef.current = null
        setVideoTitle('')
        setVideoArtist('')
        setCurrentTime(0)
        setDuration(0)
        target.cuePlaylist({
          list: currentExperience.playlistId,
          listType: 'playlist',
        })
        loadedPlaylistRef.current = currentExperience.playlistId
        setPlayerState(window.YT?.PlayerState?.CUED ?? 5)
        // Do NOT autoplay; wait for user to press play
      } catch (err) {
        setIsPlayerReady(false)
      }
    }
  }, [isPlayerReady, player, currentExperience.playlistId])

  useEffect(() => {
    const target = activePlayer
    if (!target) return

    const intervalId = window.setInterval(() => {
      try {
        setCurrentTime(target.getCurrentTime?.() ?? 0)
        setDuration(target.getDuration?.() ?? 0)
        syncVideoData(target)
      } catch {
        setCurrentTime(0)
        setDuration(0)
      }
    }, 500)

    return () => window.clearInterval(intervalId)
  }, [player])

  const handleSeek = (value: string) => {
    const target = activePlayer
    if (!target || duration <= 0) return

    const nextTime = (Number(value) / 100) * duration
    target.seekTo(nextTime, true)
    setCurrentTime(nextTime)
  }

  const handlePlayPause = () => {
    const target = activePlayer
    if (!target) return

    if (isPlaying) {
      target.pauseVideo()
      return
    }

    if (loadedPlaylistRef.current !== currentExperience.playlistId) {
      target.loadPlaylist({
        list: currentExperience.playlistId,
        listType: 'playlist',
        index: 0,
        startSeconds: 0,
      })
      loadedPlaylistRef.current = currentExperience.playlistId
    }

    target.playVideo()
    window.setTimeout(() => {
      if (target.getPlayerState?.() !== window.YT?.PlayerState?.PLAYING) {
        target.playVideo?.()
      }
    }, 250)
  }

  const handleNext = () => {
    const target = activePlayer
    if (!target) return

    target.nextVideo()
    window.setTimeout(() => syncVideoData(target), 250)
  }

  const handlePrevious = () => {
    const target = activePlayer
    if (!target) return

    target.previousVideo()
    window.setTimeout(() => syncVideoData(target), 250)
  }

  return (
    <div className="relative w-[min(680px,calc(100vw-32px))]">
      <div ref={playerHostRef} className="absolute inset-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
        {/* YouTube iframe will be inserted here as the hidden playback engine */}
      </div>

      <div className="pointer-events-auto bg-radio-charcoal relative overflow-hidden rounded-3xl border border-[rgba(242,223,184,0.22)] px-3 py-2 text-white shadow-xl sm:px-4 sm:py-3">
        <div className="raaste-ink-speckle absolute inset-0" aria-hidden="true" />
        <div className="grid grid-cols-[44px_minmax(0,1fr)_108px] items-center gap-3 sm:grid-cols-[64px_minmax(0,1fr)_132px] sm:gap-4">
          <div className={`raaste-player-disc relative flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(242,223,184,0.26)] bg-[rgba(242,223,184,0.12)] text-[8px] font-black uppercase tracking-[0.16em] text-print-cream shadow-md sm:h-16 sm:w-16 sm:text-[10px] ${isPlaying ? 'raaste-player-disc-playing' : ''}`}>
            RAASTE
          </div>

          <div className="relative min-w-0">
            <div className="font-raaste-display mb-0.5 text-[11px] font-semibold text-print-paper/85 sm:text-xs">
              {currentExperience.microcopy}
            </div>
            <div className="truncate text-sm font-semibold leading-5 text-print-cream sm:text-base">
              {song}
            </div>
            {artist && (
              <div className="mt-0.5 truncate text-xs text-white/68 sm:text-sm">
                {artist}
              </div>
            )}

            <div className="mt-1.5 grid grid-cols-[34px_minmax(0,1fr)_34px] items-center gap-2 text-[11px] text-print-paper/70 sm:mt-2">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(event) => handleSeek(event.target.value)}
                aria-label="Seek"
                className="h-1 w-full accent-white"
              />
              <span className="text-right">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="relative flex items-center justify-end gap-2 sm:gap-3">
            <button
              onClick={handlePrevious}
              disabled={!activePlayer}
              className="raaste-button-touch flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(242,223,184,0.1)] text-lg text-print-paper transition hover:bg-[rgba(242,223,184,0.18)] hover:text-print-cream focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.7)] disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10"
              aria-label="Previous"
              type="button"
            >
              ‹
            </button>
            <button
              onClick={handlePlayPause}
              disabled={!activePlayer}
              className={`raaste-button-touch flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(242,223,184,0.2)] text-base text-print-cream transition hover:bg-[rgba(242,223,184,0.28)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.7)] disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:w-12 ${isBuffering ? 'animate-pulse' : ''}`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              type="button"
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <button
              onClick={handleNext}
              disabled={!activePlayer}
              className="raaste-button-touch flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(242,223,184,0.1)] text-lg text-print-paper transition hover:bg-[rgba(242,223,184,0.18)] hover:text-print-cream focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.7)] disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10"
              aria-label="Next"
              type="button"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
