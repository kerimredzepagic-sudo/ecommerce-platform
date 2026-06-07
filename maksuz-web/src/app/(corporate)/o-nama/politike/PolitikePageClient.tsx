"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Shield,
  Lock,
  Cookie,
  Scale,
  Leaf,
  ArrowRight,
  Mail,
  Award,
  CheckCircle,
} from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const policies = [
  {
    icon: Lock,
    title: "Politika Privatnosti",
    description:
      "Kako prikupljamo, koristimo i štitimo vaše osobne podatke. Vaša privatnost nam je prioritet.",
    lastUpdated: "Januar 2026.",
    href: "/politika-privatnosti.pdf",
    isPage: true,
    pageHref: "/politika-privatnosti",
  },
  {
    icon: Cookie,
    title: "Politika Kolačića",
    description:
      "Informacije o kolačićima koje koristimo na našoj web stranici i kako njima upravljati.",
    lastUpdated: "Januar 2026.",
    href: "/politika-kolacica.pdf",
    isPage: true,
    pageHref: "/politika-kolacica",
  },
  {
    icon: Scale,
    title: "Uslovi Korištenja",
    description:
      "Pravila i uslovi korištenja naše web stranice i online trgovine.",
    lastUpdated: "Decembar 2025.",
    href: "/uslovi-koristenja.pdf",
    isPage: true,
    pageHref: "/uslovi-koristenja",
  },
  {
    icon: Shield,
    title: "Politika Kvalitete",
    description:
      "Naša posvećenost kvaliteti proizvoda, certifikacije i standardi koje pratimo.",
    lastUpdated: "Novembar 2025.",
    href: "/politika-kvalitete.pdf",
    isPage: false,
  },
  {
    icon: Leaf,
    title: "Politika Zaštite Okoliša",
    description:
      "Naše obaveze prema zaštiti okoliša, održivosti i smanjenju ekološkog otiska.",
    lastUpdated: "Oktobar 2025.",
    href: "/politika-okolis.pdf",
    isPage: false,
  },
];

const legalInfo = [
  { label: "Puni naziv", value: "Maksuz d.o.o." },
  { label: "Sjedište", value: "Hamdije Ćemerlića 49, 71000 Sarajevo" },
  { label: "ID broj", value: "1234567890123" },
  { label: "PDV broj", value: "123456789012" },
  { label: "Transakcijski račun", value: "1234567890123456 (Raiffeisen Bank)" },
  { label: "Nadležni sud", value: "Općinski sud u Sarajevu" },
];

const compliance = [
  {
    title: "GDPR Usklađenost",
    description: "Potpuno usklađeni sa Općom uredbom o zaštiti podataka EU.",
  },
  {
    title: "ISO 22000",
    description: "Certificirani prema međunarodnom standardu za sigurnost hrane.",
  },
  {
    title: "HACCP",
    description: "Implementiran sistem analize opasnosti i kritičnih kontrolnih tačaka.",
  },
];

