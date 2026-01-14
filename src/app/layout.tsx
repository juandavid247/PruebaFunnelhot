import type { Metadata } from "next";
import { Roboto, Roboto_Slab, Figtree } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ['400', '500', '600'],
  variable: '--font-roboto'
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ['400'],
  variable: '--font-roboto-slab'
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ['400', '500', '600'],
  variable: '--font-figtree'
});

export const metadata: Metadata = {
  title: "Funnelhot AI Assistants",
  description: "Manage your AI assistants efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${robotoSlab.variable} ${figtree.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
