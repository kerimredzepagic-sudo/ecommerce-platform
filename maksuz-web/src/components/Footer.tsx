import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const quickLinks = [
  { href: "/", label: "Početna" },
  { href: "/shop", label: "Webshop" },
  { href: "/o-nama", label: "O Nama" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/blog", label: "Blog" },
  { href: "/api-terapija", label: "Api Terapija" },
  { href: "/poklon-paketi", label: "Poklon Paketi" },
  { href: "/faq", label: "FAQ" },
];

const helpLinks = [
  { href: "/pomoc/opci-uslovi", label: "Opći uslovi poslovanja" },
  { href: "/pomoc/privatnost", label: "Pravila privatnosti" },
  { href: "/pomoc/kako-naruciti", label: "Kako naručiti" },
  { href: "/pomoc/narucivanje-telefonom", label: "Narudžbe telefonom" },
  { href: "/register", label: "Registracija" },
];

const paymentLinks = [
  { href: "/pomoc/sigurnost", label: "Sigurnost" },
  { href: "/pomoc/sigurno-placanje", label: "Sigurno plaćanje" },
  { href: "/pomoc/reklamacije", label: "Reklamacije i povrat" },
  { href: "/pomoc/preuzimanje", label: "Lično preuzimanje" },
  { href: "/pomoc/dostava", label: "Dostava" },
];

const socialLinks = [
  { name: "facebook", href: "https://www.facebook.com/maksuzkutak" },
  { name: "instagram", href: "https://www.instagram.com/maksuz_ba" },
  { name: "tiktok", href: "https://www.tiktok.com/@maksuz_kutak" },
  { name: "linkedin", href: "https://www.linkedin.com/company/o-s-p-d-maksuz/" },
];

export function Footer({ extended = false }: { extended?: boolean }) {
  return (
    <div className="w-full flex justify-center rounded-60 mt-16 md:mt-32 mb-[60px] px-4 md:px-0">
      <footer
        className={cn(
          "w-full max-w-screen bg-brand-orange text-white rounded-3xl md:rounded-60",
          extended ? "max-w-screen-extended" : "max-w-screen"
        )}
      >
        {/* Logo Section - Centered */}
        <div className="flex justify-center pt-6 md:pt-8 pb-4">
            <Image
            src="/MAKSUZ_white_logo.png"
              alt="Maksuz"
            width={80}
            height={80}
            className="w-16 h-16 md:w-20 md:h-20"
            />
        </div>

        {/* Main Footer Content */}
        <div className="w-full flex flex-col items-center justify-center px-4 md:px-8 py-6 md:py-8">
          {/* Five Column Layout - Stacks on mobile */}
          <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6 lg:gap-8 mb-8 max-w-6xl mx-auto">
            {/* Quick Links Column */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-oswald font-bold uppercase text-sm md:text-base mb-4 text-center md:text-left">
                Brzi Linkovi
              </h3>
              <div className="flex flex-col gap-2">
                {quickLinks.slice(0, 4).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-poppins text-xs md:text-sm hover:underline opacity-90 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Links Column */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-oswald font-bold uppercase text-sm md:text-base mb-4 text-center md:text-left">
                Pomoć Korisnicima
              </h3>
              <div className="flex flex-col gap-2">
                {helpLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-poppins text-xs md:text-sm hover:underline opacity-90 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Payment & Delivery Column */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-oswald font-bold uppercase text-sm md:text-base mb-4 text-center md:text-left">
                Plaćanje i Dostava
              </h3>
              <div className="flex flex-col gap-2">
                {paymentLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-poppins text-xs md:text-sm hover:underline opacity-90 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Column */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-oswald font-bold uppercase text-sm md:text-base mb-4 text-center md:text-left">
                Kontakt
              </h3>
              <div className="flex flex-col gap-3 font-poppins text-xs md:text-sm">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="opacity-90 text-xs md:text-sm">
                    Hamdije Čemerlića 49, Novo Sarajevo
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <p className="opacity-90">+387 61 399 366</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="opacity-90">info@maksuz.ba</p>
                </div>
              </div>
            </div>

            {/* Social Media Column */}
            <div className="flex flex-col items-center md:items-start col-span-2 md:col-span-1">
              <h3 className="font-oswald font-bold uppercase text-sm md:text-base mb-4 text-center md:text-left">
                Društvene Mreže
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-black flex items-center justify-center hover:bg-black/80 transition-colors"
                    aria-label={social.name}
                  >
                    {social.name === "facebook" && (
                      <svg
                        width="20"
                        height="20"
                        className="w-5 h-5 min-w-[20px] min-h-[20px]"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    )}
                    {social.name === "instagram" && (
                      <svg
                        width="20"
                        height="20"
                        className="w-5 h-5 min-w-[20px] min-h-[20px]"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3.5"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
                      </svg>
                    )}
                    {social.name === "tiktok" && (
                      <svg
                        width="20"
                        height="20"
                        className="w-5 h-5 min-w-[20px] min-h-[20px]"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                    )}
                    {social.name === "linkedin" && (
                      <svg
                        width="20"
                        height="20"
                        className="w-5 h-5 min-w-[20px] min-h-[20px]"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
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

          {/* Payment Methods Section */}
          <div className="w-full border-t border-white/20 pt-6 pb-6">
            <p className="font-oswald font-bold uppercase text-sm text-center mb-4">
              Sigurni Načini Plaćanja
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
              <a
                href="https://www.visa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg p-2 h-10 flex items-center hover:shadow-lg transition-shadow"
              >
                <Image
                  src="/maksuz_payments/visa.svg"
                  alt="Visa"
                  width={50}
                  height={32}
                  className="h-6 w-auto object-contain"
                />
              </a>
              <a
                href="https://www.mastercard.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg p-2 h-10 flex items-center hover:shadow-lg transition-shadow"
              >
                <Image
                  src="/maksuz_payments/mastercard.svg"
                  alt="Mastercard"
                  width={50}
                  height={32}
                  className="h-6 w-auto object-contain"
                />
              </a>
              <a
                href="https://www.mastercard.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg p-2 h-10 flex items-center hover:shadow-lg transition-shadow"
              >
                <Image
                  src="/maksuz_payments/maestro.svg"
                  alt="Maestro"
                  width={50}
                  height={32}
                  className="h-6 w-auto object-contain"
                />
              </a>
              <a
                href="https://monri.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg p-2 h-10 flex items-center hover:shadow-lg transition-shadow"
              >
                <Image
                  src="/maksuz_payments/pay-web-monri.svg"
                  alt="Monri"
                  width={60}
                  height={32}
                  className="h-6 w-auto object-contain"
                />
              </a>
              <a
                href="https://www.visa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg p-2 h-10 flex items-center hover:shadow-lg transition-shadow"
              >
                <Image
                  src="/maksuz_payments/visa-secure.svg"
                  alt="Visa Secure"
                  width={50}
                  height={32}
                  className="h-6 w-auto object-contain"
                />
              </a>
              <a
                href="https://www.mastercard.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg p-2 h-10 flex items-center hover:shadow-lg transition-shadow"
              >
                <Image
                  src="/maksuz_payments/ID-check.svg"
                  alt="Mastercard ID Check"
                  width={50}
                  height={32}
                  className="h-6 w-auto object-contain"
                />
              </a>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="w-full border-t border-white/20 pt-6 text-center">
            <p className="font-poppins text-xs md:text-sm opacity-90">
              © {new Date().getFullYear()} Maksuz D.O.O. | Sva prava zadržana | Powered by ClixCode
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
