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
  note: string;
};

const navItems = ["Signal", "Lab", "Forms", "Diary", "Access"];

const products: Product[] = [
  {
    id: "overshirt-01",
    name: "Washed Cotton Overshirt",
    category: "Outerwear",
    price: 188,
    color: "Muted Olive",
    sizes: ["S", "M", "L", "XL"],
    image: "/images/frnk-lookbook.webp",
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
    note: "A wide leg trouser with soft volume and clean front breaks.",
  },
];

const diary = [
  ["No alphabet required.", "Identity appears when something expected is removed."],
  ["Built like silence.", "Flat seams, heavier cloth, proportion that does not beg."],
  ["Ordinary days. Strange presence.", "The uniform becomes memorable because it refuses decoration."],
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
  const [activeIndex, setActiveIndex] = useState(1);
  const [cart, setCart] = useState<Record<string, number>>({ "overshirt-01": 1 });
  const [cursor, setCursor] = useState({ x: 0, y: 0, label: "" });
  const reduceMotion = useReducedMotion();
  const activeProduct = products[activeIndex];

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
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden items-center justify-center border border-white/35 bg-black text-[10px] font-medium uppercase text-white shadow-2xl lg:flex"
        animate={{
          x: cursor.x - (cursor.label ? 38 : 16),
          y: cursor.y - (cursor.label ? 38 : 16),
          width: cursor.label ? 76 : 32,
          height: cursor.label ? 76 : 32,
          rotate: cursor.label ? -8 : 0,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
      >
        {cursor.label}
      </motion.div>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          scrolled ? "border-b border-black/10 bg-[var(--frnk-warm)]/88 backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <nav className="mx-auto grid h-18 max-w-[1800px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-12">
          <a href="#signal" className="text-2xl font-semibold tracking-[0.24em]" aria-label="FRNK home">
            FRNK
          </a>
          <div className="hidden items-center gap-7 text-[11px] uppercase text-black/58 lg:flex">
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

      <section id="signal" className="relative min-h-[100svh] overflow-hidden bg-[var(--frnk-warm)] pt-18">
        <div className="absolute inset-y-0 left-0 hidden w-[34vw] bg-black lg:block" />
        <div className="absolute right-[-10vw] top-[6vh] hidden text-[34vw] font-semibold leading-none text-black/[0.04] lg:block">A</div>
        <div className="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-[1800px] px-5 pb-8 sm:px-8 lg:grid-cols-12 lg:px-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative z-10 hidden py-10 text-white lg:col-span-3 lg:flex lg:flex-col lg:justify-between"
          >
            <p className="text-xs uppercase leading-5 text-white/52">Fashion signal / not a store / no safe template</p>
            <div className="-rotate-90 origin-left text-[10px] uppercase text-white/48">Scroll to decode the missing letter</div>
          </motion.div>

          <div className="relative z-10 grid content-center gap-8 py-10 lg:col-span-5 lg:col-start-4">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-lg text-xs uppercase leading-5 text-black/52"
            >
              New interface. Same restraint. A brand that removes the obvious letter and keeps the attitude.
            </motion.p>
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: "easeOut" }}
              className="text-[clamp(5rem,18vw,18rem)] font-semibold leading-[0.72] tracking-[0.08em]"
            >
              FR<br />NK
            </motion.h1>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button data-cursor="LAB" className="h-12 rounded-none bg-black px-7 text-white hover:bg-white hover:text-black" onClick={() => document.getElementById("lab")?.scrollIntoView({ behavior: "smooth" })}>
                Open the Lab <ArrowRight />
              </Button>
              <a href="#forms" className="text-sm font-medium underline underline-offset-8">
                View silhouettes
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.14, ease: "easeOut" }}
            className="relative min-h-[56vh] overflow-hidden bg-black shadow-[0_40px_100px_rgba(0,0,0,0.18)] lg:col-span-4 lg:col-start-9 lg:my-20"
            data-cursor="VIEW"
          >
            <Image src="/images/frnk-hero.webp" alt="FRNK fashion signal" fill priority loading="eager" sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover object-top" />
            <div className="absolute inset-0 bg-linear-to-t from-black/62 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex justify-between gap-4 text-xs uppercase text-white/72">
              <span>Signal 01</span>
              <span>Quiet confidence</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="lab" className="min-h-screen bg-black px-5 py-18 text-white sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1800px] gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="grid content-between gap-8 border border-white/14 p-5 lg:min-h-[calc(100vh-12rem)] lg:p-8">
            <div>
              <p className="text-xs uppercase text-white/44">Interactive garment lab</p>
              <h2 className="mt-6 max-w-xl text-5xl font-semibold leading-[0.86] sm:text-7xl">Choose by feeling, not category.</h2>
            </div>

            <div className="grid gap-2">
              {products.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "grid grid-cols-[56px_1fr_auto] items-center gap-4 border-t border-white/12 py-4 text-left transition",
                    activeIndex === index ? "text-white" : "text-white/42 hover:text-white",
                  )}
                >
                  <span className="text-xs uppercase">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-2xl font-medium leading-none sm:text-4xl">{product.name}</span>
                  <span className="text-sm">{formatPrice(product.price)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[720px] overflow-hidden bg-[var(--frnk-warm)] text-black">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={reduceMotion ? false : { opacity: 0, scale: 1.04, x: 28 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98, x: -28 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image src={activeProduct.image} alt={activeProduct.name} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 grid gap-5 bg-[var(--frnk-warm)]/88 p-5 backdrop-blur md:grid-cols-[1fr_auto] md:items-end lg:p-8">
              <div>
                <p className="text-xs uppercase text-black/48">{activeProduct.category} / {activeProduct.color}</p>
                <h3 className="mt-2 text-4xl font-semibold leading-none sm:text-6xl">{activeProduct.name}</h3>
                <p className="mt-4 max-w-xl text-lg leading-8 text-black/64">{activeProduct.note}</p>
              </div>
              <div className="flex gap-2">
                <Button className="h-12 rounded-none bg-black px-7 text-white" onClick={() => addToCart(activeProduct.id)}>
                  Add {formatPrice(activeProduct.price)}
                </Button>
                <Button variant="outline" size="icon-lg" aria-label={`Wishlist ${activeProduct.name}`} className="h-12 rounded-none" onClick={() => toggleWishlist(activeProduct.id)}>
                  <Heart className={cn(wishlist.includes(activeProduct.id) && "fill-black")} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="forms" className="bg-[var(--frnk-warm)] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <p className="text-xs uppercase text-black/45 lg:col-span-2">Four forms</p>
            <h2 className="text-6xl font-semibold leading-[0.84] sm:text-8xl lg:col-span-7">No product grid. Just interruptions.</h2>
            <p className="max-w-sm text-lg leading-8 text-black/62 lg:col-span-3">Each piece enters the page with a different proportion and a different kind of silence.</p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-12">
            {products.map((product, index) => (
              <motion.button
                key={product.id}
                type="button"
                initial={reduceMotion ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: index * 0.07, ease: "easeOut" }}
                onClick={() => setQuickView(product)}
                className={cn(
                  "group relative overflow-hidden bg-black text-left text-white",
                  index === 0 && "min-h-[560px] lg:col-span-4 lg:mt-28",
                  index === 1 && "min-h-[760px] lg:col-span-5",
                  index === 2 && "min-h-[440px] lg:col-span-3 lg:mt-52",
                  index === 3 && "min-h-[520px] lg:col-span-7 lg:col-start-4 lg:-mt-16",
                )}
                data-cursor="OPEN"
              >
                <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-linear-to-t from-black/72 via-black/8 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-xs uppercase text-white/62">{String(index + 1).padStart(2, "0")} / {product.category}</p>
                  <h3 className="mt-3 max-w-sm text-3xl font-semibold leading-none sm:text-5xl">{product.name}</h3>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section id="diary" className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="absolute left-1/2 top-0 hidden h-full w-px rotate-12 bg-black/10 lg:block" />
        <div className="mx-auto grid max-w-[1800px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <p className="text-xs uppercase text-black/45">Brand diary</p>
            <h2 className="mt-8 text-6xl font-semibold leading-[0.84] sm:text-8xl">The A is gone. The attitude stayed.</h2>
          </div>
          <div className="grid gap-7 lg:pt-32">
            {diary.map(([title, text], index) => (
              <motion.article
                key={title}
                initial={reduceMotion ? false : { opacity: 0, x: index % 2 ? 52 : -52 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-110px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={cn("border-t border-black/12 py-8", index === 1 && "lg:ml-28", index === 2 && "lg:-ml-12")}
              >
                <p className="text-xs uppercase text-black/38">0{index + 1}</p>
                <h3 className="mt-5 text-4xl font-semibold leading-none sm:text-6xl">{title}</h3>
                <p className="mt-5 max-w-xl text-lg leading-8 text-black/62">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="access" className="relative min-h-[100svh] overflow-hidden bg-black px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28">
        <Image src="/images/frnk-lookbook.webp" alt="FRNK private access" fill sizes="100vw" className="object-cover opacity-28" />
        <div className="absolute inset-0 bg-black/58" />
        <div className="relative mx-auto grid min-h-[76vh] max-w-[1800px] gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase text-white/45">Private access</p>
            <h2 className="mt-8 text-6xl font-semibold leading-[0.82] sm:text-8xl lg:text-[9rem]">Less noise. More identity.</h2>
          </div>
          <form className="grid gap-4 border border-white/18 bg-white/8 p-5 backdrop-blur lg:col-span-4 lg:col-start-9" action={subscribeToNewsletter}>
            <p className="text-lg leading-8 text-white/66">Receive collection notes, early access, and studio letters.</p>
            <div className="flex gap-2">
              <Input name="email" aria-label="Email address" type="email" placeholder="Email address" className="h-12 rounded-none border-white/20 bg-black/40 px-4 text-white placeholder:text-white/42" />
              <Button className="h-12 rounded-none bg-white px-6 text-black hover:bg-[var(--frnk-warm)]">Join</Button>
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
          {["Lab", "Forms", "Shipping", "Returns"].map((item) => (
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
      <TooltipTrigger render={<Button type="button" variant="ghost" size="icon-lg" className={cn("rounded-none", className)} onClick={onClick} />}>
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
          <Image src="/images/frnk-hero.webp" alt="" fill sizes="100vw" className="object-cover opacity-[0.2]" />
          <div className="absolute inset-0 bg-black/62" />
          <div className="relative z-10 flex min-h-full flex-col px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-semibold tracking-[0.18em] text-white">FRNK</p>
                <p className="mt-1 text-sm text-white/55">Fashion signal</p>
              </div>
              <Button variant="ghost" size="icon-lg" className="rounded-none text-white hover:bg-white/10 hover:text-white" onClick={() => onOpenChange(false)}>
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
      <DialogContent className="max-w-2xl rounded-none bg-[var(--frnk-warm)] p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl">Search FRNK</DialogTitle>
          <DialogDescription>Popular searches: overshirt, trouser, knit, everyday coat.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/45" />
          <Input autoFocus placeholder="Search products and editorials" className="h-12 rounded-none border-black/15 bg-white pl-11" />
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
              className="grid grid-cols-[64px_1fr_auto] items-center gap-4 p-2 text-left transition hover:bg-white"
            >
              <span className="relative block aspect-square overflow-hidden bg-white">
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
      <DialogContent className="max-w-5xl overflow-hidden rounded-none bg-white p-0">
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
                      <Button key={size} variant="outline" className="h-11 min-w-12 rounded-none">
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button className="h-12 rounded-none bg-black text-white" onClick={() => onAdd(product.id)}>
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
          <SheetDescription>Selected pieces from the lab.</SheetDescription>
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
                className="grid grid-cols-[76px_1fr] gap-4 bg-white p-3"
              >
                <div className="relative aspect-[0.78] overflow-hidden bg-[var(--frnk-beige)]">
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
          <Button className="h-12 rounded-none bg-black text-white">Checkout</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
