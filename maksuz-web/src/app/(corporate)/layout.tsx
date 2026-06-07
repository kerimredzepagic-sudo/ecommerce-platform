import { MainNavbar } from "@/components/shared/MainNavbar";
import { corporateNavItems } from "@/config/navigation";
import { Footer } from "@/components";

export default function CorporateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Fixed Navbar - stays at top when scrolling */}
      <MainNavbar navItems={corporateNavItems} logoHref="/" />
      {/* Main Content - No padding, content starts at top (hero goes under navbar) */}
      <main className="min-h-screen">{children}</main>
      {/* Footer */}
      <Footer />
    </>
  );
}
