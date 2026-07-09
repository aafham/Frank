import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

  return (
    <main className="min-h-screen bg-[var(--frnk-black)] text-white">
      <nav className="mx-auto flex h-18 max-w-[1680px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="text-2xl font-semibold tracking-[0.2em]">
          FRNK<span className="text-[var(--frnk-tan)]">+</span>
        </Link>
        <Link href="/collection" className="text-xs uppercase text-white/58 hover:text-white">
          Back to collection
        </Link>
      </nav>

      <section className="mx-auto grid max-w-[1680px] gap-8 px-5 pb-12 pt-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="grid gap-4 md:grid-cols-2">
          {product.gallery.map((image, index) => (
            <div key={image} className={index === 0 ? "relative min-h-[72vh] overflow-hidden bg-[var(--frnk-coffee)] md:col-span-2" : "relative min-h-[42vh] overflow-hidden bg-[var(--frnk-coffee)]"}>
              <Image src={image} alt={`${product.name} view ${index + 1}`} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <p className="text-xs uppercase text-[var(--frnk-tan)]">{product.category} / {product.color}</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.88] sm:text-7xl">{product.name}</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">{product.note}</p>
          <p className="mt-6 text-2xl">${product.price}</p>

          <div className="mt-8 border-y border-white/12 py-6">
            <p className="text-sm text-white/52">Fit</p>
            <p className="mt-2 text-lg">{product.fit}</p>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm text-white/52">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button key={size} type="button" className="h-11 min-w-12 border border-white/15 px-4 text-sm transition hover:bg-white hover:text-black">
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Link href="/checkout" className="mt-8 inline-flex h-12 w-full items-center justify-center bg-[var(--frnk-brown)] text-sm font-medium text-white transition hover:bg-white hover:text-black">
            Continue to checkout
          </Link>

          <div className="mt-8 grid gap-3 text-sm leading-6 text-white/58">
            {product.details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
