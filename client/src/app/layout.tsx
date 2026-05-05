import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/app/providers/Providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "ShopKit - E-commerce Platform",
    template: "%s | ShopKit",
  },
  description: "ShopKit is a modern e-commerce SaaS platform for small and medium businesses in Bosnia and Herzegovina.",
  keywords: ["shopkit", "ecommerce", "online store", "web shop", "bosnia"],
  authors: [{ name: "ShopKit" }],
  creator: "ShopKit",
};

export const viewport: Viewport = {
  themeColor: "#ED5926",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bs" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
