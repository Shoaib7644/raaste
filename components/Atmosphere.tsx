"use client"

import Image from 'next/image'
import { useState } from 'react'

type AtmosphereProps = {
  currentImage: string
  previousImage?: string
}

type AtmosphereImageProps = {
  src: string
  mode: 'current' | 'previous'
}

function AtmosphereImage({ src, mode }: AtmosphereImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Image
      src={src}
      alt="atmosphere"
      fill
      sizes="100vw"
      className="absolute inset-0 object-cover transition-opacity duration-700 ease-out"
      style={{ opacity: mode === 'current' ? (loaded ? 1 : 0) : (loaded ? 0 : 1) }}
      priority
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
    />
  )
}

export default function Atmosphere({ currentImage, previousImage }: AtmosphereProps) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 atmosphere-drift">
        {/* Previous image */}
        {previousImage && (
          <AtmosphereImage key={`previous-${previousImage}`} src={previousImage} mode="previous" />
        )}
        {/* Current image */}
        {currentImage && (
          <AtmosphereImage key={`current-${currentImage}`} src={currentImage} mode="current" />
        )}
        {/* Vignette: subtle darken at edges */}
        <div className="atmosphere-ambient-light absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30 pointer-events-none" aria-hidden="true" />
        <div className="atmosphere-grain absolute inset-0 opacity-[0.035]" aria-hidden="true" />
      </div>
    </div>
  )
}
