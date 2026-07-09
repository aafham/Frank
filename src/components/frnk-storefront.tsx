"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
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
import { useEffect, useMemo, useRef, useState } from "react";

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

const navItems = ["Cover", "Index", "Runway", "Notes", "Join"];

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

const productPlacements = [
  "lg:left-[4%] lg:top-[18%] lg:w-[24%]",
  "lg:left-[34%] lg:top-[4%] lg:w-[38%]",
  "lg:right-[6%] lg:top-[36%] lg:w-[22%]",
  "lg:left-[18%] lg:bottom-[2%] lg:w-[28%]",
];

const fieldNotes = [
  ["001", "Clothes as atmosphere.", "Built for daily repetition without becoming invisible."],
  ["002", "The missing letter is a posture.", "Not absence. Edit. Refusal. Precision."],
  ["003", "Quiet can still be radical.", "The silhouette speaks before the logo ever does."],
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
  const coverRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: coverRef,
    offset: ["start start", "end start"],
  });
  const coverScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const coverLift = useTransform(scrollYProgress, [0, 1], [0, -90]);

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
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden size-8 items-center justify-center rounded-full border border-white/35 bg-black/85 text-[10px] font-medium text-white shadow-2xl backdrop-blur-md lg:flex"
        animate={{
          x: cursor.x - (cursor.label ? 35 : 16),
          y: cursor.y - (cursor.label ? 35 : 16),
          width: cursor.label ? 70 : 32,
          height: cursor.label ? 70 : 32,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
      >
        {cursor.label}
      </motion.div>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          scrolled ? "border-b border-black/10 bg-[var(--frnk-warm)]/86 backdrop-blur-xl" : "bg-transparent text-white mix-blend-difference",
        )}
      >
        <nav className="mx-auto grid h-18 max-w-[1800px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-12">
          <a href="#cover" className="text-2xl font-semibold tracking-[0.2em]" aria-label="FRNK home">
            FRNK
          </a>
          <div className="hidden items-center gap-7 text-[11px] uppercase lg:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:opacity-55">
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

      <section ref={coverRef} id="cover" className="relative min-h-[100svh] overflow-hidden bg-black text-white">
        <motion.div style={reduceMotion ? undefined : { scale: coverScale, y: coverLift }} className="absolute inset-0">
          <Image src="/images/frnk-hero.webp" alt="FRNK campaign cover" fill priority loading="eager" sizes="100vw" className="object-cover object-top opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_28%,transparent_0,rgba(0,0,0,0.12)_26%,rgba(0,0,0,0.72)_72%)]" />
        </motion.div>

        <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1800px] grid-cols-6 content-between px-5 pb-8 pt-24 sm:px-8 lg:grid-cols-12 lg:px-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="col-span-6 lg:col-span-4 lg:col-start-9"
          >
            <p className="text-xs uppercase leading-5 text-white/60">Issue Zero / Contemporary essentials / No symbol required</p>
          </motion.div>

          <div className="col-span-6 grid gap-8 lg:col-span-12">
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.08, ease: "easeOut" }}
              className="text-[clamp(5rem,20vw,23rem)] font-semibold leading-[0.74] tracking-[0.06em]"
            >
              FRNK
            </motion.h1>
            <div className="grid gap-7 lg:grid-cols-12 lg:items-end">
              <p className="max-w-xl text-2xl leading-9 text-white/84 sm:text-4xl sm:leading-[1.08] lg:col-span-5">
                A digital fashion campaign for people who notice what is missing.
              </p>
              <div className="flex flex-wrap items-center gap-4 lg:col-span-4 lg:col-start-9 lg:justify-end">
                <Button data-cursor="ENTER" className="h-12 rounded-none bg-white px-7 text-black hover:bg-[var(--frnk-warm)]" onClick={() => document.getElementById("index")?.scrollIntoView({ behavior: "smooth" })}>
                  Enter the Issue <ArrowRight />
                </Button>
                <a href="#runway" className="text-sm font-medium underline underline-offset-8">
                  Watch the edit
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-5 hidden h-48 w-px bg-white/30 lg:block">
          <span className="absolute -left-10 -top-2 rotate-90 text-[10px] uppercase text-white/52">Scroll</span>
        </div>
      </section>

      <section id="index" className="relative min-h-screen overflow-hidden px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="text-xs uppercase text-black/48">Index of Absence</p>
              <p className="mt-8 max-w-xs text-lg leading-8 text-black/62">
                Products are not presented as a grid. They appear like fragments from a campaign wall.
              </p>
            </div>

            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl font-semibold leading-[0.82] sm:text-8xl lg:col-span-8 lg:col-start-5 lg:text-[10rem]"
            >
              Clothes that leave a trace.
            </motion.h2>
          </div>

          <div className="relative mt-16 grid gap-10 md:grid-cols-2 lg:h-[1120px] lg:grid-cols-none lg:gap-0">
            <div className="pointer-events-none absolute left-[47%] top-[8%] hidden h-[78%] w-px rotate-6 bg-black/12 lg:block" />
            <div className="pointer-events-none absolute left-[8%] top-[42%] hidden h-px w-[74%] -rotate-3 bg-black/12 lg:block" />
            <p className="pointer-events-none absolute right-[11%] top-[4%] hidden text-[12rem] font-semibold leading-none text-black/[0.035] lg:block">A</p>

            {products.map((product, index) => (
              <motion.article
                key={product.id}
                initial={reduceMotion ? false : { opacity: 0, y: 42, rotate: index % 2 ? 2 : -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.78, delay: index * 0.08, ease: "easeOut" }}
                className={cn("group lg:absolute", productPlacements[index])}
                data-cursor="OPEN"
              >
                <button
                  type="button"
                  onClick={() => setQuickView(product)}
                  className={cn(
                    "relative block w-full overflow-hidden bg-[var(--frnk-beige)] text-left shadow-[0_28px_80px_rgba(0,0,0,0.08)]",
                    product.ratio === "wide" ? "aspect-[1.48]" : product.ratio === "square" ? "aspect-square" : "aspect-[0.72]",
                  )}
                >
                  <Image src={product.image} alt={product.name} fill sizes="(min-width: 1280px) 34vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.045]" />
                  <span className="absolute left-4 top-4 bg-white/84 px-3 py-1 text-[11px] uppercase backdrop-blur">{product.category}</span>
                  <span className="absolute bottom-4 right-4 text-xs uppercase text-white drop-shadow">{`0${index + 1}`}</span>
                </button>
                <div className="mt-4 grid grid-cols-[1fr_auto] gap-4">
                  <div>
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <p className="mt-1 text-sm text-black/55">{product.color}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(product.price)}</p>
                  <div className="col-span-2 flex gap-2">
                    <Button className="h-10 flex-1 rounded-none bg-black text-white hover:bg-[var(--frnk-olive)]" onClick={() => addToCart(product.id)}>
                      Add
                    </Button>
                    <Button variant="outline" size="icon-lg" aria-label={`Wishlist ${product.name}`} className="rounded-none" onClick={() => toggleWishlist(product.id)}>
                      <Heart className={cn(wishlist.includes(product.id) && "fill-black")} />
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="runway" className="relative bg-[var(--frnk-black)] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-[1800px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <h2 className="text-6xl font-semibold leading-[0.82] sm:text-8xl lg:col-span-7">
              A runway you move by hand.
            </h2>
            <p className="max-w-md text-lg leading-8 text-white/62 lg:col-span-3 lg:col-start-10">
              Drag the frames. Open a piece. Keep the pace personal.
            </p>
          </div>
        </div>

        <div className="mt-14 flex snap-x gap-4 overflow-x-auto px-5 pb-8 sm:px-8 lg:px-12">
          {[0, 1, 2, 3, 0, 1].map((productIndex, frameIndex) => (
            <button
              key={`${productIndex}-${frameIndex}`}
              type="button"
              className={cn(
                "group relative shrink-0 snap-center overflow-hidden bg-white/8 text-left",
                frameIndex % 3 === 0 && "h-[72vh] w-[74vw] max-w-[700px]",
                frameIndex % 3 === 1 && "mt-24 h-[48vh] w-[52vw] max-w-[460px]",
                frameIndex % 3 === 2 && "mt-8 h-[62vh] w-[62vw] max-w-[560px]",
              )}
              onClick={() => setQuickView(products[productIndex])}
              data-cursor="VIEW"
            >
              <Image src={frameIndex % 2 === 0 ? "/images/frnk-hero.webp" : "/images/frnk-lookbook.webp"} alt={`FRNK runway frame ${frameIndex + 1}`} fill sizes="80vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
              <span className="absolute left-4 top-4 text-[11px] uppercase text-white/72">Frame {String(frameIndex + 1).padStart(2, "0")}</span>
              <span className="absolute bottom-4 left-4 max-w-52 text-2xl font-medium leading-none">{products[productIndex].name}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="notes" className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-[1800px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-12 lg:py-28">
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <div className="relative h-full min-h-[520px] overflow-hidden bg-black" data-cursor="READ">
              <Image src="/images/frnk-lookbook.webp" alt="FRNK studio notes" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover opacity-82" />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-5 max-w-sm text-5xl font-semibold leading-[0.9] text-white sm:text-7xl">Field notes from a quieter room.</p>
            </div>
          </div>

          <div className="grid content-start gap-5 lg:pt-32">
            {fieldNotes.map(([number, title, description], index) => (
              <motion.article
                key={number}
                initial={reduceMotion ? false : { opacity: 0, x: index % 2 ? 48 : -48 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.75, ease: "easeOut" }}
                className={cn(
                  "grid gap-5 border-t border-black/12 py-9 md:grid-cols-[120px_1fr]",
                  index === 1 && "md:ml-24",
                  index === 2 && "md:-ml-10",
                )}
              >
                <p className="text-xs uppercase text-black/42">{number}</p>
                <div>
                  <h3 className="text-4xl font-semibold leading-none sm:text-6xl">{title}</h3>
                  <p className="mt-5 max-w-xl text-lg leading-8 text-black/62">{description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="relative min-h-[92vh] overflow-hidden bg-[var(--frnk-warm)] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="absolute inset-x-0 top-12 text-center text-[clamp(6rem,21vw,22rem)] font-semibold leading-none tracking-[0.05em] text-black/[0.045]">
          FRNK
        </div>
        <div className="relative mx-auto grid min-h-[70vh] max-w-[1800px] gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase text-black/45">Final page</p>
            <h2 className="mt-8 text-6xl font-semibold leading-[0.84] sm:text-8xl lg:text-[9rem]">Wear what matters.</h2>
          </div>
          <form className="grid gap-4 bg-white/72 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.08)] backdrop-blur lg:col-span-4 lg:col-start-9" action={subscribeToNewsletter}>
            <p className="text-lg leading-8 text-black/62">Receive collection notes, early access, and studio letters.</p>
            <div className="flex gap-2">
              <Input name="email" aria-label="Email address" type="email" placeholder="Email address" className="h-12 rounded-none border-black/15 bg-[var(--frnk-warm)] px-4" />
              <Button className="h-12 rounded-none bg-black px-6 text-white">Join</Button>
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
          {["Index", "Runway", "Shipping", "Returns"].map((item) => (
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
                <p className="mt-1 text-sm text-white/55">Issue Zero</p>
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
          <SheetDescription>Selected pieces from the issue.</SheetDescription>
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
