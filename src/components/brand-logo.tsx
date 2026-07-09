import Image from "next/image";

import { cn } from "@/lib/utils";

const logoSizes = {
  nav: "size-11",
  menu: "size-12",
  footer: "size-24 sm:size-28",
} as const;

export function BrandLogo({
  size = "nav",
  className,
}: {
  size?: keyof typeof logoSizes;
  className?: string;
}) {
  return (
    <span className={cn("relative block shrink-0", logoSizes[size], className)}>
      <Image src="/images/frnkplus-official-logo.svg" alt="FRNK+" fill sizes="112px" className="object-contain" priority={size === "nav"} />
    </span>
  );
}
