"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { subscribeToNewsletter } from "@/app/actions";
import { BrandLogo } from "@/components/brand-logo";
import { DropCountdown } from "@/components/drop-countdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { journal, lookbookFrames, products, type Product } from "@/lib/frnk-data";
import { cn } from "@/lib/utils";

type View = "home" | "collection" | "lookbook" | "journal" | "access";

const navItems = [
  ["Home", "/"],
  ["Exclusive", "/exclusive"],
  ["Collection", "/collection"],
  ["Lookbook", "/lookbook"],
  ["Journal", "/journal"],
  ["Drop 01", "/drop-01"],
  ["Story", "/story"],
  ["Size", "/size-guide"],
  ["Access", "/access"],
] as const;

const desktopNavItems = [
  ["Shop", "/collection"],
  ["Lookbook", "/lookbook"],
  ["Journal", "/journal"],
  ["Access", "/access"],
] as const;

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function FrnkStorefront({ view = "home" }: { view?: View }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({ "overshirt-02": 1 });
  const reduceMotion = useReducedMotion();

  const cartItems = useMemo(
    () => products.filter((product) => cart[product.id]).map((product) => ({ ...product, qty: cart[product.id] })),
    [cart],
  );
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const addToCart = (id: string) => {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
    setCartOpen(true);
  };

  return (
    <main className="min-h-screen bg-[var(--frnk-black)] text-[var(--frnk-white)]">
      <Header
        scrolled={scrolled}
        cartCount={cartItems.length}
        onSearch={() => setSearchOpen(true)}
        onCart={() => setCartOpen(true)}
        onMenu={() => setMenuOpen(true)}
      />

      {view === "home" && <HomeView reduceMotion={reduceMotion} />}
      {view === "collection" && <CollectionView wishlist={wishlist} onWishlist={toggleWishlist} onAdd={addToCart} onQuickView={setQuickView} reduceMotion={reduceMotion} />}
      {view === "lookbook" && <LookbookView onQuickView={setQuickView} reduceMotion={reduceMotion} />}
      {view === "journal" && <JournalView reduceMotion={reduceMotion} />}
      {view === "access" && <AccessView />}

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onQuickView={setQuickView} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} items={cartItems} total={cartTotal} setCart={setCart} />
      <QuickView product={quickView} onOpenChange={(open) => !open && setQuickView(null)} onAdd={addToCart} />
    </main>
  );
}

function Header({
  scrolled,
  cartCount,
  onSearch,
  onCart,
  onMenu,
}: {
  scrolled: boolean;
  cartCount: number;
  onSearch: () => void;
  onCart: () => void;
  onMenu: () => void;
}) {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled ? "border-b border-white/10 bg-[var(--frnk-black)]/90 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav className="mx-auto grid h-18 max-w-[1680px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-10">
        <Link href="/" className="inline-flex items-center" aria-label="FRNK+ home">
          <BrandLogo />
        </Link>
        <div className="hidden items-center gap-8 text-[11px] uppercase text-white/58 lg:flex">
          {desktopNavItems.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-white">
              {label}
            </Link>
          ))}
        </div>
        <div className="flex justify-end gap-1">
          <IconButton label="Search" onClick={onSearch}>
            <Search />
          </IconButton>
          <IconButton className="hidden sm:inline-flex" label="Wishlist">
            <Heart />
          </IconButton>
          <IconButton className="hidden sm:inline-flex" label="Account">
            <UserRound />
          </IconButton>
          <IconButton label={`Cart, ${cartCount} items`} onClick={onCart}>
            <ShoppingBag />
          </IconButton>
          <IconButton className="lg:hidden" label="Open menu" onClick={onMenu}>
            <Menu />
          </IconButton>
        </div>
      </nav>
    </header>
  );
}

