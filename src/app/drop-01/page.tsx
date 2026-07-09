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
      <nav className="mx-auto flex h-18 max-w-[1680px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="inline-flex" aria-label="FRNK+ home">
          <BrandLogo />
        </Link>
        <Link href="/collection" className="text-xs uppercase text-white/58 hover:text-white">
          Collection
        </Link>
      </nav>

      <section className="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-[1680px] gap-8 px-5 pb-12 pt-6 sm:px-8 lg:grid-cols-12 lg:px-10">
        <div className="grid content-center lg:col-span-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--frnk-tan)]">Drop 01 / Campaign</p>
          <h1 className="mt-6 text-6xl font-semibold leading-[0.8] sm:text-8xl lg:text-[8.6rem]">Dark Brown System</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white/58">
            Coffee brown softens the black uniform. The silhouette stays sharp. The mood stays quiet.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/collection" className="inline-flex h-12 items-center justify-center bg-[var(--frnk-brown)] px-6 text-sm font-medium text-white transition hover:bg-white hover:text-black">
              Shop the drop
            </Link>
            <Link href="/lookbook" className="inline-flex h-12 items-center justify-center border border-white/15 px-6 text-sm font-medium text-white transition hover:bg-white hover:text-black">
              View lookbook
            </Link>
          </div>
        </div>

        <div className="relative min-h-[60vh] overflow-hidden border border-white/10 bg-[var(--frnk-coffee)] lg:col-span-5 lg:col-start-7 lg:my-8">
          <Image src="/images/frnkplus-brown-puffer.jpg" alt="FRNK+ Drop 01 brown streetwear campaign" fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-transparent" />
          <p className="absolute bottom-5 left-5 max-w-60 text-2xl font-medium leading-none">Built for quiet confidence and everyday movement.</p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b0704] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1680px] gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase text-[var(--frnk-tan)]">System notes</p>
            <h2 className="mt-5 text-5xl font-semibold leading-[0.86] sm:text-7xl">No loud signal.</h2>
          </div>
          <div className="grid gap-4 text-lg leading-8 text-white/62 lg:col-span-6 lg:col-start-7">
            <p>Black carries the structure. Brown gives warmth without softness. White appears only where the eye needs air.</p>
            <p>Drop 01 is designed as a uniform: puffer, overshirt, long coat, hoodie. Pieces that can stand alone or layer together.</p>
          </div>
        </div>
      </section>

      <DropCountdown />

      <section className="mx-auto grid max-w-[1680px] gap-4 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-10">
        {featured.map((product) => (
          <Link key={product.id} href={`/collection/${product.slug}`} className="group border border-white/10 bg-[var(--frnk-coffee)]">
            <div className="relative aspect-[0.78] overflow-hidden">
              <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
            </div>
            <div className="flex items-start justify-between gap-4 p-4">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="mt-1 text-sm text-white/46">{product.color}</p>
              </div>
              <p className="text-sm">${product.price}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
