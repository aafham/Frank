import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductBySlug } from "@/lib/frnk-data";

export const metadata = {
  title: "Exclusive | FRNK+",
  description: "FRNK+ official exclusive streetwear cap. A limited accessory for quiet movement.",
};

export default function ExclusivePage() {
  const product = getProductBySlug("exclusive-streetwear-cap");

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--frnk-black)] text-white">
      <nav className="mx-auto flex h-18 max-w-[1680px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="text-2xl font-semibold tracking-[0.2em]" aria-label="FRNK+ home">
          FRNK<span className="text-[var(--frnk-tan)]">+</span>
        </Link>
        <div className="flex items-center gap-5 text-xs uppercase text-white/58">
          <Link href="/collection" className="hover:text-white">Collection</Link>
          <Link href={`/collection/${product.slug}`} className="hidden hover:text-white sm:inline">Product</Link>
        </div>
      </nav>

      <section className="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden">
        <Image src={product.image} alt={product.name} fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050403_0%,rgba(5,4,3,0.72)_38%,rgba(5,4,3,0.18)_100%),linear-gradient(180deg,rgba(5,4,3,0.18)_0%,#050403_100%)]" />
        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-[1680px] content-between gap-10 px-5 py-8 sm:px-8 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--frnk-tan)]">Official exclusive / Core black</p>
            <h1 className="mt-8 text-[clamp(4.8rem,14vw,15rem)] font-semibold leading-[0.72] tracking-[0.04em]">
              EX<br />CLU<br />SIVE
            </h1>
          </div>

          <div className="self-end border-t border-white/14 pt-6 lg:col-span-5 lg:col-start-8">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/46">Drop accessory 001</p>
            <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[0.92] sm:text-6xl">{product.name}</h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/62">{product.note}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
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

      <section className="border-y border-white/10 bg-[#0b0704] px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1680px] gap-8 lg:grid-cols-12">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--frnk-tan)] lg:col-span-3">The details</p>
          <div className="grid gap-5 text-3xl font-semibold leading-[0.96] sm:text-5xl lg:col-span-5">
            <p>Minimal design.</p>
            <p>Maximum impact.</p>
            <p>Made for everyday movement.</p>
          </div>
          <div className="grid gap-4 text-base leading-7 text-white/58 lg:col-span-3 lg:col-start-10">
            {product.details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
            <p>{product.fit}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
