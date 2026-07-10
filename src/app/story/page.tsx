import Image from "next/image";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

export const metadata = {
  title: "Brand Story | FRNK+",
  description: "The story behind FRNK+ minimal streetwear.",
};

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-[var(--frnk-black)] text-white">
      <nav className="mx-auto flex h-18 max-w-[1680px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="inline-flex" aria-label="FRNK+ home">
          <BrandLogo />
        </Link>
        <Link href="/collection" className="text-xs uppercase text-white/58 hover:text-white">
          Shop
        </Link>
      </nav>

      <section className="mx-auto grid max-w-[1680px] gap-8 px-5 pb-12 sm:px-8 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-12 lg:px-10">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--frnk-coffee)] sm:aspect-[5/4] lg:col-span-5 lg:my-10 lg:aspect-auto lg:min-h-[52vh]">
          <Image src="/images/frnkplus-denim-wall.jpg" alt="FRNK+ streetwear model against a clean wall" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
        </div>
        <div className="grid content-center gap-8 lg:col-span-6 lg:col-start-7">
          <p className="text-xs uppercase text-[var(--frnk-tan)]">Brand story</p>
          <h1 className="text-6xl font-semibold leading-[0.84] sm:text-8xl">The missing letter. The added edge.</h1>
          <div className="grid max-w-2xl gap-5 text-lg leading-8 text-white/62">
            <p>FRNK+ started with subtraction. Remove the expected letter. Keep the confidence.</p>
            <p>The plus is the edge: better fit, stronger fabric, darker palette, smarter street posture.</p>
            <p>Built for everyday movement, but styled with intention.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
