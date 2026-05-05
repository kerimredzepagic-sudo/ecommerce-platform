"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { MenuIcon } from "@/components/icons";

// Navigation items
const navLinks = [
  { href: "/", label: "POČETNA" },
  { href: "/o-nama", label: "O NAMA" },
  { href: "/nasi-proizvodi", label: "NAŠI PROIZVODI" },
  { href: "/api-terapija", label: "API TERAPIJA" },
  { href: "/proces-proizvodnje", label: "PROCES PROIZVODNJE" },
  { href: "/blog", label: "BLOG" },
  { href: "/kontakt", label: "KONTAKT" },
];

interface BlogHeroProps {
  title?: string;
  subtitle?: string;
}

export function BlogHero({ 
  title = "Tu smo za sva vaša pitanja, sugestije i narudžbe",
  subtitle = "KONTAKTIRAJTE NAS"
}: BlogHeroProps) {
  const pathname = usePathname();
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(href + "/");
  };

  useEffect(() => {
    // Animate navbar
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );

    // Animate hero content
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out" }
    );
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-[400px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/ajvar.png"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Decorative Text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
        <p className="font-serif text-4xl italic text-white/30 leading-relaxed text-right">
          &ldquo;Pažnja je luksuz.
          <br />
          Ovo je poklon koji
          <br />
          to razumije.&rdquo;
        </p>
      </div>

      {/* Navigation */}
      <nav
        ref={navRef}
        className="relative z-20 w-full bg-transparent border-b border-white/20"
      >
        <div className="flex h-20 items-center justify-between mx-auto max-w-screen-extended px-6">
          {/* Logo */}
          <Link href="/" className="font-oswald text-2xl font-bold">
            <div className="relative w-12 h-12">
              <Image
                src="/shopkitlogo.png"
                alt="ShopKit"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex gap-4 xl:gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-oswald text-xs xl:text-sm font-medium uppercase transition-colors relative",
                  isActive(link.href)
                    ? "text-brand-orange"
                    : "text-white hover:text-brand-orange"
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-orange" />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 7H18L17 14H7L6 7ZM6 7L5 3H3M9 19C9.55228 19 10 18.5523 10 18C10 17.4477 9.55228 17 9 17C8.44772 17 8 17.4477 8 18C8 18.5523 8.44772 19 9 19ZM17 19C17.5523 19 18 18.5523 18 18C18 17.4477 17.5523 17 17 17C16.4477 17 16 17.4477 16 18C16 18.5523 16.4477 19 17 19Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Phone */}
            <span className="font-oswald text-sm font-medium text-white hidden md:block">
              +387 62 200 088
            </span>

            {/* Button */}
            <Button className="font-oswald uppercase" variant="brand">
              MOJ NALOG
            </Button>

            {/* Mobile Menu */}
            <button className="lg:hidden rounded-lg p-2 hover:bg-white/10" aria-label="Menu">
              <MenuIcon className="text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div ref={contentRef} className="relative z-10 max-w-screen-extended mx-auto px-6 py-16 flex items-center">
        {/* Product Image */}
        <div className="hidden md:block mr-8">
          <Image
            src="/productimage.png"
            alt="Product"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>

        {/* Text Content */}
        <div className="text-white max-w-xl">
          <p className="font-oswald text-sm uppercase tracking-widest text-brand-orange mb-2">
            {subtitle}
          </p>
          <h1 className="font-oswald text-3xl md:text-4xl font-bold leading-tight mb-6">
            {title}
          </h1>
          <div className="flex flex-wrap gap-3">
            <Button className="font-oswald uppercase" variant="brand">
              NAŠA PRIČA
            </Button>
            <Button
              variant="outline"
              className="font-oswald uppercase border-white text-white hover:bg-white hover:text-gray-900"
            >
              WEBSHOP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

