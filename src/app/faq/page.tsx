import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

const faqs = [
  ["Is FRNK+ a real checkout right now?", "Not yet. The current checkout is a visual preview while payment and database work are intentionally paused."],
  ["How does FRNK+ fit?", "Most pieces are relaxed or oversized. Choose true size for the intended look, or size down for a cleaner profile."],
  ["What is the palette?", "Black, dark brown, and controlled white. The palette is designed to feel quiet, premium, and easy to layer."],
  ["When will new drops release?", "Drop notes and early access will be announced through the Access page."],
];

export const metadata = {
  title: "FAQ | FRNK+",
  description: "Common questions about FRNK+ sizing, drops, checkout preview, and brand direction.",
};

export default function FaqPage() {
  return (
    <main className="bg-[var(--frnk-black)] px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
      <nav className="mx-auto flex max-w-[1680px] items-center justify-between">
        <Link href="/" className="inline-flex" aria-label="FRNK+ home">
          <BrandLogo />
        </Link>
        <Link href="/collection" className="text-xs uppercase text-white/58 hover:text-white">
          Shop
        </Link>
      </nav>

      <section className="mx-auto mt-12 grid max-w-[1680px] gap-10 pb-6 sm:mt-16 lg:mt-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-xs uppercase text-[var(--frnk-tan)]">FAQ</p>
          <h1 className="mt-5 text-6xl font-semibold leading-[0.84] sm:text-8xl">Clear answers. Quietly.</h1>
        </div>
        <div className="grid gap-6 lg:col-span-6 lg:col-start-7">
          {faqs.map(([question, answer]) => (
            <article key={question} className="border-t border-white/12 pt-6">
              <h2 className="text-2xl font-medium">{question}</h2>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-white/58">{answer}</p>
            </article>
          ))}
          <div className="flex flex-wrap gap-4 border-t border-white/12 pt-6 text-sm text-white/58">
            <Link href="/shipping" className="underline underline-offset-8 hover:text-white">Shipping</Link>
            <Link href="/returns" className="underline underline-offset-8 hover:text-white">Returns</Link>
            <Link href="/size-guide" className="underline underline-offset-8 hover:text-white">Size guide</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
