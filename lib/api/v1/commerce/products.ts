// khoofiya-frontend/lib/api/v1/commerce/products.ts
import { fetchCommerce } from '../shared/fetcher';

export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_html: string;
  on_sale: boolean;
  is_purchasable: boolean;
  is_in_stock: boolean;
  images: Array<{
    id: number;
    src: string;
    thumbnail: string;
    srcset: string;
    sizes: string;
    name: string;
    alt: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    taxonomy: string;
    has_variations: boolean;
    terms: Array<{ id: number; name: string; slug: string }>;
  }>;
}

/**
 * Fetches products from WooCommerce Store API
 */
export async function getProducts(): Promise<Product[]> {
  // Uses WooCommerce Store API v1 /products endpoint
  return fetchCommerce<Product[]>('/products');
}

/**
 * Fetches a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await fetchCommerce<Product[]>(`/products?slug=${slug}`);
  return products.length > 0 ? products[0] : null;
}
