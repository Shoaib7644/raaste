import Link from 'next/link'

export default function RaasteLogo() {
  return (
    <Link
      href="/salon"
      className="raaste-brand raaste-button-touch pointer-events-auto text-base font-black tracking-[0.18em] focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.7)] sm:text-lg"
      aria-label="Go to SALON 1998"
    >
      RAASTE
    </Link>
  )
}