function HomeView({ reduceMotion }: { reduceMotion: boolean | null }) {
  const exclusiveProduct = products[0];
  const featuredProducts = products.slice(1, 4);

  return (
    <section className="bg-[var(--frnk-black)] pt-18">
      <div className="border-y border-white/10 bg-[var(--frnk-blue)] px-5 py-2 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-[#fffdf9] sm:px-8">
        Studio 01 / everyday pieces, brighter ideas
      </div>

      <section className="mx-auto grid max-w-[1680px] overflow-hidden border-b border-white/10 lg:grid-cols-[0.88fr_1.12fr]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative flex min-h-[30rem] flex-col justify-between bg-[var(--frnk-lime)] p-5 sm:min-h-[34rem] sm:p-8 lg:min-h-[calc(100svh-7.25rem)] lg:p-10"
        >
          <div className="flex items-start justify-between gap-6">
            <p className="max-w-48 text-[10px] font-medium uppercase leading-5 tracking-[0.18em] text-[#171310]/70">FRNK+ / Collection 01</p>
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#171310]/25 text-xs font-semibold">01</span>
          </div>
          <div className="relative z-10 max-w-xl">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-[#171310]/65">Good clothes. Odd energy.</p>
            <h1 className="text-[clamp(4.9rem,13vw,10.5rem)] font-semibold leading-[0.73] tracking-[0.01em] text-[#171310]">
              <span className="mb-3 block text-[0.42em] leading-none tracking-[0.06em]">FRNK+</span>
              PLAY<br />
              IT<br />
              COOL.
            </h1>
          </div>
          <div className="relative z-10 grid gap-5 border-t border-[#171310]/25 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
            <p className="max-w-sm text-lg leading-7 text-[#171310]/78">Everyday uniform, turned a little sideways.</p>
            <Link href="/collection" className="inline-flex h-12 items-center justify-center gap-2 bg-[#171310] px-6 text-sm font-medium text-[#fffdf9] transition hover:bg-[var(--frnk-blue)]">
              Shop Collection <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="absolute -bottom-14 -left-10 size-44 rounded-full border-[18px] border-[var(--frnk-orange)] sm:size-56" />
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative min-h-[32rem] overflow-hidden bg-[var(--frnk-pink)] sm:min-h-[42rem] lg:min-h-[calc(100svh-7.25rem)]"
        >
          <Image src="/images/frnkplus-play-hero.png" alt="FRNK+ Studio 01 model in playful streetwear campaign" fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" style={{ objectPosition: "68% center" }} />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-[linear-gradient(180deg,transparent_0%,rgba(23,19,16,0.44)_100%)] p-5 text-[#fffdf9] sm:p-8">
            <p className="max-w-48 text-[10px] uppercase leading-5 tracking-[0.18em]">Brown layers / blue room / no rules written down</p>
            <Link href="/lookbook" className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-[#fffdf9]/65 transition hover:bg-[#fffdf9] hover:text-[#171310]" aria-label="Open lookbook">
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="border-b border-white/10 px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <div className="mx-auto grid max-w-[1680px] gap-4 md:grid-cols-3">
          <div className="flex min-h-56 flex-col justify-between bg-[var(--frnk-blue)] p-5 text-[#fffdf9] sm:p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-[#fffdf9]/70">A / soft structure</p>
            <p className="max-w-56 text-4xl font-semibold leading-[0.9]">Brown is a colour now.</p>
          </div>
          <div className="flex min-h-56 flex-col justify-between bg-[var(--frnk-pink)] p-5 text-[#171310] sm:p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-[#171310]/58">B / everyday volume</p>
            <p className="max-w-56 text-4xl font-semibold leading-[0.9]">Wear the loud part quietly.</p>
          </div>
          <div className="flex min-h-56 flex-col justify-between bg-[var(--frnk-orange)] p-5 text-[#171310] sm:p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-[#171310]/60">C / clean chaos</p>
            <Link href="/drop-01" className="inline-flex items-center gap-2 text-4xl font-semibold leading-[0.9] underline decoration-2 underline-offset-8">Enter Drop 01 <ArrowRight className="size-7" /></Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-[1680px] gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--frnk-tan)]">The studio edit</p>
            <h2 className="mt-5 max-w-xl text-[clamp(3.6rem,8vw,7.8rem)] font-semibold leading-[0.8]">Less matching.<br />More movement.</h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-white/64">Black and brown still anchor the wardrobe. The surrounding world can be more surprising.</p>
            <Link href="/lookbook" className="mt-8 inline-flex h-12 items-center gap-2 border border-white/20 px-6 text-sm font-medium transition hover:bg-[var(--frnk-blue)] hover:text-[#fffdf9]">View studio lookbook <ArrowRight className="size-4" /></Link>
          </div>
          <div className="relative overflow-hidden bg-[var(--frnk-pink)] lg:col-span-7 lg:-rotate-1">
            <Image src="/images/frnkplus-play-lookbook.png" alt="FRNK+ playful studio lookbook model" width={1024} height={1536} sizes="(min-width: 1024px) 56vw, 100vw" className="h-auto w-full" />
            <span className="absolute bottom-5 right-5 grid size-22 place-items-center rounded-full bg-[var(--frnk-lime)] text-center text-xs font-semibold uppercase leading-4 text-[#171310] sm:bottom-8 sm:right-8 sm:size-28">Made<br />for<br />outside</span>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[var(--frnk-coffee)] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto flex max-w-[1680px] flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--frnk-tan)]">Wear it your way</p>
            <h2 className="mt-4 text-[clamp(3.4rem,7vw,6.6rem)] font-semibold leading-[0.82]">The daily lineup.</h2>
          </div>
          <Link href="/collection" className="inline-flex h-11 items-center gap-2 border-b border-white/35 text-sm font-medium hover:text-[var(--frnk-blue)]">All pieces <ArrowRight className="size-4" /></Link>
        </div>
        <div className="mx-auto mt-10 grid max-w-[1680px] gap-4 md:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <article key={product.id} className={cn("group overflow-hidden border border-white/12 bg-[var(--frnk-black)]", index === 1 && "md:translate-y-10")}>
              <Link href={`/collection/${product.slug}`} className="block w-full text-left">
                <div className="relative aspect-[0.88] overflow-hidden bg-[var(--frnk-pink)]">
                  <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                  <span className="absolute left-4 top-4 bg-[var(--frnk-lime)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#171310]">0{index + 2}</span>
                </div>
                <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="mt-1 text-sm text-white/52">{product.color}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(product.price)}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto grid max-w-[1680px] overflow-hidden border border-white/10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[30rem] bg-[var(--frnk-orange)]">
            <Image src="/images/frnkplus-play-duo.png" alt="FRNK+ Studio 01 duo campaign" fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-between bg-[var(--frnk-blue)] p-6 text-[#fffdf9] sm:p-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#fffdf9]/65">Official exclusive</p>
              <h2 className="mt-6 text-[clamp(3.4rem,7vw,6.5rem)] font-semibold leading-[0.8]">The cap<br />has friends.</h2>
            </div>
            <div className="mt-10 border-t border-[#fffdf9]/30 pt-5">
              <p className="max-w-sm text-lg leading-7 text-[#fffdf9]/78">The original FRNK+ cap stays exclusive. The rest of the uniform is open to interpretation.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/exclusive" className="inline-flex h-12 items-center justify-center bg-[#fffdf9] px-6 text-sm font-medium text-[#171310] transition hover:bg-[var(--frnk-lime)]">View Exclusive</Link>
                <Link href={`/collection/${exclusiveProduct.slug}`} className="inline-flex h-12 items-center justify-center border border-[#fffdf9]/45 px-6 text-sm font-medium text-[#fffdf9] transition hover:bg-[#fffdf9] hover:text-[#171310]">Product details</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hidden lg:block"><DropCountdown /></div>
    </section>
  );
}

