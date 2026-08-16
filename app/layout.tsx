import type { Metadata } from "next";
import { Baloo_2, Geist } from "next/font/google";
import "./globals.css";
import { ExperiencesProvider } from '../lib/experiences-context'
import { MusicPlayerProvider } from '../lib/MusicPlayerContext'
import ClientLayout from '@/components/ClientLayout'

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
  title: "RAASTE — Indian Road Radio",
  description: "Indian road radio for forgotten places and old songs.",
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
      </body>
    </html>
  );
}
