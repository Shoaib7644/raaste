import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PublishedRaasteStation from '@/components/PublishedRaasteStation'
import { getPublishedRaasteBySlug } from '@/lib/published-raastes'
import { absoluteUrl, SITE_NAME } from '@/lib/site-metadata'

export async function generateMetadata({ params }: PageProps<'/u/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const raaste = await getPublishedRaasteBySlug(slug)

  if (!raaste) {
    return {
      title: 'RAASTE not found — RAASTE',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = `${raaste.title} — RAASTE`
  const url = absoluteUrl(`/u/${raaste.slug}`)
  const imageUrl = absoluteUrl(`/u/${raaste.slug}/opengraph-image`)

  return {
    title,
    description: raaste.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      title,
      description: raaste.description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${raaste.title} — RAASTE`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: raaste.description,
      images: [
        {
          url: imageUrl,
          alt: `${raaste.title} — RAASTE`,
        },
      ],
    },
  }
}

export default async function Page({ params }: PageProps<'/u/[slug]'>) {
  const { slug } = await params
  const raaste = await getPublishedRaasteBySlug(slug)

  if (!raaste) {
    notFound()
  }

  return <PublishedRaasteStation raaste={raaste} />
}
