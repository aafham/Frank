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
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { subscribeToNewsletter } from "@/app/actions";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  color: string;
  sizes: string[];
  image: "/images/frank-hero.png" | "/images/frank-lookbook.png";
  ratio: "portrait" | "wide" | "square";
  note: string;
};

const navItems = ["Home", "Shop", "Collections", "Lookbook", "Journal", "About"];

const products: Product[] = [
  {
    id: "overshirt-01",
    name: "Washed Cotton Overshirt",
    category: "Outerwear",
    price: 188,
    color: "Muted Olive",
    sizes: ["S", "M", "L", "XL"],
    image: "/images/frank-lookbook.png",
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
    image: "/images/frank-hero.png",
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
    image: "/images/frank-lookbook.png",
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
    image: "/images/frank-hero.png",
    ratio: "portrait",
    note: "A wide leg trouser with soft volume and clean front breaks.",
  },
];

const journal = [
  ["Uniforms Without Routine", "A note on repetition, restraint, and clothes that get better with time."],
  ["The Weight Of Cotton", "Why fabric density changes the way a daily piece feels on the body."],
  ["Campaign 01: Concrete Light", "Behind the quiet architecture and warm shadows of the first FRANK story."],
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function FrankStorefront() {
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
    <main className="min-h-screen bg-[var(--frank-warm)] text-[var(--frank-black)]">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden size-8 items-center justify-center rounded-full border border-black/25 bg-white/80 text-[10px] font-medium text-black shadow-sm backdrop-blur-md lg:flex"
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
          scrolled ? "border-b border-black/10 bg-[var(--frank-warm)]/92 shadow-sm backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <nav className="mx-auto grid h-20 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-12">
          <a href="#" className="text-2xl font-semibold" aria-label="FRANK home">
            FRANK
          </a>
          <div className="hidden items-center gap-8 text-sm text-black/70 lg:flex">
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

      <section id="home" className="relative grid min-h-[92vh] overflow-hidden pt-20 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex min-h-[42vh] flex-col justify-between px-5 py-12 sm:px-8 lg:min-h-0 lg:px-12 lg:py-16">
          <div className="max-w-xl">
            <Badge variant="outline" className="mb-8 border-black/20 bg-white/35 text-black">
              Premium Minimal Streetwear
            </Badge>
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-[9ch] text-6xl font-semibold leading-[0.92] sm:text-7xl lg:text-8xl"
            >
              Simply Frank
            </motion.h1>
            <p className="mt-8 max-w-md text-lg leading-8 text-black/68">
              Timeless everyday clothing, edited down to fabric, proportion, and confidence without noise.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Button data-cursor="SHOP" className="h-12 rounded-xl bg-black px-7 text-white hover:bg-white hover:text-black" onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}>
              Shop Collection <ArrowRight />
            </Button>
            <a href="#lookbook" className="text-sm font-medium underline underline-offset-8">
              View Lookbook
            </a>
          </div>
        </div>
        <div className="relative min-h-[58vh] lg:min-h-[calc(92vh-5rem)]" data-cursor="VIEW">
          <Image src="/images/frank-hero.png" alt="FRANK editorial campaign in concrete architecture" fill priority loading="eager" sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover object-top" />
          <div className="absolute bottom-6 left-5 right-5 flex items-end justify-between gap-4 text-white sm:left-8 sm:right-8">
            <p className="max-w-40 text-xs uppercase leading-5">Campaign 01 Concrete Light</p>
            <p className="max-w-56 text-right text-sm">Designed For Everyday</p>
          </div>
        </div>
      </section>

      <section id="collections" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm text-black/55">Featured Collection</p>
            <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">A wardrobe reduced to the pieces that carry the day.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-black/64 lg:justify-self-end">
            FRANK edits streetwear through a quieter lens: heavier fabrics, cleaner lines, restrained color, and proportion that feels current without expiring next season.
          </p>
        </div>
      </section>

      <section id="shop" className="bg-white px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm text-black/55">New Arrivals</p>
            <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Wear Less. Say More.</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Outerwear", "Knitwear", "Bottoms"].map((filter) => (
              <Button key={filter} variant={filter === "All" ? "default" : "outline"} className="h-10 rounded-xl px-5">
                {filter}
              </Button>
            ))}
            <Button variant="outline" className="h-10 rounded-xl px-4">
              <SlidersHorizontal /> Sort
            </Button>
          </div>
        </div>
        <div className="grid auto-rows-[minmax(360px,auto)] gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <article
              key={product.id}
              className={cn("group flex flex-col", index === 1 && "xl:col-span-2", index === 2 && "md:translate-y-12")}
              data-cursor="OPEN"
            >
              <button
                type="button"
                onClick={() => setQuickView(product)}
                className={cn(
                  "relative overflow-hidden rounded-lg bg-[var(--frank-beige)] text-left",
                  product.ratio === "wide" ? "aspect-[1.35]" : product.ratio === "square" ? "aspect-square" : "aspect-[0.78]",
                )}
              >
                <Image src={product.image} alt={product.name} fill sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                <span className="absolute left-4 top-4 rounded-full bg-white/82 px-3 py-1 text-xs backdrop-blur">{product.category}</span>
              </button>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="mt-1 text-sm text-black/55">{product.color}</p>
                </div>
                <p className="text-sm font-medium">{formatPrice(product.price)}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button className="h-10 flex-1 rounded-xl bg-black text-white hover:bg-[var(--frank-olive)]" onClick={() => addToCart(product.id)}>
                  Add
                </Button>
                <Button variant="outline" size="icon-lg" aria-label={`Wishlist ${product.name}`} className="rounded-xl" onClick={() => toggleWishlist(product.id)}>
                  <Heart className={cn(wishlist.includes(product.id) && "fill-black")} />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="lookbook" className="grid min-h-screen bg-[var(--frank-black)] text-white lg:grid-cols-[1.18fr_0.82fr]">
        <div className="relative min-h-[62vh]" data-cursor="VIEW">
          <Image src="/images/frank-lookbook.png" alt="FRANK lookbook in a quiet apartment interior" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-between px-5 py-14 sm:px-8 lg:px-12">
          <div>
            <p className="text-sm text-white/50">Lookbook</p>
            <h2 className="mt-5 text-5xl font-semibold leading-none sm:text-6xl">Confidence Without Noise.</h2>
          </div>
          <div className="mt-16 max-w-md">
            <p className="text-lg leading-8 text-white/68">
              Soft volume, clean planes, and clothes that leave room for the person wearing them.
            </p>
            <Button className="mt-8 h-12 rounded-xl bg-white px-7 text-black hover:bg-[var(--frank-gold)] hover:text-black">
              Open Editorial <ArrowRight />
            </Button>
          </div>
        </div>
      </section>

      <section id="journal" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-sm text-black/55">Journal</p>
            <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">Notes from the studio.</h2>
          </div>
          <div className="divide-y divide-black/12 border-y border-black/12">
            {journal.map(([title, description]) => (
              <a key={title} href="#" className="grid gap-4 py-8 transition hover:px-4 hover:bg-white/55 md:grid-cols-[0.55fr_1fr_auto]">
                <span className="text-xl font-medium">{title}</span>
                <span className="text-black/62">{description}</span>
                <ArrowRight className="hidden md:block" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-white px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <h2 className="max-w-3xl text-5xl font-semibold leading-none sm:text-6xl">Minimal. Functional. Timeless.</h2>
          <form className="grid gap-4 lg:max-w-lg lg:justify-self-end" action={subscribeToNewsletter}>
            <p className="text-black/62">Receive collection notes, early access, and studio letters.</p>
            <div className="flex gap-2">
              <Input name="email" aria-label="Email address" type="email" placeholder="Email address" className="h-12 rounded-xl border-black/15 bg-[var(--frank-warm)] px-4" />
              <Button className="h-12 rounded-xl bg-black px-6 text-white">Join</Button>
            </div>
          </form>
        </div>
      </section>

      <footer id="contact" className="grid gap-10 bg-[var(--frank-black)] px-5 py-12 text-white sm:px-8 lg:grid-cols-[1fr_auto] lg:px-12">
        <div>
          <p className="text-4xl font-semibold">FRANK</p>
          <p className="mt-4 max-w-md text-white/55">Premium minimal streetwear for everyday confidence.</p>
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
      <TooltipTrigger render={<Button type="button" variant="ghost" size="icon-lg" className={cn("rounded-xl", className)} onClick={onClick} />}>
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
          className="fixed inset-0 z-[80] overflow-hidden bg-[var(--frank-black)] text-white"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <Image src="/images/frank-lookbook.png" alt="" fill sizes="100vw" className="object-cover opacity-[0.22]" />
          <div className="absolute inset-0 bg-black/58" />
          <div className="relative z-10 flex min-h-full flex-col px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-semibold text-white">FRANK</p>
                <p className="mt-1 text-sm text-white/55">Designed For Everyday</p>
              </div>
              <Button variant="ghost" size="icon-lg" className="rounded-xl text-white hover:bg-white/10 hover:text-white" onClick={() => onOpenChange(false)}>
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
      <DialogContent className="max-w-2xl rounded-lg bg-[var(--frank-warm)] p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl">Search FRANK</DialogTitle>
          <DialogDescription>Popular searches: overshirt, trouser, knit, everyday coat.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/45" />
          <Input autoFocus placeholder="Search products and editorials" className="h-12 rounded-xl border-black/15 bg-white pl-11" />
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
              className="grid grid-cols-[64px_1fr_auto] items-center gap-4 rounded-lg p-2 text-left transition hover:bg-white"
            >
              <span className="relative block aspect-square overflow-hidden rounded-md bg-white">
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
      <DialogContent className="max-w-5xl overflow-hidden rounded-lg bg-white p-0">
        {product && (
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[460px] bg-[var(--frank-beige)]">
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
                      <Button key={size} variant="outline" className="h-11 min-w-12 rounded-xl">
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button className="h-12 rounded-xl bg-black text-white" onClick={() => onAdd(product.id)}>
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
      <SheetContent className="w-full border-black/10 bg-[var(--frank-warm)] sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl">Cart</SheetTitle>
          <SheetDescription>Checkout-ready front-end prototype.</SheetDescription>
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
                className="grid grid-cols-[76px_1fr] gap-4 rounded-lg bg-white p-3"
              >
                <div className="relative aspect-[0.78] overflow-hidden rounded-md bg-[var(--frank-beige)]">
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
          <Button className="h-12 rounded-xl bg-black text-white">Checkout</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
