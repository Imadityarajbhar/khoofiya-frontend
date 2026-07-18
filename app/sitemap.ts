import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api/v1/commerce/products';
import { getPosts } from '@/lib/api/v1/content/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://khoofiya.com';

  // Fetch dynamic routes
  const [products, posts] = await Promise.all([
    getProducts().catch(() => []),
    getPosts().catch(() => []),
  ]);

  // Map products to sitemap
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Map journal entries to sitemap
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/journal/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  return [...staticRoutes, ...productUrls, ...postUrls];
}