export default function PolitikePageClient() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const policiesRef = useRef<HTMLElement>(null);
  const legalRef = useRef<HTMLElement>(null);
  const complianceRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Policies section animation
    if (policiesRef.current) {
      const header = policiesRef.current.querySelector(".policies-header");
      const cards = policiesRef.current.querySelectorAll(".policy-card");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: policiesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: policiesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Legal section animation
    if (legalRef.current) {
      const header = legalRef.current.querySelector(".legal-header");
      const content = legalRef.current.querySelector(".legal-content");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: legalRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        content,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: legalRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Compliance section animation
    if (complianceRef.current) {
      const header = complianceRef.current.querySelector(".compliance-header");
      const cards = complianceRef.current.querySelectorAll(".compliance-card");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: complianceRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.3,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: complianceRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // CTA animation
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current.querySelector(".cta-content"),
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative">
      {/* Hero Section */}
      <HeroSection image="/Garden.svg" className="h-[250px] md:h-[350px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Pravne Informacije"
            title="Naše Politike"
            description="Transparentnost u poslovanju."
            textCenter
          />
        </div>
      </HeroSection>

      {/* Policies Grid */}
      <section ref={policiesRef} className="py-12 md:py-20 px-4 bg-[#F4F6F0]">
        <div className="max-w-screen-extended mx-auto">
          <div className="policies-header mb-8 md:mb-12">
            <SectionHeader
              label="DOKUMENTI"
              title="Naše politike i dokumenti"
              description="Pregledajte sve naše politike i pravne dokumente. Transparentnost je temelj našeg poslovanja."
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-screen mx-auto">
            {policies.map((policy, index) => (
              <div
                key={index}
                className="policy-card bg-white rounded-[30px] p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-orange/10 flex items-center justify-center mb-4 md:mb-6">
                  <policy.icon className="w-6 h-6 md:w-7 md:h-7 text-brand-orange" />
                </div>
                <h3 className="font-oswald font-bold text-lg md:text-xl text-gray-900 mb-2 uppercase">
                  {policy.title}
                </h3>
                <p className="font-poppins text-gray-600 text-sm leading-relaxed mb-3 md:mb-4">
                  {policy.description}
                </p>
                <p className="font-poppins text-xs text-gray-400 mb-4 md:mb-6">
                  Ažurirano: {policy.lastUpdated}
                </p>
                <div className="flex gap-2">
                  {policy.isPage && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 font-oswald uppercase text-xs"
                    >
                      <Link href={policy.pageHref || "#"}>
                        Pročitaj
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant={policy.isPage ? "ghost" : "outline"}
                    size="sm"
                    className={`font-oswald uppercase text-xs ${policy.isPage ? "" : "flex-1"}`}
                  >
                    <a href={policy.href} download>
                      <Download className="w-3 h-3 mr-1" />
                      PDF
                    </a>
                  </Button>
                </div>
                {/* Decorative element */}
                <div className="mt-4 md:mt-6 flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-brand-orange" />
                  <div className="w-2 h-2 rounded-full bg-brand-orange" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Information */}
      <section ref={legalRef} className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="legal-header mb-8 md:mb-12">
              <SectionHeader
                label="KOMPANIJA"
                title="Pravne informacije"
                description="Registracijski i pravni podaci o kompaniji"
                centered
              />
            </div>

            <div className="legal-content bg-[#F4F6F0] rounded-[30px] md:rounded-[40px] p-6 md:p-10 max-w-3xl mx-auto">
              <dl className="space-y-3 md:space-y-4">
                {legalInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 md:py-4 border-b border-gray-200 last:border-0"
                  >
                    <dt className="font-poppins font-medium text-gray-500 text-sm sm:w-48 shrink-0">
                      {info.label}
                    </dt>
                    <dd className="font-poppins font-semibold text-gray-900 text-sm md:text-base">
                      {info.value}
                    </dd>
                  </div>
                ))}
              </dl>
              {/* Decorative element */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <div className="w-12 h-0.5 bg-brand-orange" />
                <div className="w-3 h-3 rounded-full bg-brand-orange" />
                <div className="w-12 h-0.5 bg-brand-orange" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance - Orange Box */}
      <section ref={complianceRef} className="py-12 md:py-16 px-4 bg-gray-900">
        <div className="max-w-screen-extended mx-auto">
          <div className="bg-brand-orange rounded-[30px] md:rounded-[50px] py-12 md:py-16 px-6 md:px-16 shadow-xl relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -bottom-16 -right-16 w-40 h-40 border-8 border-white/10 rounded-full" />
            <div className="absolute -top-12 -left-12 w-28 h-28 border-8 border-white/10 rounded-full" />

            <div className="relative z-10">
              <div className="compliance-header mb-8 md:mb-12">
                <SectionHeader
                  label="STANDARDI"
                  title="Usklađenost i standardi"
                  theme="brand"
                  centered
                />
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/20 mb-8 md:mb-12" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
                {compliance.map((item, index) => (
                  <div
                    key={index}
                    className="compliance-card bg-white/10 backdrop-blur-sm rounded-[25px] p-6 md:p-8 text-center hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <Award className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <h3 className="font-oswald font-bold text-lg md:text-xl text-white mb-2 uppercase">
                      {item.title}
                    </h3>
                    <p className="font-poppins text-white/80 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    {/* Decorative element */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <div className="w-6 h-0.5 bg-white/50" />
                      <div className="w-2 h-2 rounded-full bg-white/50" />
                      <div className="w-6 h-0.5 bg-white/50" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section ref={ctaRef} className="py-12 md:py-20 px-4 bg-[#F4F6F0]">
        <div className="max-w-screen-extended mx-auto">
          <div className="cta-content bg-gray-900 rounded-[30px] md:rounded-[50px] p-8 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-24 h-24 rounded-full bg-brand-orange/20 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-36 h-36 rounded-full bg-brand-orange/10 translate-x-1/4 translate-y-1/4" />

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <SectionHeader
                label="KONTAKT"
                title="Imate pitanja o našim politikama?"
                description="Kontaktirajte nas za bilo kakva pojašnjenja ili dodatne informacije o našim politikama i pravnim dokumentima."
                theme="dark"
                centered
                className="mb-6 md:mb-10"
              />

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Link href="/kontakt">
                  <Button
                    variant="brand"
                    className="font-oswald uppercase px-6 md:px-8 py-4 md:py-6 text-sm md:text-base w-full sm:w-auto"
                  >
                    Kontaktirajte Nas
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button
                  asChild
                  variant="outline"
                  className="font-oswald uppercase px-6 md:px-8 py-4 md:py-6 text-sm md:text-base border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  <a href="mailto:pravno@maksuz.ba">
                    <Mail className="w-4 h-4 mr-2" />
                    pravno@maksuz.ba
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
