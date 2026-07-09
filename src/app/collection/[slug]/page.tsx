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

      <section className="mx-auto grid max-w-[1680px] gap-8 px-0 pb-12 pt-0 sm:px-8 sm:pt-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative min-h-[78svh] overflow-hidden bg-[var(--frnk-coffee)] sm:min-h-[72vh] md:col-span-2">
            <Image src={primaryImage} alt={`${product.name} view 1`} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent sm:hidden" />
          </div>
          {secondaryImages.map((image, index) => (
            <div key={image} className="relative hidden min-h-[42vh] overflow-hidden bg-[var(--frnk-coffee)] sm:block">
              <Image src={image} alt={`${product.name} view ${index + 2}`} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>

        <aside className="-mt-40 mx-5 border border-white/12 bg-[var(--frnk-black)]/86 p-5 backdrop-blur-xl sm:mx-0 sm:mt-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none lg:sticky lg:top-24 lg:h-fit">
          <p className="text-xs uppercase text-[var(--frnk-tan)]">{product.category} / {product.color}</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.88] sm:text-7xl">{product.name}</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">{product.note}</p>
          <p className="mt-6 text-2xl">${product.price}</p>

          <div className="mt-8 border-y border-white/12 py-6">
            <p className="text-sm text-white/52">Fit</p>
            <p className="mt-2 text-lg">{product.fit}</p>
          </div>

          <ProductPurchasePanel product={product} />

          <Link href="/checkout" className="mt-4 inline-flex h-12 w-full items-center justify-center border border-white/15 text-sm font-medium text-white transition hover:bg-white hover:text-black">
            Continue to checkout preview
          </Link>

          <div className="mt-8 grid gap-3 text-sm leading-6 text-white/58">
            {product.details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>
        </aside>

        <div className="mx-5 grid gap-4 sm:hidden">
          {secondaryImages.map((image, index) => (
            <div key={image} className="relative min-h-[42vh] overflow-hidden bg-[var(--frnk-coffee)]">
              <Image src={image} alt={`${product.name} view ${index + 2}`} fill sizes="100vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
