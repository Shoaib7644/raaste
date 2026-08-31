"use client"

import { useEffect, useState } from 'react'
import { useExperiences } from '../lib/experiences-context'
import { useMusicPlayer } from '../lib/MusicPlayerContext'

export default function DadsCassetteBoombox() {
  const { currentExperience } = useExperiences()
  const { isPlaying } = useMusicPlayer()
  const [isPageVisible, setIsPageVisible] = useState(true)

  useEffect(() => {
    const syncVisibility = () => setIsPageVisible(!document.hidden)

    syncVisibility()
    document.addEventListener('visibilitychange', syncVisibility)
    return () => document.removeEventListener('visibilitychange', syncVisibility)
  }, [])

  if (currentExperience.slug !== 'dads-cassette') {
    return null
  }

  const reelsPlaying = isPlaying && isPageVisible

  return (
    <div
      className={`raaste-boombox pointer-events-none select-none ${reelsPlaying ? 'raaste-boombox-playing' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 640 300" className="h-full w-full" focusable="false">
        <defs>
          <linearGradient id="boomboxBody" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ded2bd" />
            <stop offset="48%" stopColor="#8f897d" />
            <stop offset="100%" stopColor="#4f514f" />
          </linearGradient>
          <linearGradient id="boomboxFace" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f1dfbb" />
            <stop offset="56%" stopColor="#a79a83" />
            <stop offset="100%" stopColor="#5d5a52" />
          </linearGradient>
          <radialGradient id="speakerShadow" cx="50%" cy="46%" r="58%">
            <stop offset="0%" stopColor="#35332e" />
            <stop offset="72%" stopColor="#1d1a16" />
            <stop offset="100%" stopColor="#0d0b09" />
          </radialGradient>
          <filter id="agedNoise" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.08" />
            </feComponentTransfer>
            <feBlend mode="multiply" in2="SourceGraphic" />
          </filter>
        </defs>

        <ellipse cx="320" cy="277" rx="248" ry="18" fill="rgba(0,0,0,0.35)" />
        <path d="M166 54h308c20 0 37 16 37 37v2h-38v-2c0-1-1-2-2-2H169c-1 0-2 1-2 2v2h-38v-2c0-21 17-37 37-37Z" fill="#201b16" opacity="0.72" />
        <rect x="62" y="78" width="516" height="178" rx="28" fill="url(#boomboxBody)" />
        <rect x="78" y="94" width="484" height="140" rx="18" fill="url(#boomboxFace)" opacity="0.95" />
        <rect x="84" y="99" width="472" height="130" rx="15" fill="none" stroke="rgba(36,27,21,0.26)" strokeWidth="2" />

        <g opacity="0.96">
          <circle cx="169" cy="164" r="60" fill="url(#speakerShadow)" />
          <circle cx="471" cy="164" r="60" fill="url(#speakerShadow)" />
          {Array.from({ length: 7 }).map((_, index) => (
            <g key={`grille-${index}`}>
              <path d={`M${122 + index * 15} 112v104`} stroke="rgba(242,223,184,0.18)" strokeWidth="4" strokeLinecap="round" />
              <path d={`M${424 + index * 15} 112v104`} stroke="rgba(242,223,184,0.18)" strokeWidth="4" strokeLinecap="round" />
            </g>
          ))}
          <circle cx="169" cy="164" r="39" fill="none" stroke="rgba(242,223,184,0.13)" strokeWidth="6" />
          <circle cx="471" cy="164" r="39" fill="none" stroke="rgba(242,223,184,0.13)" strokeWidth="6" />
        </g>

        <g className="raaste-boombox-deck">
          <rect x="244" y="112" width="152" height="92" rx="12" fill="#28231d" />
          <rect x="256" y="125" width="128" height="60" rx="7" fill="#d8bd88" opacity="0.86" />
          <rect x="266" y="135" width="108" height="40" rx="4" fill="#211d18" opacity="0.88" />
          <path className="raaste-boombox-tape-glow" d="M268 135h104v40H268z" fill="rgba(242,223,184,0.18)" />

          <g transform="translate(292 155)">
            <g className="raaste-cassette-reel">
              <circle r="17" fill="#0f0d0a" stroke="rgba(242,223,184,0.34)" strokeWidth="3" />
              <circle r="6" fill="#d8bd88" opacity="0.78" />
              <path d="M0-14v28M-14 0h28M-10-10l20 20M10-10l-20 20" stroke="rgba(242,223,184,0.34)" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>

          <g transform="translate(348 155)">
            <g className="raaste-cassette-reel raaste-cassette-reel-right">
              <circle r="17" fill="#0f0d0a" stroke="rgba(242,223,184,0.34)" strokeWidth="3" />
              <circle r="6" fill="#d8bd88" opacity="0.78" />
              <path d="M0-14v28M-14 0h28M-10-10l20 20M10-10l-20 20" stroke="rgba(242,223,184,0.34)" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>

          <path d="M310 155c10 8 24 8 36 0" fill="none" stroke="rgba(242,223,184,0.28)" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g opacity="0.82">
          <rect x="240" y="86" width="160" height="13" rx="6.5" fill="#241b15" opacity="0.72" />
          <rect x="416" y="94" width="78" height="14" rx="7" fill="#241b15" opacity="0.56" />
          <rect x="508" y="94" width="28" height="14" rx="7" fill="#9f3f2f" opacity="0.72" />
          <rect x="120" y="88" width="82" height="9" rx="4.5" fill="#241b15" opacity="0.45" />
          <circle cx="113" cy="223" r="5" fill="#241b15" opacity="0.52" />
          <circle cx="527" cy="223" r="5" fill="#241b15" opacity="0.52" />
        </g>

        <g filter="url(#agedNoise)">
          <rect x="62" y="78" width="516" height="178" rx="28" fill="transparent" />
        </g>
        <path d="M96 119c42-18 99-18 144-4M413 213c37 7 83 5 118-8M279 99c34-4 74-3 104 5" fill="none" stroke="rgba(36,27,21,0.18)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}
