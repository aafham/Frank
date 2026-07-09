import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BrandLogo } from "@/components/brand-logo";
import { getProductBySlug } from "@/lib/frnk-data";

const campaignImage = "/images/frnkplus-exclusive-model-campaign.webp";

export const metadata = {
  title: "Exclusive | FRNK+",
  description: "FRNK+ official exclusive streetwear campaign. Limited pieces for quiet movement.",
};

export default function ExclusivePage() {
  const product = getProductBySlug("exclusive-streetwear-cap");

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--frnk-black)] text-white">
      <nav className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-5 sm:h-18 sm:px-8 lg:px-10">
        <Link href="/" className="inline-flex" aria-label="FRNK+ home">
          <BrandLogo />
        </Link>
        <div className="flex items-center gap-4 text-[11px] uppercase text-white/58 sm:gap-5 sm:text-xs">
          <Link href="/collection" className="hover:text-white">Collection</Link>
          <Link href={`/collection/${product.slug}`} className="hover:text-white">Product</Link>
        </div>
      </nav>

      <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden sm:min-h-[calc(100svh-4.5rem)]">
        <Image src={campaignImage} alt="FRNK+ official exclusive model wearing black cap and sweatshirt" fill priority sizes="100vw" className="object-cover" style={{ objectPosition: "center 28%" }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,3,0.38)_0%,rgba(5,4,3,0.12)_34%,#050403_100%),linear-gradient(90deg,#050403_0%,rgba(5,4,3,0.72)_38%,rgba(5,4,3,0.2)_100%)]" />
        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1680px] content-between gap-8 px-5 py-7 sm:min-h-[calc(100svh-4.5rem)] sm:px-8 sm:py-8 lg:grid-cols-12 lg:gap-10 lg:px-10">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--frnk-tan)]">Official exclusive / Core black</p>
            <h1 className="mt-8 text-[clamp(4.4rem,25vw,7.4rem)] font-semibold leading-[0.72] tracking-[0.04em] sm:text-[clamp(4.8rem,14vw,15rem)]">
              EX<br />CLU<br />SIVE
            </h1>
          </div>

          <div className="self-end border-t border-white/14 pt-6 lg:col-span-5 lg:col-start-8">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/46">Drop accessory 001</p>
            <h2 className="mt-4 max-w-xl text-[clamp(2.4rem,12vw,4rem)] font-semibold leading-[0.9] sm:text-6xl">{product.name}</h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/66 sm:text-lg sm:leading-8">{product.note}</p>
            <div className="mt-7 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap sm:items-center">
              <Link href={`/collection/${product.slug}`} className="inline-flex h-12 items-center justify-center bg-[var(--frnk-brown)] px-6 text-sm font-medium text-white transition hover:bg-white hover:text-black">
                View product
              </Link>
              <Link href="/collection" className="inline-flex h-12 items-center justify-center border border-white/15 px-6 text-sm font-medium text-white transition hover:bg-white hover:text-black">
                Full collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b0704] px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
        <div className="mx-auto grid max-w-[1680px] gap-8 lg:grid-cols-12">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--frnk-tan)] lg:col-span-3">The details</p>
          <div className="grid gap-4 text-[clamp(2.2rem,11vw,3.6rem)] font-semibold leading-[0.9] sm:gap-5 sm:text-5xl lg:col-span-5">
            <p>Minimal design.</p>
            <p>Maximum impact.</p>
            <p>Made for everyday movement.</p>
          </div>
          <div className="grid gap-3 border-t border-white/10 pt-6 text-base leading-7 text-white/58 lg:col-span-3 lg:col-start-10 lg:border-t-0 lg:pt-0">
            {product.details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
            <p>{product.fit}</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto grid max-w-[1680px] gap-5 lg:grid-cols-12">
          <div className="relative min-h-[62vh] overflow-hidden bg-[var(--frnk-coffee)] sm:min-h-[70vh] lg:col-span-7">
            <Image src={campaignImage} alt="FRNK+ exclusive black uniform campaign" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" style={{ objectPosition: "center 18%" }} />
          </div>
          <div className="grid content-between gap-8 border border-white/10 bg-[#090604] p-5 sm:gap-10 sm:p-8 lg:col-span-5">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--frnk-tan)]">Official FRNK+</p>
              <h2 className="mt-5 text-[clamp(3rem,14vw,5rem)] font-semibold leading-[0.86] sm:text-7xl">Black uniform. Quiet signal.</h2>
            </div>
            <div className="grid gap-6">
              <div className="relative aspect-[1.35] overflow-hidden bg-[var(--frnk-coffee)]">
                <Image src={product.image} alt={`${product.name} close-up`} fill sizes="(min-width: 1024px) 32vw, 100vw" className="object-cover" />
              </div>
              <p className="text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
                The cap leads the system. The sweatshirt completes the posture. FRNK+ keeps the mark direct, minimal, and unmistakable.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
