import Image from "next/image";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { DropCountdown } from "@/components/drop-countdown";
import { products } from "@/lib/frnk-data";

export const metadata = {
  title: "Drop 01: Dark Brown System | FRNK+",
  description: "FRNK+ Drop 01 campaign: dark brown, black, and white minimal streetwear.",
};

export default function DropPage() {
  const featured = products.slice(0, 3);

  return (
    <main className="min-h-screen bg-[var(--frnk-black)] text-white">
      <nav className="relative mx-auto flex h-18 max-w-[1680px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/collection" className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/58 hover:text-[var(--frnk-blue)]">Shop</Link>
        <Link href="/" className="absolute left-1/2 inline-flex -translate-x-1/2" aria-label="FRNK+ home"><BrandLogo /></Link>
        <Link href="/lookbook" className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/58 hover:text-[var(--frnk-blue)]">Book</Link>
      </nav>

      <section className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden bg-[var(--frnk-orange)]">
        <Image src="/images/frnkplus-play-duo.png" alt="FRNK+ Drop 01 campaign models" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,253,249,0.06)_0%,rgba(23,19,16,0.54)_100%)]" />
        <div className="relative mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-[1680px] flex-col justify-between p-5 text-[#fffdf9] sm:p-8 lg:p-10">
          <div className="flex justify-between gap-5 text-[10px] font-medium uppercase tracking-[0.2em]">
            <p>Drop 01</p><p>Studio system / 2026</p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-[#fffdf9]/40 pt-5">
            <div>
              <h1 className="text-[clamp(3.8rem,10vw,9rem)] font-semibold leading-[0.78]">DARK BROWN<br />SYSTEM.</h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#fffdf9]/78">Coffee brown, black layers, and a little colour around the edges.</p>
            </div>
            <Link href="#pieces" className="inline-flex h-12 items-center justify-center border border-[#fffdf9]/60 px-6 text-sm font-medium transition hover:bg-[#fffdf9] hover:text-[#171310]">Shop the drop</Link>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto grid max-w-[1680px] gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--frnk-tan)]">Drop notes</p>
          <div>
            <h2 className="max-w-3xl text-[clamp(2.8rem,6vw,5.6rem)] font-semibold leading-[0.84]">Soft structure.<br />Strong colour.</h2>
            <div className="mt-7 grid max-w-2xl gap-4 text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
              <p>Black carries the silhouette. Brown brings the warmth. Blue and orange are only there to keep the room awake.</p>
              <p>Drop 01 is built as a daily system: a cap, a puffer, and a clean city layer.</p>
            </div>
          </div>
        </div>
      </section>

      <DropCountdown />

      <section id="pieces" className="mx-auto max-w-[1680px] px-5 py-14 sm:px-8 lg:px-10">
        <div className="mb-6 flex items-center justify-between border-b border-white/12 pb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/48"><p>Drop pieces</p><p>{featured.length} / 03</p></div>
        <div className="grid gap-x-4 gap-y-10 md:grid-cols-3">
        {featured.map((product) => (
          <Link key={product.id} href={`/collection/${product.slug}`} className="group">
            <div className="relative aspect-[0.82] overflow-hidden bg-[var(--frnk-coffee)]">
              <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
            </div>
            <div className="flex items-start justify-between gap-4 pt-4">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="mt-1 text-xs text-white/46">{product.color}</p>
              </div>
              <p className="text-sm">${product.price}</p>
            </div>
          </Link>
        ))}
        </div>
      </section>
    </main>
  );
}
