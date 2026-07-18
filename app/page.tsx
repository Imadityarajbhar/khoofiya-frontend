import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/api/v1/commerce/products";
import Image from "next/image";

export const revalidate = 3600; // Cache for 1 hour

export default async function Home() {
  // Fetch real products from WooCommerce Store API
  const products = await getProducts().catch(() => []);
  
  // Take the first 4 products for the Campaign feature
  const featuredProducts = products.slice(0, 4);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Cinematic Hero */}
      <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
        <div className="z-10 flex flex-col items-center gap-8 text-center px-4">
          <h1 className="text-[12vw] font-medium leading-none tracking-[-0.05em] uppercase text-foreground mix-blend-difference">
            KHOOFIYA
          </h1>
          <p className="max-w-md text-sm uppercase tracking-[0.2em] font-medium text-concrete">
            Not Everything Is Meant To Be Seen
          </p>
          <div className="mt-8 flex gap-6">
            <Button variant="default" size="lg">Explore Collection</Button>
            <Button variant="ghost" size="lg">The Manifesto</Button>
          </div>
        </div>
        
        {/* Placeholder for Hero Video/Image overlay - pure brutalist for now */}
        <div className="absolute inset-0 z-0 bg-[#0a0a0a] opacity-50"></div>
      </section>

      {/* Featured Campaign Objects */}
      <section className="w-full px-6 py-32 md:px-12 lg:px-24">
        <div className="mb-16 flex items-end justify-between border-b border-outline pb-8">
          <h2 className="text-3xl font-medium tracking-tight uppercase">
            Collection 01
          </h2>
          <span className="text-sm uppercase tracking-widest text-concrete">
            [ Objects ]
          </span>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="py-24 text-center text-concrete uppercase tracking-widest text-sm border border-outline">
            No objects found. Ensure QikInk products are published.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <a key={product.id} href={`/product/${product.slug}`} className="group block cursor-pointer">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-outline">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale hover:grayscale-0"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-concrete uppercase">No Image</div>
                  )}
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <h3 className="text-sm font-medium uppercase tracking-wide">{product.name}</h3>
                  <p className="text-sm text-concrete">{product.price_html ? <span dangerouslySetInnerHTML={{ __html: product.price_html }} /> : `$${(parseInt(product.price) / 100).toFixed(2)}`}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Footer / Credits */}
      <footer className="w-full border-t border-outline px-6 py-12 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="text-xs font-medium uppercase tracking-widest text-concrete">
          © {new Date().getFullYear()} KHOOFIYA WORLDWIDE
        </div>
        <div className="flex gap-8 text-xs font-medium uppercase tracking-widest">
          <a href="/shipping" className="hover:text-foreground text-concrete transition-colors">Shipping</a>
          <a href="/returns" className="hover:text-foreground text-concrete transition-colors">Returns</a>
          <a href="/terms" className="hover:text-foreground text-concrete transition-colors">Terms</a>
        </div>
      </footer>
    </main>
  );
}
