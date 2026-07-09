import { FrnkStorefront } from "@/components/frnk-storefront";

export const metadata = {
  title: "Lookbook | FRNK+",
  description: "FRNK+ editorial streetwear lookbook for Drop 01.",
};

export default function LookbookPage() {
  return <FrnkStorefront view="lookbook" />;
}
