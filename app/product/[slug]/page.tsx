import { getProductBySlug } from "@/lib/api/v1/commerce/products";
import { ProductForm } from "@/components/commerce/product-form";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 3600; // Cache for 1 hour

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Not Found' };
  
  return {
    title: `${product.name} | KHOOFIYA`,
    description: product.short_description?.replace(/<[^>]+>/g, '') || product.name,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  // Filter out variations / attributes to display Size selector
  const sizeAttribute = product.attributes?.find(attr => attr.name.toLowerCase() === 'size');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.[0]?.src,
    description: product.short_description?.replace(/<[^>]+>/g, '') || product.name,
    sku: product.sku || product.id.toString(),
    offers: {
      "@type": "Offer",
      url: `https://khoofiya.com/product/${product.slug}`,
      priceCurrency: "INR",
      price: (parseInt(product.price) / 100).toFixed(2),
      availability: product.is_in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="flex min-h-screen flex-col bg-background pt-32 pb-24 text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full px-6 md:px-12 lg:px-24 mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-6">
          {product.images && product.images.length > 0 ? (
            product.images.map((img, idx) => (
              <div key={img.id} className="relative aspect-[3/4] w-full bg-outline overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt || `${product.name} - Image ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  className="object-cover"
                />
              </div>
            ))
          ) : (
            <div className="aspect-[3/4] w-full bg-outline flex items-center justify-center text-concrete uppercase tracking-widest text-sm">
              No images available
            </div>
          )}
        </div>

        {/* Right Column: Product Details (Sticky) */}
        <div className="relative">
          <div className="md:sticky md:top-32 flex flex-col gap-8">
            <div className="flex flex-col gap-4 border-b border-outline pb-8">
              <h1 className="text-3xl md:text-5xl font-medium tracking-tight uppercase">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm font-medium tracking-widest text-concrete">
                {product.price_html ? (
                  <span dangerouslySetInnerHTML={{ __html: product.price_html }} className="[&>del]:line-through [&>del]:opacity-50 [&>ins]:no-underline [&>ins]:text-foreground uppercase" />
                ) : (
                  <span>${(parseInt(product.price) / 100).toFixed(2)}</span>
                )}
                {!product.is_in_stock && (
                  <span className="text-background bg-foreground px-2 py-1 text-[10px] uppercase font-bold">Sold Out</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div 
              className="[&>p]:text-sm [&>p]:text-concrete [&>p]:leading-relaxed [&>p]:tracking-wide max-w-none uppercase font-medium [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:text-sm [&>ul]:text-concrete"
              dangerouslySetInnerHTML={{ __html: product.description || product.short_description }} 
            />

            {/* Interactive Product Form (Size + Add To Cart) */}
            <ProductForm product={product} />
            
            {/* Metadata (Accordions in a later phase, flat for now) */}
            <div className="mt-8 flex flex-col gap-4 border-t border-outline pt-8">
              <div className="flex justify-between text-xs tracking-widest uppercase border-b border-outline pb-4">
                <span className="text-concrete">SKU</span>
                <span>{product.sku || "N/A"}</span>
              </div>
              <div className="flex justify-between text-xs tracking-widest uppercase border-b border-outline pb-4">
                <span className="text-concrete">Origin</span>
                <span>Crafted by QikInk</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
