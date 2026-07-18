"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, removeCartItem } from "@/lib/api/v1/commerce/cart";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => await getCart(),
  });

  const removeMutation = useMutation({
    mutationFn: async (key: string) => await removeCartItem(key),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-background pt-32 pb-24 px-6 md:px-12 lg:px-24 text-foreground uppercase tracking-widest text-sm">
        Loading Cart...
      </main>
    );
  }

  const items = cart?.items || [];

  return (
    <main className="flex min-h-screen flex-col bg-background pt-32 pb-24">
      <div className="w-full px-6 md:px-12 lg:px-24 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight uppercase border-b border-outline pb-8">
            Your Objects [{items.length}]
          </h1>

          {items.length === 0 ? (
            <div className="py-16 text-concrete uppercase tracking-widest text-sm">
              Your cart is empty. <Link href="/archive" className="text-foreground underline">Return to archive.</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {items.map((item: any) => (
                <div key={item.key} className="flex gap-6 border-b border-outline pb-8">
                  <div className="relative w-24 h-32 bg-outline overflow-hidden shrink-0">
                    {item.images?.[0] && (
                      <Image 
                        src={item.images[0].src} 
                        alt={item.name} 
                        fill 
                        className="object-cover grayscale" 
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-between flex-grow">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <Link href={`/product/${item.permalink?.split('/').slice(-2, -1)[0] || ''}`} className="text-sm font-semibold uppercase tracking-wide hover:text-concrete transition-colors">
                          {item.name}
                        </Link>
                        {item.item_data?.map((attr: any) => (
                          <span key={attr.key} className="text-xs text-concrete uppercase tracking-widest">
                            {attr.key}: {attr.value}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-medium tracking-widest">
                        ${(parseInt(item.totals.line_total) / 100).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-end mt-4">
                      <span className="text-xs uppercase tracking-widest text-concrete">
                        Qty: {item.quantity}
                      </span>
                      <button 
                        onClick={() => removeMutation.mutate(item.key)}
                        disabled={removeMutation.isPending}
                        className="text-xs uppercase tracking-widest text-concrete hover:text-foreground transition-colors border-b border-transparent hover:border-foreground"
                      >
                        {removeMutation.isPending ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 flex flex-col gap-8 bg-foreground text-background p-8">
            <h2 className="text-xl font-medium tracking-tight uppercase border-b border-background/20 pb-4">
              Summary
            </h2>
            
            <div className="flex flex-col gap-4 text-sm font-medium tracking-widest uppercase border-b border-background/20 pb-8">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${(parseInt(cart?.totals?.total_items || "0") / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-background/70">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold tracking-widest uppercase">
              <span>Total</span>
              <span>${(parseInt(cart?.totals?.total_price || "0") / 100).toFixed(2)}</span>
            </div>

            <Link href="/api/checkout/redirect" className="w-full mt-4">
              <Button size="lg" disabled={items.length === 0} className="w-full bg-background text-foreground hover:bg-background/90 rounded-none border-none">
                Proceed To Checkout
              </Button>
            </Link>
            
            <p className="text-[10px] text-center tracking-widest uppercase text-background/50">
              Secure checkout provided by WooCommerce.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
