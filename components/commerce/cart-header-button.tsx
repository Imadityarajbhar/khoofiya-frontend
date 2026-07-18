"use client";

import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/lib/api/v1/commerce/cart";
import Link from "next/link";

export function CartHeaderButton() {
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => await getCart(),
  });

  const itemCount = cart?.item_count || 0;

  return (
    <Link href="/cart" className="hover:opacity-50 transition-opacity whitespace-nowrap">
      Cart [{itemCount}]
    </Link>
  );
}
