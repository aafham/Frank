import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { sizeRows } from "@/lib/frnk-data";

export const metadata = {
  title: "Size Guide | FRNK+",
  description: "FRNK+ oversized streetwear size guide.",
};

export default function SizeGuidePage() {
  return (
    <main className="bg-[var(--frnk-black)] px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
      <nav className="mx-auto flex max-w-[1680px] items-center justify-between">
        <Link href="/" className="inline-flex" aria-label="FRNK+ home">
          <BrandLogo />
        </Link>
        <Link href="/collection" className="text-xs uppercase text-white/58 hover:text-white">
          Collection
        </Link>
      </nav>

      <section className="mx-auto mt-12 grid max-w-[1680px] gap-10 pb-6 sm:mt-16 lg:mt-20 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs uppercase text-[var(--frnk-tan)]">Size guide</p>
          <h1 className="mt-5 text-6xl font-semibold leading-[0.84] sm:text-8xl">Oversized, but controlled.</h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-white/58">FRNK+ pieces are designed with relaxed streetwear proportions. Choose true size for the intended look.</p>
        </div>

        <div className="overflow-hidden border border-white/12">
          <div className="grid grid-cols-4 bg-white/8 p-4 text-xs uppercase text-white/48">
            <span>Size</span>
            <span>Chest</span>
            <span>Waist</span>
            <span>Height</span>
          </div>
          {sizeRows.map(([size, chest, waist, height]) => (
            <div key={size} className="grid grid-cols-4 border-t border-white/12 p-4 text-sm">
              <span>{size}</span>
              <span>{chest} in</span>
              <span>{waist} in</span>
              <span>{height} cm</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
