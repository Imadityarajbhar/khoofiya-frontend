import { getPosts } from "@/lib/api/v1/content/posts";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600;

export const metadata = {
  title: "Journal | KHOOFIYA",
  description: "Notes, lookbooks, and thoughts from KHOOFIYA Engineering.",
};

export default async function JournalPage() {
  const posts = await getPosts().catch(() => []);

  return (
    <main className="flex min-h-screen flex-col bg-background pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <div className="mb-16 flex items-end justify-between border-b border-outline pb-12">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight uppercase">
          Journal
        </h1>
        <span className="text-sm uppercase tracking-widest text-concrete whitespace-nowrap">
          [ {posts.length} Entries ]
        </span>
      </div>

      {posts.length === 0 ? (
        <div className="py-32 text-center text-concrete uppercase tracking-widest text-sm border border-outline">
          No entries found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {posts.map((post) => (
            <Link key={post.id} href={`/journal/${post.slug}`} className="group flex flex-col gap-6 cursor-pointer">
              <div className="relative aspect-video w-full bg-outline overflow-hidden">
                {post.featuredImage?.node?.sourceUrl ? (
                  <Image 
                    src={post.featuredImage.node.sourceUrl} 
                    alt={post.featuredImage.node.altText || post.title} 
                    fill 
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 grayscale group-hover:grayscale-0"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-concrete uppercase">
                    KHOOFIYA TEXT
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-concrete tracking-widest uppercase font-bold">
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <h2 className="text-xl font-medium uppercase tracking-wide group-hover:text-concrete transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <div 
                  className="text-sm text-concrete line-clamp-3 leading-relaxed tracking-wide [&>p]:m-0"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
