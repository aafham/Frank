import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

export const metadata = {
  title: "Shipping | FRNK+",
  description: "FRNK+ shipping policy preview.",
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[var(--frnk-black)] px-5 py-10 text-white sm:px-8 lg:px-10">
      <nav className="mx-auto flex max-w-[1680px] items-center justify-between">
        <Link href="/" className="inline-flex" aria-label="FRNK+ home">
          <BrandLogo />
        </Link>
        <Link href="/faq" className="text-xs uppercase text-white/58 hover:text-white">
          FAQ
        </Link>
      </nav>

      <section className="mx-auto mt-20 max-w-4xl">
        <p className="text-xs uppercase text-[var(--frnk-tan)]">Policy preview</p>
        <h1 className="mt-5 text-6xl font-semibold leading-[0.84] sm:text-8xl">Shipping</h1>
        <div className="mt-10 grid gap-6 text-lg leading-8 text-white/62">
          <p>Standard delivery is shown as a preview while FRNK+ is being prepared for real orders.</p>
          <p>When payment goes live, shipping rates, delivery windows, and tracking details should be connected to the checkout flow.</p>
          <p>Recommended launch rule: complimentary standard delivery over $150.</p>
        </div>
      </section>
    </main>
  );
}
