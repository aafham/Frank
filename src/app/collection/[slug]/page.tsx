import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { getProductBySlug, products } from "@/lib/frnk-data";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: `${product.name} | FRNK+`,
    description: product.note,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [primaryImage, ...secondaryImages] = product.gallery;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.note,
    brand: {
      "@type": "Brand",
      name: "FRNK+",
    },
    image: product.gallery.map((image) => `https://frnkplus.vercel.app${image}`),
    color: product.color,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `https://frnkplus.vercel.app/collection/${product.slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-[var(--frnk-black)] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <nav className="mx-auto flex h-18 max-w-[1680px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="text-2xl font-semibold tracking-[0.2em]">
          FRNK<span className="text-[var(--frnk-tan)]">+</span>
        </Link>
        <Link href="/collection" className="text-xs uppercase text-white/58 hover:text-white">
          Back to collection
        </Link>
      </nav>

      <section className="mx-auto grid max-w-[1680px] gap-6 px-0 pb-28 pt-0 sm:gap-8 sm:px-8 sm:pb-12 sm:pt-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          <div className="relative min-h-[54svh] overflow-hidden bg-[var(--frnk-coffee)] sm:min-h-[72vh] md:col-span-2">
            <Image src={primaryImage} alt={`${product.name} view 1`} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent sm:hidden" />
          </div>
          {secondaryImages.map((image, index) => (
            <div key={image} className="relative hidden min-h-[42vh] overflow-hidden bg-[var(--frnk-coffee)] sm:block">
              <Image src={image} alt={`${product.name} view ${index + 2}`} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>

        <aside id="buy-panel" className="mx-5 border border-white/12 bg-[var(--frnk-black)]/90 p-5 backdrop-blur-xl sm:mx-0 sm:mt-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none lg:sticky lg:top-24 lg:h-fit">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--frnk-tan)]">{product.category} / {product.color}</p>
          <h1 className="mt-4 text-[clamp(2.8rem,12vw,4.2rem)] font-semibold leading-[0.86] sm:mt-5 sm:text-7xl">{product.name}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/62 sm:mt-6 sm:text-lg sm:leading-8">{product.note}</p>
          <p className="mt-5 text-2xl sm:mt-6">${product.price}</p>

          <div className="mt-6 border-y border-white/12 py-5 sm:mt-8 sm:py-6">
            <p className="text-sm text-white/52">Fit</p>
            <p className="mt-2 text-base leading-7 sm:text-lg">{product.fit}</p>
          </div>

          <ProductPurchasePanel product={product} />

          <Link href="/checkout" className="mt-4 inline-flex h-12 w-full items-center justify-center border border-white/15 text-sm font-medium text-white transition hover:bg-white hover:text-black">
            Continue to checkout preview
          </Link>

          <div className="mt-7 grid gap-3 text-sm leading-6 text-white/58 sm:mt-8">
            {product.details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>
        </aside>

        <div className="mx-5 grid gap-3 sm:hidden">
          {secondaryImages.map((image, index) => (
            <div key={image} className="relative min-h-[34vh] overflow-hidden bg-[var(--frnk-coffee)]">
              <Image src={image} alt={`${product.name} view ${index + 2}`} fill sizes="100vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[var(--frnk-black)]/92 px-4 py-3 text-white backdrop-blur-xl sm:hidden">
        <div className="grid grid-cols-[1fr_auto] items-center gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">{product.color}</p>
            <p className="mt-1 font-medium">{product.name}</p>
          </div>
          <a href="#buy-panel" className="inline-flex h-11 items-center justify-center bg-[var(--frnk-brown)] px-5 text-sm font-medium text-white">
            {`Add $${product.price}`}
          </a>
        </div>
      </div>
    </main>
  );
}
