import type { Metadata } from 'next'
import RequestSongForm from './RequestSongForm'
import { absoluteUrl, raasteOgImage, SITE_NAME } from '@/lib/site-metadata'

const requestTitle = 'Make Your RAASTE — Indian Road Radio'
const requestDescription = 'Share 5-15 songs that mean something to you. RAASTE may turn them into a personal Indian Road Radio page.'

export const metadata: Metadata = {
  title: requestTitle,
  description: requestDescription,
  alternates: {
    canonical: absoluteUrl('/request'),
  },
  openGraph: {
    type: 'website',
    title: requestTitle,
    description: requestDescription,
    url: absoluteUrl('/request'),
    siteName: SITE_NAME,
    images: [
      {
        url: raasteOgImage,
        width: 1200,
        height: 630,
        alt: 'RAASTE — Indian Road Radio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: requestTitle,
    description: requestDescription,
    images: [
      {
        url: raasteOgImage,
        alt: 'RAASTE — Indian Road Radio',
      },
    ],
  },
}

export default function Page() {
  return <RequestSongForm />
}
