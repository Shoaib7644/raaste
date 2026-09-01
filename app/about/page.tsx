const PORTFOLIO_URL = 'https://shoaib-ahmed-quraishi-portfolio.vercel.app'

export default function About() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-2xl flex-col items-center justify-center text-center">
      <div>
        <h1 className="raaste-brand text-3xl font-black uppercase tracking-[0.2em] text-print-cream sm:text-4xl">RAASTE</h1>
        <p className="font-raaste-display mt-4 text-2xl leading-tight text-print-cream sm:text-3xl">
          Indian Road Radio.
        </p>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-print-paper/86 sm:text-base">
          A small collection of places, songs and memories from the India we grew up with.
        </p>

        <div className="font-raaste-display mt-8 space-y-2 text-xl leading-7 text-print-cream sm:text-2xl">
          <p>SALON 1998.</p>
          <p>DHABA 12:47 AM.</p>
          <p>DAD&apos;S CASSETTE.</p>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-sm leading-6 text-print-paper/82 sm:text-base">
          Make Your RAASTE lets listeners send 5-15 songs that may become a small personal radio page with its own shareable URL.
        </p>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-print-paper/62">
          Every station is a memory. Some can now be yours.
        </p>
        <a
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex text-xs font-medium uppercase tracking-[0.16em] text-print-paper/70 transition hover:text-print-cream focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(242,223,184,0.7)]"
        >
          Visit Shoaib&apos;s portfolio ↗
        </a>
      </div>
    </div>
  );
}
