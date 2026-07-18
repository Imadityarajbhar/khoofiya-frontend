"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "@/lib/api/v1/commerce/cart";
import { Button } from "@/components/ui/button";

export function AddToCartButton({ productId, inStock }: { productId: number; inStock: boolean }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await addToCart({ id: productId, quantity: 1 });
    },
    onSuccess: () => {
      // Refresh the cart query across the whole app
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // TODO: Open cart drawer
    },
  });

  return (
    <Button 
      size="lg" 
      disabled={!inStock || mutation.isPending} 
      className="w-full"
      onClick={() => mutation.mutate()}
    >
      {mutation.isPending ? "Adding..." : (inStock ? "Add To Cart" : "Archived")}
    </Button>
  );
}
