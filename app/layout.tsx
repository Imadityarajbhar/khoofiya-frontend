import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KHOOFIYA | Not Everything Is Meant To Be Seen",
  description: "The global digital flagship of KHOOFIYA. Premium contemporary streetwear.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${interTight.variable} font-sans antialiased bg-[#111111] text-[#F5F5F5] selection:bg-[#F5F5F5] selection:text-[#111111]`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col selection:bg-[#F5F5F5] selection:text-[#111111]">
        {children}
      </body>
    </html>
  );
}
