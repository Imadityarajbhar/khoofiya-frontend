import { getProducts } from "@/lib/api/v1/commerce/products";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600; // Cache for 1 hour

export const metadata = {
  title: "Archive | KHOOFIYA",
  description: "The complete archive of KHOOFIYA objects.",
};

export default async function ArchivePage() {
  // Fetch all products for the Archive
  const products = await getProducts().catch(() => []);

  return (
    <main className="flex min-h-screen flex-col bg-background pt-32 pb-24">
      <div className="w-full px-6 md:px-12 lg:px-24">
        {/* Archive Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between border-b border-outline pb-12 gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-6xl font-medium tracking-tight uppercase">
              The Archive
            </h1>
            <p className="max-w-md text-sm text-concrete">
              A curated catalog of all KHOOFIYA objects. Not everything remains in circulation forever.
            </p>
          </div>
          <span className="text-sm uppercase tracking-widest text-concrete whitespace-nowrap">
            [ {products.length} Objects ]
          </span>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="py-32 text-center text-concrete uppercase tracking-widest text-sm border border-outline">
            The archive is currently empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="group block cursor-pointer">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-outline">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-concrete uppercase">No Image</div>
                  )}
                  
                  {/* Status Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {!product.is_in_stock && (
                      <span className="bg-foreground text-background text-[10px] uppercase font-bold tracking-widest px-2 py-1">
                        Archived
                      </span>
                    )}
                    {product.on_sale && (
                      <span className="bg-background text-foreground text-[10px] uppercase font-bold tracking-widest px-2 py-1">
                        Sale
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col gap-1">
                  <h3 className="text-sm font-semibold uppercase tracking-wide group-hover:text-concrete transition-colors">{product.name}</h3>
                  <div className="flex gap-4 text-xs font-medium text-concrete">
                    {product.price_html ? (
                      <span dangerouslySetInnerHTML={{ __html: product.price_html }} className="[&>del]:line-through [&>del]:opacity-50 [&>ins]:no-underline [&>ins]:text-foreground" />
                    ) : (
                      <span>${(parseInt(product.price) / 100).toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
