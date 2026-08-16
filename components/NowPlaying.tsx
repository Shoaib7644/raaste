"use client"

import { useMusicPlayer } from '../lib/MusicPlayerContext'

export default function NowPlaying() {
  const { videoTitle, videoArtist } = useMusicPlayer()
  const song = videoTitle || 'NOW PLAYING'

  return (
    <div className="text-center text-white/80 space-y-1">
      {!videoTitle && (
        <div className="text-xs uppercase tracking-wider">NOW PLAYING</div>
      )}
      {videoArtist && (
        <>
          <div className="text-sm font-medium">{song}</div>
          <div className="text-base font-semibold">{videoArtist}</div>
        </>
      )}
      {!videoArtist && (
        <>
          <div className="text-base font-semibold">{song}</div>
        </>
      )}
    </div>
  )
}
