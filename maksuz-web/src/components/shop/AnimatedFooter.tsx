"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/style-guide", label: "Style Guide" },
  { href: "/license", label: "License" },
  { href: "/changelog", label: "Changelog" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

const socialLinks = [
  { name: "facebook", href: "https://www.facebook.com/maksuzkutak" },
  { name: "instagram", href: "https://www.instagram.com/maksuz_ba" },
  { name: "tiktok", href: "https://www.tiktok.com/@maksuz_kutak" },
  { name: "linkedin", href: "https://www.linkedin.com/company/o-s-p-d-maksuz/" },
];

export function AnimatedFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate logo on scroll
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.5, y: -30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );

    // Animate columns on scroll
    if (columnsRef.current) {
      const columns = columnsRef.current.children;
      gsap.fromTo(
        columns,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: columnsRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return (
    <footer ref={footerRef} className="bg-brand-orange text-white">
      {/* Logo Section */}
      <div className="flex justify-center -mb-8 relative z-10">
        <div
          ref={logoRef}
          className="bg-brand-orange rounded-full p-6 border-4 border-white shadow-lg"
        >
          <Image src="/next.svg" alt="Maksuz" width={60} height={60} className="brightness-0 invert" />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-screen-extended mx-auto px-6 pt-16 pb-8">
        <div ref={columnsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-oswald font-bold uppercase text-lg mb-4">BRZI LINKOVI</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-poppins text-sm hover:underline opacity-90 hover:opacity-100 transition-opacity"
                >
                  &gt; {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-oswald font-bold uppercase text-lg mb-4">KONTAKTIRAJTE NAS</h3>
            <div className="space-y-3 font-poppins text-sm">
              <div className="flex items-start gap-2">
                <span>📍</span>
                <p className="opacity-90">
                  17 West 24th St New York,
                  <br />
                  NY 10010
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <p className="opacity-90">877 - 485 - 0700</p>
              </div>
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <p className="opacity-90">hello123@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-oswald font-bold uppercase text-lg mb-4">DRUŠTVENE MREŽE</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 duration-200"
                >
                  <span className="sr-only">{social.name}</span>
                  {social.name === "facebook" && (
                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  )}
                  {social.name === "instagram" && (
                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path
                        d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                  {social.name === "tiktok" && (
                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  )}
                  {social.name === "linkedin" && (
                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="font-poppins text-sm opacity-90">
            © Powered by Maksuz DOO created by CikoCode
          </p>
        </div>
      </div>
    </footer>
  );
}