function CollectionView({
  wishlist,
  onWishlist,
  onAdd,
  onQuickView,
  reduceMotion,
}: {
  wishlist: string[];
  onWishlist: (id: string) => void;
  onAdd: (id: string) => void;
  onQuickView: (product: Product) => void;
  reduceMotion: boolean | null;
}) {
  const [featuredProduct, ...standardProducts] = products;

  return (
    <section className="min-h-screen bg-[var(--frnk-black)] px-5 pb-12 pt-28 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1680px]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase text-[var(--frnk-tan)]">Collection</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.88] sm:text-7xl">Streetwear, edited down.</h1>
          </div>
          <p className="max-w-lg text-lg leading-8 text-white/58 lg:col-span-4 lg:col-start-9">
            Dark essentials, relaxed proportions, and smart finishing. Minimal, but not plain.
          </p>
        </div>

        <motion.article
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mt-10 grid overflow-hidden border border-white/10 bg-[#f0ebe5] md:grid-cols-[1.05fr_0.95fr] lg:mt-12"
        >
          <button type="button" onClick={() => onQuickView(featuredProduct)} className="relative block min-h-[58vh] overflow-hidden text-left md:min-h-[520px]">
            <Image src="/images/frnkplus-exclusive-model-campaign.webp" alt={featuredProduct.name} fill loading="eager" sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" style={{ objectPosition: "center 18%" }} />
            <div className="absolute inset-0 bg-linear-to-t from-black/72 via-transparent to-transparent" />
            <span className="absolute left-4 top-4 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-black">Exclusive</span>
          </button>
          <div className="grid content-between gap-8 p-5 sm:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--frnk-tan)]">Official FRNK+ / Drop accessory 001</p>
              <h2 className="mt-5 text-[clamp(3rem,12vw,5.5rem)] font-semibold leading-[0.86]">{featuredProduct.name}</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">{featuredProduct.note}</p>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between border-y border-white/10 py-4">
                <span className="text-sm text-white/54">{featuredProduct.color} / {featuredProduct.sizes.join(" ")}</span>
                <span>{formatPrice(featuredProduct.price)}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Button className="h-11 rounded-none bg-[var(--frnk-brown)] text-white hover:bg-white hover:text-black" onClick={() => onAdd(featuredProduct.id)}>
                  Add exclusive
                </Button>
                <Link href={`/collection/${featuredProduct.slug}`} className="inline-flex h-11 items-center border border-white/15 px-4 text-sm text-white transition hover:bg-white hover:text-black">
                  Details
                </Link>
              </div>
            </div>
          </div>
        </motion.article>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {standardProducts.map((product, index) => (
            <motion.article
              key={product.id}
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
              className="group border border-white/10 bg-[var(--frnk-coffee)]"
            >
              <button type="button" onClick={() => onQuickView(product)} className="relative block aspect-[0.78] w-full overflow-hidden text-left">
                <Image src={product.image} alt={product.name} fill sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                <span className="absolute left-4 top-4 bg-black/72 px-3 py-1 text-[11px] uppercase text-white backdrop-blur">{product.category}</span>
                <span className="absolute right-4 top-4 bg-white/90 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-black">
                  {Object.values(product.stock).reduce((sum, count) => sum + count, 0)} left
                </span>
              </button>
              <div className="grid gap-4 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-medium">{product.name}</h2>
                    <p className="mt-1 text-sm text-white/48">{product.color} / {product.sizes.join(" ")}</p>
                  </div>
                  <p className="text-sm">{formatPrice(product.price)}</p>
                </div>
                <div className="flex gap-2">
                  <Button className="h-10 flex-1 rounded-none bg-[var(--frnk-brown)] text-white hover:bg-white hover:text-black" onClick={() => onAdd(product.id)}>
                    Add
                  </Button>
                  <Link href={`/collection/${product.slug}`} className="inline-flex h-10 items-center border border-white/15 px-3 text-sm text-white transition hover:bg-white hover:text-black">
                    Details
                  </Link>
                  <Button variant="outline" size="icon-lg" aria-label={`Wishlist ${product.name}`} className="rounded-none border-white/15 bg-transparent text-white hover:bg-white hover:text-black" onClick={() => onWishlist(product.id)}>
                    <Heart className={cn(wishlist.includes(product.id) && "fill-white")} />
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LookbookView({ onQuickView, reduceMotion }: { onQuickView: (product: Product) => void; reduceMotion: boolean | null }) {
  return (
    <section className="min-h-screen overflow-hidden bg-[var(--frnk-coffee)] px-5 pb-14 pt-28 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1680px]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="text-xs uppercase text-[var(--frnk-tan)]">Lookbook / Drop 01</p>
            <h1 className="mt-5 text-6xl font-semibold leading-[0.82] sm:text-8xl">Model, mood, movement.</h1>
          </div>
          <p className="max-w-lg text-lg leading-8 text-white/58 lg:col-span-4 lg:col-start-9">
            A campaign layout for black layers, coffee tones, concrete light, and controlled street posture.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-6 lg:grid-cols-12">
          {lookbookFrames.map((frame, index) => (
            <motion.button
              key={frame.title}
              type="button"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.05, ease: "easeOut" }}
              onClick={() => onQuickView(products[index % products.length])}
              className={cn(
                "group relative overflow-hidden bg-black text-left",
                index === 0 && "md:col-span-4 lg:col-span-5 lg:row-span-2",
                index === 1 && "md:col-span-2 lg:col-span-3 lg:mt-24",
                index === 2 && "md:col-span-3 lg:col-span-4",
                index === 3 && "md:col-span-3 lg:col-span-3 lg:-mt-16",
                index === 4 && "md:col-span-2 lg:col-span-4",
                index === 5 && "md:col-span-4 lg:col-span-5 lg:-mt-20",
              )}
            >
              <div className={cn("relative", index === 0 ? "h-[72vh]" : index === 5 ? "h-[56vh]" : "h-[40vh]")}>
                <Image src={frame.image} alt={frame.title} fill sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
                <div className="absolute inset-0 bg-linear-to-t from-black/72 via-black/5 to-transparent" />
                <div className="absolute bottom-4 left-4 max-w-64">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-white/42">Frame 0{index + 1}</p>
                  <p className="text-2xl font-medium leading-none">{frame.title}</p>
                  <p className="mt-2 text-sm text-white/54">{frame.text}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-8">
          <p className="max-w-sm text-sm uppercase leading-6 tracking-[0.16em] text-white/42">Every frame links back to a product. The shopping layer stays quiet.</p>
          <Link href="/drop-01" className="inline-flex h-11 items-center gap-2 bg-white px-5 text-sm font-medium text-black transition hover:bg-[var(--frnk-tan)]">
            View Drop 01 <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function JournalView({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <section className="min-h-screen bg-[var(--frnk-black)] px-5 pb-12 pt-28 text-white sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1680px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs uppercase text-[var(--frnk-tan)]">Journal</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.88] sm:text-7xl">Minimal does not mean soft.</h1>
        </div>
        <div className="grid gap-5">
          {journal.map(([title, text], index) => (
            <motion.article
              key={title}
              initial={reduceMotion ? false : { opacity: 0, x: index % 2 ? 28 : -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
              className={cn("border-t border-white/12 py-8", index === 1 && "lg:ml-24", index === 2 && "lg:-ml-8")}
            >
              <p className="text-xs uppercase text-white/34">0{index + 1}</p>
              <h2 className="mt-4 text-4xl font-semibold leading-none sm:text-6xl">{title}</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/58">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AccessView() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--frnk-black)] px-5 pb-10 pt-28 text-white sm:px-8 lg:px-10">
      <Image src="/images/frnkplus-brown-puffer.jpg" alt="FRNK+ access model wearing dark streetwear" fill sizes="100vw" className="object-cover opacity-28" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#f8f6f2_0%,rgba(248,246,242,0.82)_48%,rgba(185,135,102,0.42)_100%)]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-9.5rem)] max-w-[1680px] gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="text-xs uppercase text-[var(--frnk-tan)]">Private access</p>
          <h1 className="mt-6 text-6xl font-semibold leading-[0.82] sm:text-8xl lg:text-[8.5rem]">Less noise. More identity.</h1>
        </div>
        <form className="grid gap-4 border border-white/14 bg-black/42 p-5 backdrop-blur lg:col-span-4 lg:col-start-9" action={subscribeToNewsletter}>
          <p className="text-lg leading-8 text-white/66">Receive collection notes, early access, and studio letters.</p>
          <div className="flex gap-2">
            <Input name="email" aria-label="Email address" type="email" placeholder="Email address" className="h-12 rounded-none border-white/20 bg-black/40 px-4 text-white placeholder:text-white/42" />
            <Button className="h-12 rounded-none bg-[var(--frnk-brown)] px-6 text-white hover:bg-white hover:text-black">Join</Button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-white/58">
            <Link href="/story" className="underline underline-offset-8 hover:text-white">Brand story</Link>
            <Link href="/size-guide" className="underline underline-offset-8 hover:text-white">Size guide</Link>
            <Link href="/faq" className="underline underline-offset-8 hover:text-white">FAQ</Link>
            <Link href="/checkout" className="underline underline-offset-8 hover:text-white">Checkout</Link>
          </div>
        </form>
      </div>
    </section>
  );
}

function IconButton({
  label,
  children,
  className,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button type="button" variant="ghost" size="icon-lg" className={cn("rounded-none text-white hover:bg-white/10 hover:text-white", className)} onClick={onClick} />}>
        {children}
        <span className="sr-only">{label}</span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function MobileMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] overflow-y-auto bg-[var(--frnk-black)] text-white"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <Image src="/images/frnkplus-exclusive-streetwear-cap.webp" alt="" fill sizes="100vw" className="object-cover object-center opacity-[0.18]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,246,242,0.86)_0%,rgba(248,246,242,0.96)_58%,#f8f6f2_100%)]" />
          <div className="absolute left-5 top-28 text-[20vw] font-semibold leading-[0.72] tracking-[0.08em] text-white/[0.05]">
            FR<br />NK
          </div>
          <div className="relative z-10 flex min-h-full flex-col px-5 py-5">
            <div className="flex items-start justify-between">
              <div>
                <BrandLogo size="menu" />
                <p className="mt-2 max-w-40 text-[10px] uppercase leading-4 tracking-[0.2em] text-[var(--frnk-tan)]">Exclusive streetwear system</p>
              </div>
              <Button variant="ghost" size="icon-lg" className="rounded-none text-white hover:bg-white/10 hover:text-white" onClick={() => onOpenChange(false)}>
                <X />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <motion.div
              className="mt-6 grid pb-4"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.035, delayChildren: 0.08 } },
                closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
              }}
            >
              {navItems.map(([label, href], index) => (
                <motion.div
                  key={href}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -24 },
                  }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <Link href={href} onClick={() => onOpenChange(false)} className="group grid grid-cols-[2rem_1fr] items-end border-b border-white/10 py-2">
                    <span className="pb-1 text-[9px] uppercase tracking-[0.22em] text-white/30">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-[clamp(1.72rem,7.8vw,2.85rem)] font-semibold leading-[0.9] text-white transition group-hover:text-[var(--frnk-tan)]">{label}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <Link href="/exclusive" onClick={() => onOpenChange(false)} className="mt-auto grid gap-2 border border-white/12 bg-white/8 p-3.5 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--frnk-tan)]">Official exclusive</span>
              <span className="text-lg font-semibold leading-none">Streetwear Cap</span>
              <span className="text-xs leading-5 text-white/52">Limited accessory. Move silent.</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SearchDialog({
  open,
  onOpenChange,
  onQuickView,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuickView: (product: Product) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-none border-white/10 bg-[var(--frnk-black)] p-6 text-white sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl">Search FRNK+</DialogTitle>
          <DialogDescription className="text-white/54">Popular searches: overshirt, trouser, knit, everyday coat.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/45" />
          <Input autoFocus placeholder="Search products and editorials" className="h-12 rounded-none border-white/15 bg-white/8 pl-11 text-white placeholder:text-white/36" />
        </div>
        <div className="grid gap-3">
          {products.slice(0, 3).map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => {
                onOpenChange(false);
                onQuickView(product);
              }}
              className="grid grid-cols-[64px_1fr_auto] items-center gap-4 p-2 text-left transition hover:bg-white/8"
            >
              <span className="relative block aspect-square overflow-hidden bg-[var(--frnk-coffee)]">
                <Image src={product.image} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <span>
                <span className="block font-medium">{product.name}</span>
                <span className="text-sm text-white/48">{product.category}</span>
              </span>
              <span className="text-sm font-medium">{formatPrice(product.price)}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function QuickView({
  product,
  onOpenChange,
  onAdd,
}: {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  onAdd: (id: string) => void;
}) {
  return (
    <Dialog open={Boolean(product)} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[calc(100svh-2rem)] overflow-hidden rounded-none border-white/10 bg-[var(--frnk-black)] p-0 text-white"
        style={{ width: "min(1180px, calc(100vw - 2rem))", maxWidth: "none" }}
      >
        {product && (
          <div className="grid max-h-[calc(100svh-2rem)] overflow-y-auto lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)] lg:overflow-hidden">
            <div className="relative min-h-[360px] bg-[var(--frnk-coffee)] sm:min-h-[520px] lg:min-h-0">
              <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover" />
            </div>
            <div className="flex min-h-0 flex-col p-6 sm:p-8 lg:max-h-[calc(100svh-2rem)] lg:overflow-y-auto">
              <DialogHeader className="pr-10">
                <DialogTitle className="text-[clamp(2rem,4vw,4.6rem)] leading-[0.92] tracking-[-0.01em]">{product.name}</DialogTitle>
                <DialogDescription className="text-base leading-7 text-white/58">{product.note}</DialogDescription>
              </DialogHeader>
              <div className="mt-8 grid gap-6">
                <div className="flex justify-between border-y border-white/10 py-4 text-sm">
                  <span>{product.color}</span>
                  <span>{formatPrice(product.price)}</span>
                </div>
                <div>
                  <p className="mb-3 text-sm text-white/52">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button key={size} variant="outline" className="h-11 min-w-12 rounded-none border-white/15 bg-transparent text-white hover:bg-white hover:text-black">
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button className="h-12 rounded-none bg-[var(--frnk-brown)] text-white hover:bg-white hover:text-black" onClick={() => onAdd(product.id)}>
                  Add To Cart
                </Button>
                <div className="grid gap-3 text-sm text-white/56">
                  <p>{product.fit}</p>
                  {product.details.map((detail) => (
                    <p key={detail}>{detail}</p>
                  ))}
                  <p>Fabric: premium cotton blend selected for structure and softness.</p>
                  <p>Care: cold wash, hang dry, low iron if needed.</p>
                  <p>Shipping: complimentary standard delivery over $150.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CartSheet({
  open,
  onOpenChange,
  items,
  total,
  setCart,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: Array<Product & { qty: number }>;
  total: number;
  setCart: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full border-white/10 bg-[var(--frnk-black)] text-white sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl">Bag</SheetTitle>
          <SheetDescription className="text-white/52">Selected FRNK+ pieces. Preview only for now.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="grid min-h-72 place-items-center border border-white/12 p-8 text-center">
              <div>
                <p className="text-3xl font-semibold">Your bag is quiet.</p>
                <p className="mt-3 text-sm leading-6 text-white/48">Add a piece from the collection to start a preview order.</p>
                <Link href="/collection" onClick={() => onOpenChange(false)} className="mt-6 inline-flex h-11 items-center justify-center bg-white px-5 text-sm font-medium text-black">
                  View collection
                </Link>
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-[86px_1fr] gap-4 border border-white/10 bg-white/8 p-3"
                >
                  <div className="relative aspect-[0.78] overflow-hidden bg-[var(--frnk-coffee)]">
                    <Image src={item.image} alt="" fill sizes="86px" className="object-cover" />
                  </div>
                  <div>
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/38">{item.color} / Size M</p>
                      </div>
                      <button type="button" aria-label={`Remove ${item.name}`} onClick={() => setCart((current) => ({ ...current, [item.id]: 0 }))}>
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-white/64">{formatPrice(item.price)}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <Button variant="outline" size="icon-sm" aria-label="Decrease quantity" className="border-white/15 bg-transparent text-white hover:bg-white hover:text-black" onClick={() => setCart((current) => ({ ...current, [item.id]: Math.max(0, item.qty - 1) }))}>
                        <Minus />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <Button variant="outline" size="icon-sm" aria-label="Increase quantity" className="border-white/15 bg-transparent text-white hover:bg-white hover:text-black" onClick={() => setCart((current) => ({ ...current, [item.id]: item.qty + 1 }))}>
                        <Plus />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
        <SheetFooter>
          <div className="grid gap-3 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-white/58">Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/58">Delivery</span>
              <span>{total >= 150 ? "Included" : "Preview"}</span>
            </div>
          </div>
          <Button className="h-12 rounded-none bg-[var(--frnk-brown)] text-white hover:bg-white hover:text-black" disabled={items.length === 0}>
            <Link href="/checkout" onClick={() => onOpenChange(false)}>Checkout preview</Link>
          </Button>
          <Link href="/collection" onClick={() => onOpenChange(false)} className="text-center text-sm text-white/54 underline underline-offset-8 hover:text-white">
            Continue shopping
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
