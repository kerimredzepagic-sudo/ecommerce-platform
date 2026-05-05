import { Footer } from "@/components/shop";
import { ShopNavbar } from "@/components/shared/ShopNavbar";

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
