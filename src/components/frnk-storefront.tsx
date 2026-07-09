"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
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
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  color: string;
  sizes: string[];
  image: "/images/frnk-hero.webp" | "/images/frnk-lookbook.webp";
  ratio: "portrait" | "wide" | "square";
  note: string;
};

const navItems = ["Home", "Shop", "Lookbook", "Journal", "About"];

const products: Product[] = [
  {
    id: "overshirt-01",
    name: "Washed Cotton Overshirt",
    category: "Outerwear",
    price: 188,
    color: "Muted Olive",
    sizes: ["S", "M", "L", "XL"],
    image: "/images/frnk-lookbook.webp",
    ratio: "portrait",
    note: "Garment-dyed cotton twill with a relaxed architectural drape.",
  },
  {
    id: "coat-02",
    name: "Everyday Long Coat",
    category: "Outerwear",
    price: 264,
    color: "Black",
    sizes: ["S", "M", "L"],
    image: "/images/frnk-hero.webp",
    ratio: "wide",
    note: "Quiet weather layer with concealed closure and soft structure.",
  },
  {
    id: "knit-03",
    name: "Heavyweight Cloud Knit",
    category: "Knitwear",
    price: 146,
    color: "Warm White",
    sizes: ["XS", "S", "M", "L"],
    image: "/images/frnk-lookbook.webp",
    ratio: "square",
    note: "Dense cotton knit built for daily wear and low-effort polish.",
  },
  {
    id: "trouser-04",
    name: "Relaxed Pleat Trouser",
    category: "Bottoms",
    price: 172,
    color: "Charcoal",
    sizes: ["28", "30", "32", "34"],
    image: "/images/frnk-hero.webp",
    ratio: "portrait",
    note: "A wide leg trouser with soft volume and clean front breaks.",
  },
];

const productLayouts = [
  "lg:col-start-1 lg:row-start-1 lg:mt-28",
  "lg:col-span-2 lg:col-start-3 lg:row-start-1",
  "lg:col-start-2 lg:row-start-2 lg:-mt-6",
  "lg:col-span-2 lg:col-start-4 lg:row-start-2 lg:mt-24",
];

