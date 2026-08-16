import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Baloo_2, Geist } from "next/font/google";
import "./globals.css";
import { ExperiencesProvider } from '../lib/experiences-context'
import { MusicPlayerProvider } from '../lib/MusicPlayerContext'
import ClientLayout from '@/components/ClientLayout'
import {
  raasteOgImage,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  siteMetadataBase,
} from "@/lib/site-metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const balooDisplay = Baloo_2({
  variable: "--font-raaste-display",
  subsets: ["devanagari", "latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: siteMetadataBase,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    images: [
      {
        url: raasteOgImage,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: raasteOgImage,
        alt: SITE_TITLE,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${balooDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ExperiencesProvider>
          <MusicPlayerProvider>
            <ClientLayout>{children}</ClientLayout>
          </MusicPlayerProvider>
        </ExperiencesProvider>
        <Analytics />
      </body>
    </html>
  );
}
