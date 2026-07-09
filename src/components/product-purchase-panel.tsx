"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/frnk-data";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedStock = product.stock[selectedSize] ?? 0;
  const stockCopy = useMemo(() => {
    if (selectedStock === 0) return "Sold out";
    if (selectedStock <= 2) return `Only ${selectedStock} left`;
    return "In stock";
  }, [selectedStock]);

  return (
    <div className="mt-6 grid gap-6">
      <div>
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-sm text-white/52">Size</p>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--frnk-tan)]">{stockCopy}</p>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
          {product.sizes.map((size) => {
            const sizeStock = product.stock[size] ?? 0;
            const active = selectedSize === size;

            return (
              <button
                key={size}
                type="button"
                disabled={sizeStock === 0}
                onClick={() => {
                  setSelectedSize(size);
                  setQuantity(1);
                  setAdded(false);
                }}
                className={[
                  "h-11 min-w-12 border px-4 text-sm transition",
                  active ? "border-white bg-white text-black" : "border-white/15 text-white hover:bg-white hover:text-black",
                  sizeStock === 0 ? "cursor-not-allowed opacity-35" : "",
                ].join(" ")}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[148px_1fr]">
        <div className="grid h-12 grid-cols-3 border border-white/15">
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Decrease quantity"
            className="h-full rounded-none text-white hover:bg-white hover:text-black"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            <Minus className="size-4" />
          </Button>
          <div className="grid place-items-center text-sm">{quantity}</div>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Increase quantity"
            className="h-full rounded-none text-white hover:bg-white hover:text-black"
            onClick={() => setQuantity((current) => Math.min(selectedStock, current + 1))}
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <Button
          type="button"
          disabled={selectedStock === 0}
          className="h-12 rounded-none bg-[var(--frnk-brown)] text-sm font-medium text-white hover:bg-white hover:text-black"
          onClick={() => setAdded(true)}
        >
          <ShoppingBag className="size-4" />
          {added ? "Added to bag" : "Add to bag"}
        </Button>
      </div>

      <p className="text-xs uppercase leading-5 tracking-[0.18em] text-white/38">
        Selected: {selectedSize} / Qty {quantity} / Local bag preview
      </p>
    </div>
  );
}
