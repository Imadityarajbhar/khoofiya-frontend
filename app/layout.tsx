import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import Link from "next/link";
import Providers from "./providers";
import { CartHeaderButton } from "@/components/commerce/cart-header-button";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | KHOOFIYA",
    default: "KHOOFIYA | Not Everything Is Meant To Be Seen",
  },
  description: "A premium contemporary streetwear clothing brand.",
  openGraph: {
    title: "KHOOFIYA",
    description: "Not Everything Is Meant To Be Seen.",
    url: "https://khoofiya.com",
    siteName: "KHOOFIYA",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KHOOFIYA",
    description: "Not Everything Is Meant To Be Seen.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${interTight.variable} font-sans antialiased bg-[#111111] text-[#F5F5F5] selection:bg-[#F5F5F5] selection:text-[#111111]`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col selection:bg-[#F5F5F5] selection:text-[#111111]">
        <Providers>
          <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 mix-blend-difference text-white">
            <Link href="/" className="text-xl font-semibold uppercase tracking-tight">KHOOFIYA</Link>
            <nav className="flex gap-8 text-xs font-semibold uppercase tracking-widest">
              <Link href="/archive" className="hover:opacity-50 transition-opacity">Archive</Link>
              <Link href="/journal" className="hover:opacity-50 transition-opacity">Journal</Link>
              <CartHeaderButton />
            </nav>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
