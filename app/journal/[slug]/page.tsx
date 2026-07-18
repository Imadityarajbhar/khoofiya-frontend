import { getPostBySlug } from "@/lib/api/v1/content/posts";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Not Found' };
  
  return {
    title: `${post.title} | Journal | KHOOFIYA`,
    description: post.excerpt?.replace(/<[^>]+>/g, '') || post.title,
  };
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.featuredImage?.node?.sourceUrl ? [post.featuredImage.node.sourceUrl] : [],
    datePublished: post.date,
    dateModified: post.date,
    author: [{
      "@type": "Organization",
      name: "KHOOFIYA Engineering",
      url: "https://khoofiya.com"
    }]
  };

  return (
    <main className="flex min-h-screen flex-col bg-background pt-32 pb-24 text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="w-full max-w-4xl px-6 md:px-12 mx-auto flex flex-col gap-12">
        
        {/* Header */}
        <header className="flex flex-col gap-6 text-center items-center">
          <span className="text-xs text-concrete tracking-[0.2em] uppercase font-bold">
            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight uppercase leading-tight">
            {post.title}
          </h1>
        </header>

        {/* Featured Image */}
        {post.featuredImage?.node?.sourceUrl && (
          <div className="relative aspect-video w-full bg-outline overflow-hidden my-8">
            <Image 
              src={post.featuredImage.node.sourceUrl} 
              alt={post.featuredImage.node.altText || post.title} 
              fill 
              priority
              className="object-cover grayscale"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose-custom [&>p]:text-base [&>p]:text-concrete [&>p]:leading-relaxed [&>p]:tracking-wide [&>h2]:text-2xl [&>h2]:font-medium [&>h2]:uppercase [&>h2]:mt-12 [&>h2]:mb-6 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:text-concrete [&>blockquote]:border-l-2 [&>blockquote]:border-foreground [&>blockquote]:pl-4 [&>blockquote]:italic mx-auto w-full font-medium uppercase"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {/* Footer */}
        <footer className="mt-24 border-t border-outline pt-12 flex justify-center">
          <Link href="/journal" className="text-xs uppercase tracking-widest font-bold hover:text-concrete transition-colors flex items-center gap-2">
            ← Back To Journal
          </Link>
        </footer>

      </article>
    </main>
  );
}
