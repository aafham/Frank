import Image from "next/image";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { products } from "@/lib/frnk-data";

export const metadata = {
  title: "Checkout | FRNK+",
  description: "FRNK+ checkout prototype.",
};

export default function CheckoutPage() {
  const checkoutItems = products.slice(0, 2);
  const subtotal = checkoutItems.reduce((sum, product) => sum + product.price, 0);

  return (
    <main className="bg-[var(--frnk-black)] px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
      <nav className="mx-auto flex max-w-[1680px] items-center justify-between">
        <Link href="/" className="inline-flex" aria-label="FRNK+ home">
          <BrandLogo />
        </Link>
        <Link href="/collection" className="text-xs uppercase text-white/58 hover:text-white">
          Continue shopping
        </Link>
      </nav>

      <section className="mx-auto mt-12 grid max-w-[1680px] gap-8 pb-6 sm:mt-16 lg:grid-cols-[1fr_0.72fr]">
        <form className="grid gap-5 border border-white/12 bg-white/[0.03] p-5 lg:p-8">
          <div>
            <p className="text-xs uppercase text-[var(--frnk-tan)]">Secure checkout</p>
            <h1 className="mt-4 text-5xl font-semibold leading-none">Delivery details</h1>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="h-12 bg-black/40 px-4 outline-none ring-1 ring-white/12 focus:ring-[var(--frnk-tan)]" placeholder="First name" />
            <input className="h-12 bg-black/40 px-4 outline-none ring-1 ring-white/12 focus:ring-[var(--frnk-tan)]" placeholder="Last name" />
            <input className="h-12 bg-black/40 px-4 outline-none ring-1 ring-white/12 focus:ring-[var(--frnk-tan)] sm:col-span-2" placeholder="Email address" />
            <input className="h-12 bg-black/40 px-4 outline-none ring-1 ring-white/12 focus:ring-[var(--frnk-tan)] sm:col-span-2" placeholder="Address" />
            <input className="h-12 bg-black/40 px-4 outline-none ring-1 ring-white/12 focus:ring-[var(--frnk-tan)]" placeholder="City" />
            <input className="h-12 bg-black/40 px-4 outline-none ring-1 ring-white/12 focus:ring-[var(--frnk-tan)]" placeholder="Postcode" />
          </div>
          <button type="button" className="h-12 bg-[var(--frnk-brown)] text-sm font-medium transition hover:bg-white hover:text-black">
            Save order preview
          </button>
          <p className="text-sm text-white/42">Checkout preview only. Real payment and database are intentionally skipped for now.</p>
        </form>

        <aside className="border border-white/12 bg-[var(--frnk-coffee)] p-5 lg:p-8">
          <h2 className="text-3xl font-semibold">Order summary</h2>
          <div className="mt-6 grid gap-4">
            {checkoutItems.map((product) => (
              <div key={product.id} className="grid grid-cols-[76px_1fr_auto] gap-4">
                <div className="relative aspect-[0.78] overflow-hidden bg-black">
                  <Image src={product.image} alt={product.name} fill sizes="76px" className="object-cover" />
                </div>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="mt-1 text-sm text-white/46">{product.color}</p>
                </div>
                <p className="text-sm">${product.price}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between border-t border-white/12 pt-5">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
        </aside>
      </section>
    </main>
  );
}
