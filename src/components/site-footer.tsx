import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

const footerLinks = [
  ["Collection", "/collection"],
  ["Drop 01", "/drop-01"],
  ["Lookbook", "/lookbook"],
  ["FAQ", "/faq"],
  ["Shipping", "/shipping"],
  ["Returns", "/returns"],
] as const;

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[var(--frnk-black)] px-5 py-12 text-white sm:px-8 lg:px-10">
      <div className="absolute inset-x-0 top-0 flex h-2">
        <span className="flex-1 bg-[var(--frnk-blue)]" />
        <span className="flex-1 bg-[var(--frnk-lime)]" />
        <span className="flex-1 bg-[var(--frnk-orange)]" />
        <span className="flex-1 bg-[var(--frnk-pink)]" />
      </div>
      <div className="mx-auto grid max-w-[1680px] gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Link href="/" className="inline-flex" aria-label="FRNK+ home">
            <BrandLogo size="footer" />
          </Link>
          <p className="mt-6 max-w-md text-lg leading-8 text-white/58">
            Premium minimal streetwear in black, dark brown, and controlled white.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-3 text-sm text-white/58 sm:grid-cols-3 lg:col-span-4 lg:col-start-8" aria-label="Footer navigation">
          {footerLinks.map(([label, href]) => (
            <Link key={href} href={href} className="underline-offset-8 hover:text-white hover:underline">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1680px] flex-wrap justify-between gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.16em] text-white/34">
        <p>FRNK+ / Malaysia</p>
        <p>Preview store / Payment paused</p>
      </div>
    </footer>
  );
}
