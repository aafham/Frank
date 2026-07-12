export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  color: string;
  sizes: string[];
  stock: Record<string, number>;
  image: string;
  gallery: string[];
  note: string;
  details: string[];
  fit: string;
};

export const products: Product[] = [
  {
    id: "cap-00",
    slug: "exclusive-streetwear-cap",
    name: "Exclusive Streetwear Cap",
    category: "Exclusive",
    price: 78,
    color: "Core Black",
    sizes: ["OS"],
    stock: { OS: 24 },
    image: "/images/frnkplus-product-cap-studio.png",
    gallery: ["/images/frnkplus-product-cap-studio.png", "/images/frnkplus-play-duo.png", "/images/frnkplus-play-hero.png"],
    note: "An official FRNK+ cap with a clean black body, sharp shape, and a studio-ready daily posture.",
    details: ["Premium cotton body", "Six-panel structure", "Adjustable back strap with metal hardware"],
    fit: "One size. Adjustable strap for a clean daily fit.",
  },
  {
    id: "puffer-01",
    slug: "coffee-puffer-jacket",
    name: "Coffee Puffer Jacket",
    category: "Outerwear",
    price: 228,
    color: "Coffee Brown",
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 6, M: 9, L: 4, XL: 2 },
    image: "/images/frnkplus-product-cocoa-puffer.png",
    gallery: ["/images/frnkplus-product-cocoa-puffer.png", "/images/frnkplus-play-hero.png", "/images/frnkplus-product-espresso-cargo.png"],
    note: "A warm cocoa street layer with oversized volume and a bright studio attitude.",
    details: ["Water-resistant nylon shell", "Relaxed dropped shoulder", "Insulated body with soft internal lining"],
    fit: "Oversized. Size down for a cleaner profile.",
  },
  {
    id: "overshirt-02",
    slug: "black-studio-overshirt",
    name: "Cobalt Track Jacket",
    category: "Outerwear",
    price: 188,
    color: "Electric Cobalt",
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 5, M: 12, L: 7, XL: 3 },
    image: "/images/frnkplus-product-cobalt-track.png",
    gallery: ["/images/frnkplus-product-cobalt-track.png", "/images/frnkplus-play-duo.png", "/images/frnkplus-product-cap-studio.png"],
    note: "A cropped technical layer that brings a single bright colour into the daily uniform.",
    details: ["Lightweight technical shell", "Relaxed dropped shoulder", "Elasticated hem for a clean cropped line"],
    fit: "Relaxed cropped fit. Take your normal size.",
  },
  {
    id: "coat-03",
    slug: "tailored-street-coat",
    name: "Washed Studio Overshirt",
    category: "Outerwear",
    price: 264,
    color: "Washed Black",
    sizes: ["S", "M", "L"],
    stock: { S: 3, M: 5, L: 2 },
    image: "/images/frnkplus-product-washed-overshirt.png",
    gallery: ["/images/frnkplus-product-washed-overshirt.png", "/images/frnkplus-play-lookbook.png", "/images/frnkplus-product-olive-hoodie.png"],
    note: "A boxy washed-black layer with easy proportions and a quieter studio finish.",
    details: ["Washed cotton twill", "Boxy relaxed cut", "Large utility chest pocket"],
    fit: "Relaxed fit. Designed to sit loose over a tee or hoodie.",
  },
  {
    id: "hoodie-04",
    slug: "goggles-hoodie",
    name: "Olive Loop Hoodie",
    category: "Fleece",
    price: 146,
    color: "Deep Olive / Lime",
    sizes: ["XS", "S", "M", "L"],
    stock: { XS: 2, S: 8, M: 6, L: 1 },
    image: "/images/frnkplus-product-olive-hoodie.png",
    gallery: ["/images/frnkplus-product-olive-hoodie.png", "/images/frnkplus-play-lookbook.png", "/images/frnkplus-product-cobalt-track.png"],
    note: "Dense olive fleece with a lime hood flash and an easy oversized shape.",
    details: ["Heavy brushed fleece", "Double-layer contrast hood", "Kangaroo pocket with internal phone sleeve"],
    fit: "Relaxed. Size up for a stronger streetwear shape.",
  },
  {
    id: "cargo-05",
    slug: "espresso-utility-cargo",
    name: "Espresso Utility Cargo",
    category: "Bottoms",
    price: 172,
    color: "Espresso Brown",
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 4, M: 8, L: 6, XL: 3 },
    image: "/images/frnkplus-product-espresso-cargo.png",
    gallery: ["/images/frnkplus-product-espresso-cargo.png", "/images/frnkplus-play-hero.png", "/images/frnkplus-product-cocoa-puffer.png"],
    note: "Relaxed utility cargo in deep espresso cotton, built for movement and an easy full look.",
    details: ["Garment-dyed cotton twill", "Roomy side cargo pockets", "Relaxed straight leg"],
    fit: "Relaxed straight fit. Take your normal size for an easy drape.",
  },
];

export const lookbookFrames = [
  { image: "/images/frnkplus-product-cap-studio.png", title: "Blue room", text: "A black cap inside a louder room." },
  { image: "/images/frnkplus-product-cocoa-puffer.png", title: "Cocoa volume", text: "Brown outerwear under studio light." },
  { image: "/images/frnkplus-product-cobalt-track.png", title: "Cobalt pace", text: "One bright layer changes the uniform." },
  { image: "/images/frnkplus-product-washed-overshirt.png", title: "Washed studio", text: "Soft black, hard shape, pink bench." },
  { image: "/images/frnkplus-product-olive-hoodie.png", title: "Olive loop", text: "Fleece with a lime edge." },
  { image: "/images/frnkplus-product-espresso-cargo.png", title: "Espresso utility", text: "Cargo proportions, clean colour blocks." },
];

export const journal = [
  ["Streetwear, edited.", "Oversized shapes, quieter colors, cleaner decisions."],
  ["Brown as a neutral.", "Deep coffee tones soften black without making the brand warm or casual."],
  ["Smart clothes, street posture.", "FRNK+ keeps the silhouette relaxed and the finish refined."],
];

export const sizeRows = [
  ["XS", "34-36", "28-30", "155-170"],
  ["S", "36-38", "30-32", "165-175"],
  ["M", "38-40", "32-34", "170-182"],
  ["L", "40-43", "34-36", "178-188"],
  ["XL", "43-46", "36-38", "185-195"],
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
