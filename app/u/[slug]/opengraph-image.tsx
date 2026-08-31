import { ImageResponse } from 'next/og'
import { getPublishedRaasteBySlug } from '@/lib/published-raastes'

export const alt = 'RAASTE — Indian Road Radio'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: PageProps<'/u/[slug]'>) {
  const { slug } = await params
  const raaste = await getPublishedRaasteBySlug(slug)
  const title = raaste?.title || 'RAASTE'
  const hindiTitle = raaste?.hindiTitle || 'Indian Road Radio'
  const tagline = raaste?.tagline || 'Songs that stayed.'
  const displayName = raaste?.displayName || 'RAASTE'
  const accent = raaste?.ogAccent || '#9f3f2f'
  const songs = raaste?.curatedSongs.slice(0, 5) || []

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#16130f',
          color: '#f2dfb8',
          padding: '58px 66px',
          overflow: 'hidden',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: `radial-gradient(circle at 18% 18%, ${accent}66, transparent 34%), radial-gradient(circle at 82% 70%, #30435e70, transparent 36%), linear-gradient(135deg, #241b15 0%, #16130f 54%, #0a0805 100%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 54,
            right: 54,
            top: 48,
            bottom: 48,
            display: 'flex',
            border: '1px solid rgba(242, 223, 184, 0.24)',
            borderRadius: 28,
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: 'rgba(242, 223, 184, 0.84)',
          }}
        >
          <div>RAASTE</div>
          <div>{displayName}&apos;s radio</div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 840,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 7,
              textTransform: 'uppercase',
              color: 'rgba(217, 191, 143, 0.88)',
              marginBottom: 18,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 86,
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: 0,
              color: '#f2dfb8',
            }}
          >
            {hindiTitle}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 24,
              fontSize: 36,
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {tagline}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 28,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              maxWidth: 780,
            }}
          >
            {songs.map((song) => (
              <div
                key={song.title}
                style={{
                  display: 'flex',
                  border: '1px solid rgba(242, 223, 184, 0.28)',
                  borderRadius: 999,
                  backgroundColor: 'rgba(10, 8, 5, 0.38)',
                  padding: '9px 15px',
                  fontSize: 20,
                  fontWeight: 800,
                  color: 'rgba(242, 223, 184, 0.88)',
                }}
              >
                {song.title}
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: 'rgba(217, 191, 143, 0.78)',
              whiteSpace: 'nowrap',
            }}
          >
            Indian Road Radio
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
