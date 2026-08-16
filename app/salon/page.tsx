import type { Metadata } from "next";
import { raasteOgImage, SITE_NAME } from "@/lib/site-metadata";

const salonTitle = "SALON 1998 — RAASTE";
const salonDescription = "बिल्लू बार्बर · बाल कटेंगे, गाने नहीं।";

export const metadata: Metadata = {
  title: salonTitle,
  description: salonDescription,
  alternates: {
    canonical: "/salon",
  },
  openGraph: {
    type: "website",
    title: salonTitle,
    description: salonDescription,
    url: "/salon",
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
    title: salonTitle,
    description: salonDescription,
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
