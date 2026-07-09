import { FrnkStorefront } from "@/components/frnk-storefront";

export const metadata = {
  title: "Collection | FRNK+",
  description: "Shop the FRNK+ premium minimal streetwear collection preview.",
};

export default function CollectionPage() {
  return <FrnkStorefront view="collection" />;
}
