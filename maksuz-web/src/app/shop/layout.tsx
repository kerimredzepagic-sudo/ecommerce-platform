import { Footer } from "@/components";
import { ShopNavbar } from "@/components/shared/ShopNavbar";
import { AnimatedFooter } from "@/components/shop";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Shop Navbar - variant changes based on route */}
      <ShopNavbar />
      {/* Main Content */}
      <main className="min-h-screen">{children}</main>
      {/* Shop Footer */}
      <Footer />
    </>
  );
}
