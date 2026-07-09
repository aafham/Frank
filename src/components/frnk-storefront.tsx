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
  ["Collection", "/collection"],
  ["Lookbook", "/lookbook"],
  ["Journal", "/journal"],
  ["Drop 01", "/drop-01"],
  ["Story", "/story"],
  ["Size", "/size-guide"],
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
        <Link href="/" className="text-2xl font-semibold tracking-[0.2em]" aria-label="FRNK+ home">
          FRNK<span className="text-[var(--frnk-tan)]">+</span>
        </Link>
        <div className="hidden items-center gap-8 text-[11px] uppercase text-white/58 lg:flex">
          {navItems.map(([label, href]) => (
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
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--frnk-black)] pt-18">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(83,54,34,0.52),transparent_34%),linear-gradient(120deg,#050403_0%,#120c08_48%,#050403_100%)]" />
      <div className="absolute bottom-0 left-0 h-[42vh] w-[42vh] border border-[var(--frnk-brown)]/30" />

      <div className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden lg:hidden">
        <Image
          src="/images/frnkplus-hero-black-coat.jpg"
          alt="FRNK+ model wearing a black coat and sunglasses"
          fill
          priority
          loading="eager"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,3,0.18)_0%,rgba(5,4,3,0.06)_34%,rgba(5,4,3,0.78)_78%,#050403_100%)]" />
        <div className="absolute inset-x-0 top-0 h-52 bg-[linear-gradient(180deg,#050403_0%,rgba(5,4,3,0.2)_100%)]" />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="relative z-10 flex min-h-[calc(100svh-4.5rem)] flex-col justify-between px-5 pb-6 pt-8"
        >
          <div>
            <p className="max-w-[18rem] text-[10px] uppercase leading-5 tracking-[0.16em] text-[var(--frnk-tan)]">
              Premium minimal streetwear / Dark brown system
            </p>
            <h1 className="mt-8 text-[28vw] font-semibold leading-[0.72] tracking-[0.08em] text-white drop-shadow-[0_12px_34px_rgba(0,0,0,0.45)]">
              FR<br />NK
            </h1>
          </div>

          <div className="grid gap-5">
            <div className="flex items-end justify-between gap-4 border-t border-white/16 pt-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/48">Drop 01</p>
                <p className="mt-2 max-w-56 text-2xl font-medium leading-none">Smart clothes. Street posture.</p>
              </div>
              <p className="text-right text-[10px] uppercase leading-4 text-white/42">Black<br />Brown<br />White</p>
            </div>
            <p className="max-w-[19rem] text-xl leading-7 text-white/78">
              Clean streetwear for people who dress quiet, sharp, and intentional.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/collection" className="inline-flex h-11 items-center gap-2 bg-[var(--frnk-brown)] px-5 text-sm font-medium text-white transition hover:bg-white hover:text-black">
                View Collection <ArrowRight className="size-4" />
              </Link>
              <Link href="/lookbook" className="text-sm font-medium text-white/72 underline underline-offset-8 hover:text-white">
                Lookbook
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto hidden min-h-[calc(100svh-4.5rem)] max-w-[1680px] gap-8 px-5 py-8 sm:px-8 lg:grid lg:grid-cols-12 lg:px-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="z-10 grid content-center gap-8 lg:col-span-5"
        >
          <p className="max-w-sm text-xs uppercase leading-5 text-[var(--frnk-tan)]">Premium minimal streetwear / Dark brown system / Smart silhouettes</p>
          <h1 className="text-[clamp(5rem,17vw,17rem)] font-semibold leading-[0.74] tracking-[0.08em]">
            FR<br />NK
          </h1>
          <p className="max-w-xl text-2xl leading-9 text-white/76 sm:text-4xl sm:leading-[1.08]">
            Clean streetwear for people who dress quiet, sharp, and intentional.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/collection" className="inline-flex h-12 items-center gap-2 bg-[var(--frnk-brown)] px-7 text-sm font-medium text-white transition hover:bg-white hover:text-black">
              View Collection <ArrowRight className="size-4" />
            </Link>
            <Link href="/lookbook" className="text-sm font-medium text-white/72 underline underline-offset-8 hover:text-white">
              Lookbook
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.95, delay: 0.1, ease: "easeOut" }}
          className="relative min-h-[55vh] overflow-hidden border border-white/10 bg-[var(--frnk-coffee)] shadow-[0_40px_120px_rgba(0,0,0,0.42)] lg:col-span-5 lg:col-start-7 lg:my-10"
        >
          <Image src="/images/frnkplus-hero-black-coat.jpg" alt="FRNK+ model wearing a black coat and sunglasses" fill priority loading="eager" sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-linear-to-t from-black/72 via-black/10 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-white/52">Drop 01</p>
              <p className="mt-2 max-w-56 text-2xl font-medium leading-none">Smart clothes. Street posture.</p>
            </div>
            <p className="text-right text-xs uppercase text-white/50">Black / Brown / White</p>
          </div>
        </motion.div>

        <div className="z-10 hidden content-end pb-10 lg:col-span-2 lg:grid">
          <div className="border-l border-white/12 pl-5">
            <p className="text-[11px] uppercase leading-5 text-white/42">Explore the drop, lookbook, and product pages without leaving the editorial mood.</p>
          </div>
        </div>
      </div>

      <section className="relative border-t border-white/10 bg-[#0b0704] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1680px] gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4 lg:pt-12">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--frnk-tan)]">Drop 01 / Dark Brown System</p>
            <h2 className="mt-5 text-5xl font-semibold leading-[0.86] sm:text-7xl">
              Streetwear,
              <br />
              edited.
            </h2>
          </div>
          <div className="relative min-h-[48vh] overflow-hidden border border-white/10 bg-[var(--frnk-coffee)] lg:col-span-5 lg:-mt-8">
            <Image src="/images/frnkplus-brown-puffer.jpg" alt="FRNK+ brown streetwear campaign" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover object-center" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 max-w-48 text-2xl font-medium leading-none">Brown becomes the quiet luxury layer.</p>
          </div>
          <div className="grid content-between gap-8 lg:col-span-3 lg:pb-10">
            <div className="ml-auto w-36 border-t border-white/18 pt-4 text-right text-xs uppercase leading-5 text-white/46 sm:w-48">
              Oversized shapes. Sharper finishes. Less noise.
            </div>
            <div className="relative min-h-64 overflow-hidden border border-white/10 bg-black lg:-ml-16">
              <Image src="/images/frnkplus-tailored-coat.jpg" alt="FRNK+ tailored streetwear coat" fill sizes="(min-width: 1024px) 22vw, 80vw" className="object-cover" />
            </div>
            <Link href="/drop-01" className="inline-flex h-11 items-center justify-center border border-white/15 px-5 text-sm text-white transition hover:bg-white hover:text-black">
              Enter Drop 01
            </Link>
          </div>
        </div>
      </section>
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

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
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
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#050403_0%,rgba(5,4,3,0.78)_48%,rgba(83,54,34,0.46)_100%)]" />
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
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] overflow-y-auto bg-[var(--frnk-black)] text-white"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <Image src="/images/frnkplus-brown-puffer.jpg" alt="" fill sizes="100vw" className="object-cover opacity-[0.18]" />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 flex min-h-full flex-col px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-semibold tracking-[0.18em] text-white">FRNK<span className="text-[var(--frnk-tan)]">+</span></p>
                <p className="mt-1 text-sm text-white/55">Minimal streetwear</p>
              </div>
              <Button variant="ghost" size="icon-lg" className="rounded-none text-white hover:bg-white/10 hover:text-white" onClick={() => onOpenChange(false)}>
                <X />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <div className="mt-12 grid gap-5 pb-10">
              {navItems.map(([label, href]) => (
                <Link key={href} href={href} onClick={() => onOpenChange(false)} className="text-4xl font-semibold leading-none text-white sm:text-5xl">
                  {label}
                </Link>
              ))}
            </div>
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
      <DialogContent className="max-w-5xl overflow-hidden rounded-none bg-[var(--frnk-black)] p-0 text-white">
        {product && (
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[460px] bg-[var(--frnk-coffee)]">
              <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col justify-between p-6 sm:p-8">
              <DialogHeader>
                <DialogTitle className="text-4xl leading-tight">{product.name}</DialogTitle>
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
