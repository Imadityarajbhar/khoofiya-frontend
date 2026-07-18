"use server";

import { cookies } from "next/headers";

const CART_TOKEN_COOKIE = "khoofiya_cart_token";

/**
 * Helper to fetch from WooCommerce Store API Cart endpoints
 * Manages the Cart-Token securely via HTTP-only cookies in Next.js
 */
async function fetchCartAPI(endpoint: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", body?: any) {
  const wcUrl = process.env.WC_STORE_API_URL;
  if (!wcUrl) throw new Error("WC_STORE_API_URL is missing.");

  const cookieStore = await cookies();
  const cartToken = cookieStore.get(CART_TOKEN_COOKIE)?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (cartToken) {
    headers["Cart-Token"] = cartToken;
  }

  const res = await fetch(`${wcUrl}${endpoint}`, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
    cache: "no-store",
  });

  // Check if WooCommerce sent back a new or updated Cart-Token
  const returnedToken = res.headers.get("Cart-Token");
  if (returnedToken && returnedToken !== cartToken) {
    cookieStore.set(CART_TOKEN_COOKIE, returnedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Cart API Error:", errorData);
    throw new Error(`Cart API failed: ${errorData.message || res.statusText}`);
  }

  return res.json();
}

/**
 * Get the current cart state
 */
export async function getCart() {
  try {
    return await fetchCartAPI("/cart");
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

/**
 * Add an item to the cart
 */
export async function addToCart(payload: any) {
  return await fetchCartAPI("/cart/add-item", "POST", payload);
}

/**
 * Remove an item from the cart
 */
export async function removeCartItem(key: string) {
  return await fetchCartAPI("/cart/remove-item", "POST", {
    key,
  });
}
