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
    id: "puffer-01",
    slug: "coffee-puffer-jacket",
    name: "Coffee Puffer Jacket",
    category: "Outerwear",
    price: 228,
    color: "Coffee Brown",
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 6, M: 9, L: 4, XL: 2 },
    image: "/images/frnkplus-brown-puffer.jpg",
    gallery: ["/images/frnkplus-brown-puffer.jpg", "/images/frnkplus-brown-varsity.jpg", "/images/frnkplus-urban-walk.jpg"],
    note: "A warm street layer with oversized volume and a grounded brown tone.",
    details: ["Water-resistant nylon shell", "Relaxed dropped shoulder", "Insulated body with soft internal lining"],
    fit: "Oversized. Size down for a cleaner profile.",
  },
  {
    id: "overshirt-02",
    slug: "black-studio-overshirt",
    name: "Black City Coat",
    category: "Outerwear",
    price: 188,
    color: "Washed Black",
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 5, M: 12, L: 7, XL: 3 },
    image: "/images/frnkplus-hero-black-coat.jpg",
    gallery: ["/images/frnkplus-hero-black-coat.jpg", "/images/frnkplus-black-studio.jpg", "/images/frnkplus-denim-wall.jpg"],
    note: "A clean city layer with a sharp black silhouette and editorial attitude.",
    details: ["Structured black outer layer", "Relaxed shoulder line", "Designed for clean layering"],
    fit: "Relaxed regular. Take your normal size.",
  },
  {
    id: "coat-03",
    slug: "tailored-street-coat",
    name: "Tailored Street Coat",
    category: "Outerwear",
    price: 264,
    color: "Taupe Brown",
    sizes: ["S", "M", "L"],
    stock: { S: 3, M: 5, L: 2 },
    image: "/images/frnkplus-tailored-coat.jpg",
    gallery: ["/images/frnkplus-tailored-coat.jpg", "/images/frnkplus-urban-walk.jpg", "/images/frnkplus-brown-puffer.jpg"],
    note: "Smart tailoring softened for streetwear movement.",
    details: ["Structured shoulder line", "Long cut for clean layering", "Concealed front closure"],
    fit: "Relaxed long fit. Designed to layer over hoodies.",
  },
  {
    id: "hoodie-04",
    slug: "goggles-hoodie",
    name: "Goggles Hoodie",
    category: "Fleece",
    price: 146,
    color: "Deep Black",
    sizes: ["XS", "S", "M", "L"],
    stock: { XS: 2, S: 8, M: 6, L: 1 },
    image: "/images/frnkplus-goggles-hoodie.jpg",
    gallery: ["/images/frnkplus-goggles-hoodie.jpg", "/images/frnkplus-cap-jacket.jpg", "/images/frnkplus-black-studio.jpg"],
    note: "Dense fleece with a quiet technical mood and a clean hood shape.",
    details: ["Heavy brushed fleece", "Double-layer hood", "Kangaroo pocket with internal phone sleeve"],
    fit: "Relaxed. Size up for a stronger streetwear shape.",
  },
];

export const lookbookFrames = [
  { image: "/images/frnkplus-brown-puffer.jpg", title: "Coffee volume", text: "Brown, black, concrete, breath." },
  { image: "/images/frnkplus-black-studio.jpg", title: "Studio black", text: "Clean shirt shape with street posture." },
  { image: "/images/frnkplus-tailored-coat.jpg", title: "Tailored street", text: "Smart enough for night, relaxed enough for daily wear." },
  { image: "/images/frnkplus-goggles-hoodie.jpg", title: "Quiet technical", text: "A hoodie with sharper energy." },
  { image: "/images/frnkplus-urban-walk.jpg", title: "Urban line", text: "Movement, concrete, minimal contrast." },
  { image: "/images/frnkplus-cap-jacket.jpg", title: "Cap jacket", text: "No noise. Just proportion." },
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
