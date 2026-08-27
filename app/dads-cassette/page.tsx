import type { Metadata } from "next";
import { raasteOgImage, SITE_NAME } from "@/lib/site-metadata";

const dadsCassetteTitle = "DAD'S CASSETTE — RAASTE";
const dadsCassetteDescription =
  "A cassette full of songs you may have heard growing up. RAASTE — Indian Road Radio.";

export const metadata: Metadata = {
  title: dadsCassetteTitle,
  description: dadsCassetteDescription,
  alternates: {
    canonical: "https://raaste.online/dads-cassette",
  },
  openGraph: {
    type: "website",
    title: dadsCassetteTitle,
    description: dadsCassetteDescription,
    url: "https://raaste.online/dads-cassette",
    siteName: SITE_NAME,
    images: [
      {
        url: raasteOgImage,
        width: 1200,
        height: 630,
        alt: "RAASTE — Indian Road Radio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: dadsCassetteTitle,
    description: dadsCassetteDescription,
    images: [
      {
        url: raasteOgImage,
        alt: "RAASTE — Indian Road Radio",
      },
    ],
  },
};

export default function Page() {
  return null
}