const journal = [
  ["Uniforms Without Routine", "A note on repetition, restraint, and clothes that get better with time."],
  ["The Weight Of Cotton", "Why fabric density changes the way a daily piece feels on the body."],
  ["Campaign 01: Concrete Light", "Behind the quiet architecture and warm shadows of the first FRNK story."],
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function FrnkStorefront() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({ "overshirt-01": 1 });
  const [cursor, setCursor] = useState({ x: 0, y: 0, label: "" });
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

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      setCursor({
        x: event.clientX,
        y: event.clientY,
        label: target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "",
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const addToCart = (id: string) => {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
    setCartOpen(true);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--frnk-warm)] text-[var(--frnk-black)]">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden size-8 items-center justify-center rounded-full border border-white/40 bg-black/80 text-[10px] font-medium text-white shadow-xl backdrop-blur-md lg:flex"
        animate={{
          x: cursor.x - (cursor.label ? 34 : 16),
          y: cursor.y - (cursor.label ? 34 : 16),
          width: cursor.label ? 68 : 32,
          height: cursor.label ? 68 : 32,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
      >
        {cursor.label}
      </motion.div>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          scrolled ? "border-b border-black/10 bg-[var(--frnk-warm)]/88 shadow-sm backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <nav className="mx-auto grid h-18 max-w-[1720px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-12">
          <a href="#" className="text-2xl font-semibold tracking-[0.2em]" aria-label="FRNK home">
            FRNK
          </a>
          <div className="hidden items-center gap-8 text-xs uppercase text-black/62 lg:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-black">
                {item}
              </a>
            ))}
          </div>
          <div className="flex justify-end gap-1">
            <IconButton label="Search" onClick={() => setSearchOpen(true)}>
              <Search />
            </IconButton>
            <IconButton label="Wishlist">
              <Heart />
            </IconButton>
            <IconButton label="Account">
              <UserRound />
            </IconButton>
            <IconButton label={`Cart, ${cartItems.length} items`} onClick={() => setCartOpen(true)}>
              <ShoppingBag />
            </IconButton>
            <IconButton className="lg:hidden" label="Open menu" onClick={() => setMenuOpen(true)}>
              <Menu />
            </IconButton>
          </div>
        </nav>
      </header>

      <section id="home" className="relative min-h-[100svh] overflow-hidden pt-18">
        <div className="absolute inset-x-0 top-18 z-10 px-5 sm:px-8 lg:px-12">
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-[clamp(5.5rem,22vw,24rem)] font-semibold leading-[0.74] tracking-[0.05em] text-black mix-blend-multiply"
          >
            FRNK
          </motion.h1>
        </div>

        <div className="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-[1720px] grid-cols-6 px-5 pb-8 pt-[34vh] sm:px-8 lg:grid-cols-12 lg:px-12 lg:pt-[28vh]">
          <div className="relative col-span-6 min-h-[46vh] overflow-hidden bg-black lg:col-span-7 lg:col-start-5 lg:min-h-[66vh]" data-cursor="VIEW">
            <Image src="/images/frnk-hero.webp" alt="FRNK editorial campaign in concrete architecture" fill priority loading="eager" sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover object-top opacity-95" />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
              <p className="max-w-40 text-xs uppercase leading-5">Campaign 01 Concrete Light</p>
              <p className="max-w-56 text-right text-sm">Designed for everyday</p>
            </div>
          </div>

          <div className="relative z-20 col-span-6 -mt-12 grid gap-8 bg-[var(--frnk-warm)] px-5 py-8 sm:px-7 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-36 lg:bg-transparent lg:px-0 lg:py-0">
            <p className="max-w-sm text-xl leading-8 text-black/72 sm:text-2xl">
              Quiet confidence. Timeless essentials. Crafted with intention.
            </p>
            <div className="grid max-w-sm grid-cols-[auto_1fr] items-end gap-5">
              <span className="text-7xl font-semibold leading-none">01</span>
              <p className="pb-2 text-xs uppercase leading-5 text-black/52">A missing letter. A sharper identity. Less noise.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button data-cursor="SHOP" className="h-12 rounded-md bg-black px-7 text-white hover:bg-white hover:text-black" onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}>
                Enter Collection <ArrowRight />
              </Button>
              <a href="#lookbook" className="text-sm font-medium underline underline-offset-8">
                View Lookbook
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="collections" className="relative border-y border-black/10 bg-white">
        <div className="mx-auto grid max-w-[1720px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-0">
          <div className="lg:sticky lg:top-18 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:py-16">
            <p className="text-xs uppercase text-black/48">Manifesto</p>
            <h2 className="mt-8 max-w-2xl text-5xl font-semibold leading-[0.92] sm:text-7xl lg:text-8xl">
              This is not a normal clothing brand.
            </h2>
            <p className="mt-8 max-w-sm text-sm leading-7 text-black/58 lg:mt-0">
              Minimal does not mean empty. It means every detail has survived the edit.
            </p>
          </div>

          <div className="relative grid gap-14 py-0 lg:py-28">
            <div className="ml-auto max-w-xl text-2xl leading-10 text-black/72 sm:text-3xl">
              FRNK edits contemporary essentials through fabric, proportion, restraint, and a refusal to explain too much.
            </div>
            <div className="relative min-h-[62vh] overflow-hidden lg:-ml-20" data-cursor="OPEN">
              <Image src="/images/frnk-lookbook.webp" alt="Layered FRNK lookbook composition" fill sizes="(min-width: 1024px) 54vw, 100vw" className="object-cover" />
              <div className="absolute -bottom-1 -left-1 bg-white px-5 py-4 text-xs uppercase leading-5 text-black/58">
                Quiet architecture<br />Soft volume<br />Permanent mood
              </div>
            </div>
            <div className="grid gap-8 sm:grid-cols-[0.65fr_1fr] sm:items-end">
              <p className="text-6xl font-semibold leading-none sm:text-8xl">Less.</p>
              <p className="max-w-md text-lg leading-8 text-black/64">
                The collection is built like a sentence with words removed until only the necessary ones remain.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="relative px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1720px]">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <p className="text-xs uppercase text-black/48 lg:col-span-2">Atelier Index</p>
            <h2 className="text-5xl font-semibold leading-[0.9] sm:text-7xl lg:col-span-6 lg:text-8xl">Objects for daily ritual.</h2>
            <p className="max-w-sm text-lg leading-8 text-black/62 lg:col-span-3 lg:col-start-10">
              Shopping stays close to the story: direct, tactile, and intentionally spare.
            </p>
          </div>

          <div className="mt-14 grid gap-x-5 gap-y-16 md:grid-cols-2 lg:grid-cols-5 lg:grid-rows-[auto_auto]">
            {products.map((product, index) => (
              <article
                key={product.id}
                className={cn("group", productLayouts[index])}
                data-cursor="OPEN"
              >
                <button
                  type="button"
                  onClick={() => setQuickView(product)}
                  className={cn(
                    "relative block w-full overflow-hidden bg-[var(--frnk-beige)] text-left",
                    product.ratio === "wide" ? "aspect-[1.42]" : product.ratio === "square" ? "aspect-square" : "aspect-[0.72]",
                  )}
                >
                  <Image src={product.image} alt={product.name} fill sizes="(min-width: 1280px) 28vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.045]" />
                  <span className="absolute left-4 top-4 bg-white/84 px-3 py-1 text-xs uppercase backdrop-blur">{product.category}</span>
                </button>
                <div className={cn("mt-4 grid gap-4", index % 2 === 1 ? "sm:grid-cols-[1fr_auto]" : "")}>
                  <div>
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <p className="mt-1 text-sm text-black/55">{product.color}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(product.price)}</p>
                  <div className="flex gap-2 sm:col-span-2">
                    <Button className="h-10 flex-1 rounded-md bg-black text-white hover:bg-[var(--frnk-olive)]" onClick={() => addToCart(product.id)}>
                      Add
                    </Button>
                    <Button variant="outline" size="icon-lg" aria-label={`Wishlist ${product.name}`} className="rounded-md" onClick={() => toggleWishlist(product.id)}>
                      <Heart className={cn(wishlist.includes(product.id) && "fill-black")} />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="lookbook" className="bg-[var(--frnk-black)] py-16 text-white lg:py-24">
        <div className="mx-auto max-w-[1720px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-xs uppercase text-white/42">Lookbook</p>
              <h2 className="mt-5 text-5xl font-semibold leading-[0.9] sm:text-7xl">A moving magazine page.</h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-white/62 lg:justify-self-end">
              Soft volume, clean planes, and clothes that leave room for the person wearing them.
            </p>
          </div>
        </div>

        <div className="mt-12 flex snap-x gap-5 overflow-x-auto px-5 pb-6 sm:px-8 lg:px-12">
          {[0, 1, 2, 3].map((item) => (
            <button
              key={item}
              type="button"
              className={cn(
                "group relative shrink-0 snap-center overflow-hidden bg-white/8 text-left",
                item % 2 === 0 ? "h-[68vh] w-[72vw] max-w-[760px]" : "mt-20 h-[48vh] w-[58vw] max-w-[560px]",
              )}
              onClick={() => setQuickView(products[item])}
              data-cursor="VIEW"
            >
              <Image src={item % 2 === 0 ? "/images/frnk-hero.webp" : "/images/frnk-lookbook.webp"} alt={`FRNK lookbook frame ${item + 1}`} fill sizes="80vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
              <span className="absolute bottom-4 left-4 text-xs uppercase text-white/72">Frame 0{item + 1}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="journal" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-[1720px] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[420px] overflow-hidden bg-black lg:mt-24" data-cursor="READ">
            <Image src="/images/frnk-lookbook.webp" alt="FRNK studio journal photography" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover opacity-85" />
            <p className="absolute bottom-5 left-5 max-w-xs text-4xl font-semibold leading-none text-white sm:text-5xl">Notes from the studio.</p>
          </div>
          <div className="grid content-start gap-2">
            {journal.map(([title, description], index) => (
              <a
                key={title}
                href="#"
                className={cn(
                  "group grid gap-5 border-t border-black/12 py-8 transition hover:px-4 hover:bg-white/60 md:grid-cols-[0.8fr_1fr_auto]",
                  index === 1 && "md:ml-20",
                  index === 2 && "md:-ml-10",
                )}
              >
                <span className="text-2xl font-medium leading-tight">{title}</span>
                <span className="text-black/62">{description}</span>
                <ArrowRight className="transition group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative overflow-hidden bg-white px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1720px] gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <h2 className="max-w-5xl text-6xl font-semibold leading-[0.86] sm:text-8xl lg:text-9xl">Wear what matters.</h2>
          <form className="grid gap-4 lg:max-w-lg lg:justify-self-end" action={subscribeToNewsletter}>
            <p className="text-black/62">Receive collection notes, early access, and studio letters.</p>
            <div className="flex gap-2">
              <Input name="email" aria-label="Email address" type="email" placeholder="Email address" className="h-12 rounded-md border-black/15 bg-[var(--frnk-warm)] px-4" />
              <Button className="h-12 rounded-md bg-black px-6 text-white">Join</Button>
            </div>
          </form>
        </div>
      </section>

      <footer id="contact" className="grid gap-10 bg-[var(--frnk-black)] px-5 py-12 text-white sm:px-8 lg:grid-cols-[1fr_auto] lg:px-12">
        <div>
          <p className="text-4xl font-semibold tracking-[0.18em]">FRNK</p>
          <p className="mt-4 max-w-md text-white/55">Premium contemporary fashion for quiet confidence.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm text-white/62 sm:grid-cols-4">
          {["Shop", "Lookbook", "Shipping", "Returns"].map((item) => (
            <a key={item} href="#" className="hover:text-white">
              {item}
            </a>
          ))}
        </div>
      </footer>

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onQuickView={setQuickView} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} items={cartItems} total={cartTotal} setCart={setCart} />
      <QuickView product={quickView} onOpenChange={(open) => !open && setQuickView(null)} onAdd={addToCart} />
    </main>
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
      <TooltipTrigger render={<Button type="button" variant="ghost" size="icon-lg" className={cn("rounded-md", className)} onClick={onClick} />}>
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
          className="fixed inset-0 z-[80] overflow-hidden bg-[var(--frnk-black)] text-white"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <Image src="/images/frnk-lookbook.webp" alt="" fill sizes="100vw" className="object-cover opacity-[0.22]" />
          <div className="absolute inset-0 bg-black/58" />
          <div className="relative z-10 flex min-h-full flex-col px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-semibold tracking-[0.18em] text-white">FRNK</p>
                <p className="mt-1 text-sm text-white/55">Designed for everyday</p>
              </div>
              <Button variant="ghost" size="icon-lg" className="rounded-md text-white hover:bg-white/10 hover:text-white" onClick={() => onOpenChange(false)}>
                <X />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <div className="mt-16 grid gap-6">
              {navItems.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => onOpenChange(false)} className="text-5xl font-semibold leading-none text-white">
                  {item}
                </a>
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
      <DialogContent className="max-w-2xl rounded-md bg-[var(--frnk-warm)] p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl">Search FRNK</DialogTitle>
          <DialogDescription>Popular searches: overshirt, trouser, knit, everyday coat.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/45" />
          <Input autoFocus placeholder="Search products and editorials" className="h-12 rounded-md border-black/15 bg-white pl-11" />
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
              className="grid grid-cols-[64px_1fr_auto] items-center gap-4 rounded-md p-2 text-left transition hover:bg-white"
            >
              <span className="relative block aspect-square overflow-hidden rounded-sm bg-white">
                <Image src={product.image} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <span>
                <span className="block font-medium">{product.name}</span>
                <span className="text-sm text-black/55">{product.category}</span>
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
      <DialogContent className="max-w-5xl overflow-hidden rounded-md bg-white p-0">
        {product && (
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[460px] bg-[var(--frnk-beige)]">
              <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col justify-between p-6 sm:p-8">
              <DialogHeader>
                <DialogTitle className="text-4xl leading-tight">{product.name}</DialogTitle>
                <DialogDescription className="text-base leading-7">{product.note}</DialogDescription>
              </DialogHeader>
              <div className="mt-8 grid gap-6">
                <div className="flex justify-between border-y border-black/10 py-4 text-sm">
                  <span>{product.color}</span>
                  <span>{formatPrice(product.price)}</span>
                </div>
                <div>
                  <p className="mb-3 text-sm text-black/55">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button key={size} variant="outline" className="h-11 min-w-12 rounded-md">
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button className="h-12 rounded-md bg-black text-white" onClick={() => onAdd(product.id)}>
                  Add To Cart
                </Button>
                <div className="grid gap-3 text-sm text-black/62">
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
      <SheetContent className="w-full border-black/10 bg-[var(--frnk-warm)] sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl">Cart</SheetTitle>
          <SheetDescription>Selected pieces from the editorial.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-[76px_1fr] gap-4 rounded-md bg-white p-3"
              >
                <div className="relative aspect-[0.78] overflow-hidden rounded-sm bg-[var(--frnk-beige)]">
                  <Image src={item.image} alt="" fill sizes="76px" className="object-cover" />
                </div>
                <div>
                  <div className="flex justify-between gap-3">
                    <p className="font-medium">{item.name}</p>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => setCart((current) => ({ ...current, [item.id]: 0 }))}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-black/55">{formatPrice(item.price)}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" size="icon-sm" aria-label="Decrease quantity" onClick={() => setCart((current) => ({ ...current, [item.id]: Math.max(0, item.qty - 1) }))}>
                      <Minus />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.qty}</span>
                    <Button variant="outline" size="icon-sm" aria-label="Increase quantity" onClick={() => setCart((current) => ({ ...current, [item.id]: item.qty + 1 }))}>
                      <Plus />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <SheetFooter>
          <div className="flex justify-between border-t border-black/10 pt-4">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button className="h-12 rounded-md bg-black text-white">Checkout</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
