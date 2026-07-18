"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "@/lib/api/v1/commerce/cart";
import { Button } from "@/components/ui/button";

export function ProductForm({ product }: { product: any }) {
  const queryClient = useQueryClient();
  const sizeAttribute = product.attributes?.find((attr: any) => attr.name.toLowerCase() === 'size');
  
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizeAttribute?.terms?.find((t: any) => t.default)?.name || null
  );

  const mutation = useMutation({
    mutationFn: async () => {
      // Find the variation ID that matches the selected size (and default color if applicable)
      // Since Qikink uses Color and Size, we match the selected size.
      // If we can't find a variation, we'll try to add the parent and pass the variation attributes.
      
      const payload: any = {
        id: product.id,
        quantity: 1,
      };

      if (selectedSize) {
        payload.variation = [
          {
            attribute: "Size",
            value: selectedSize,
          }
        ];
        // Note: if there is a color attribute, we might need to send it too. 
        // For KHOOFIYA MVP, we send the selected size.
      }

      // We need to update the cart.ts server action to accept variations
      return await addToCart(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      console.error("Failed to add to cart:", err);
      alert("Please select all required options.");
    }
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Size Selector */}
      {sizeAttribute && sizeAttribute.terms.length > 0 && (
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest font-semibold">Select Size</span>
          <div className="grid grid-cols-4 gap-4">
            {sizeAttribute.terms.map((term: any) => (
              <button 
                key={term.id}
                onClick={() => setSelectedSize(term.name)}
                className={`h-12 border border-outline transition-colors text-xs font-semibold tracking-widest uppercase ${
                  selectedSize === term.name 
                    ? "bg-foreground text-background" 
                    : "bg-background text-foreground hover:bg-foreground hover:text-background"
                }`}
              >
                {term.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-4 pt-4">
        <Button 
          size="lg" 
          disabled={!product.is_in_stock || mutation.isPending || (sizeAttribute && !selectedSize)} 
          className="w-full"
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Adding..." : (product.is_in_stock ? "Add To Cart" : "Archived")}
        </Button>
        <p className="text-xs text-center text-concrete tracking-widest uppercase mt-4">
          Free Worldwide Shipping on all orders over $200.
        </p>
      </div>
    </div>
  );
}
