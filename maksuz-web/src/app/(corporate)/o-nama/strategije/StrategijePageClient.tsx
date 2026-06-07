"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Leaf,
  Heart,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Briefcase,
  Globe,
  Mail,
  Info,
} from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const strategies = [
  {
    id: "poslovanje",
    icon: TrendingUp,
    title: "Strategija Poslovanja",
    subtitle: "Rast kroz kvalitet",
    iconBg: "bg-blue-500",
    description:
      "Naša poslovna strategija temelji se na kontinuiranom unapređenju kvalitete proizvoda, širenju prodajne mreže i jačanju brenda na domaćem i međunarodnom tržištu.",
    pillars: [
      {
        title: "Kvaliteta kao Prioritet",
        description:
          "Svaki proizvod prolazi rigoznu kontrolu kvalitete. Koristimo samo najkvalitetnije sirovine od provjerenih dobavljača.",
      },
      {
        title: "Inovacije",
        description:
          "Konstantno razvijamo nove proizvode i unapređujemo postojeće na osnovu povratnih informacija kupaca i tržišnih trendova.",
      },
      {
        title: "Širenje Tržišta",
        description:
          "Planiramo proširenje prodajne mreže u regiji i izvoz na nova tržišta u EU i šire.",
      },
      {
        title: "Digitalna Transformacija",
        description:
          "Ulaganje u e-commerce platformu i digitalni marketing za bolju dostupnost proizvoda.",
      },
    ],
  },
  {
    id: "nutritivna",
    icon: Leaf,
    title: "Nutritivna Strategija",
    subtitle: "Zdravlje kroz prirodu",
    iconBg: "bg-green-500",
    description:
      "Vjerujemo da hrana treba biti lijek. Naša nutritivna strategija fokusirana je na kreiranje proizvoda koji doprinose zdravlju i blagostanju naših kupaca.",
    pillars: [
      {
        title: "100% Prirodno",
        description:
          "Svi naši proizvodi su bez umjetnih aditiva, konzervansa i pojačivača okusa. Samo prirodni sastojci.",
      },
      {
        title: "Funkcionalna Hrana",
        description:
          "Razvoj proizvoda sa dodatnim zdravstvenim benefitima - energetski, imuno-jačajući, digestivni.",
      },
      {
        title: "Transparentnost",
        description:
          "Jasno deklariranje nutritivnih vrijednosti i porijekla sastojaka na svakom proizvodu.",
      },
      {
        title: "Edukacija",
        description:
          "Aktivno educiramo potrošače o zdravoj ishrani kroz blog, radionice i društvene mreže.",
      },
    ],
  },
  {
    id: "drustvena",
    icon: Heart,
    title: "Strategija Društvene Odgovornosti",
    subtitle: "Odgovornost prema zajednici",
    iconBg: "bg-rose-500",
    description:
      "Kao lokalni proizvođač, osjećamo odgovornost prema zajednici u kojoj djelujemo. Naša strategija društvene odgovornosti obuhvata zaštitu okoline, podršku lokalnoj zajednici i etičko poslovanje.",
    pillars: [
      {
        title: "Zaštita Okoliša",
        description:
          "Korištenje ekološke ambalaže, smanjenje otpada i racionalno korištenje resursa u proizvodnji.",
      },
      {
        title: "Lokalni Dobavljači",
        description:
          "Prednost dajemo lokalnim proizvođačima sirovina, čime podržavamo domaću privredu.",
      },
      {
        title: "Podrška Zajednici",
        description:
          "Redovne donacije humanitarnim organizacijama, školama i sportskim klubovima.",
      },
      {
        title: "Etičko Poslovanje",
        description:
          "Fer odnos prema zaposlenicima, dobavljačima i partnerima. Transparentnost u svim poslovnim odnosima.",
      },
    ],
  },
];

const goals = [
  { value: "500+", label: "Proizvoda", description: "U asortimanu" },
  { value: "10+", label: "Zemalja", description: "Izvoza" },
  { value: "100%", label: "Ekološka", description: "Ambalaža" },
  { value: "50+", label: "Novih", description: "Radnih mjesta" },
];

export default function StrategijePageClient() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const strategySectionsRef = useRef<HTMLDivElement>(null);
  const goalsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Navigation animation
    if (navRef.current) {
      const buttons = navRef.current.querySelectorAll(".nav-button");
      gsap.fromTo(
        buttons,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: navRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Strategy sections animation
    if (strategySectionsRef.current) {
      const sections = strategySectionsRef.current.querySelectorAll(".strategy-section");
      sections.forEach((section) => {
        const header = section.querySelector(".strategy-header");
        const cards = section.querySelectorAll(".strategy-card");
        const icon = section.querySelector(".strategy-icon");

        gsap.fromTo(
          header,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.fromTo(
          icon,
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            delay: 0.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: section,
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
            stagger: 0.15,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }

    // Goals section animation
    if (goalsRef.current) {
      const header = goalsRef.current.querySelector(".goals-header");
      const items = goalsRef.current.querySelectorAll(".goal-item");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: goalsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        items,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: goalsRef.current,
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
      <HeroSection image="/Garden.svg" className="h-[300px] md:h-[400px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="Naše Strategije"
            title="Vizija za budućnost"
            description="Tri stuba na kojima gradimo naš poslovni uspjeh."
            textCenter
          />
        </div>
      </HeroSection>

      {/* Strategy Navigation */}
      <section ref={navRef} className="py-4 md:py-6 bg-white border-b sticky top-0 z-20">
        <div className="max-w-screen-extended mx-auto px-4">
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
            {strategies.map((strategy) => (
              <a
                key={strategy.id}
                href={`#${strategy.id}`}
                className="nav-button px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-oswald uppercase bg-gray-100 hover:bg-brand-orange hover:text-white transition-all duration-300"
              >
                {strategy.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Strategies */}
      <div ref={strategySectionsRef}>
        {strategies.map((strategy, index) => (
          <section
            key={strategy.id}
            id={strategy.id}
            className={`strategy-section py-12 md:py-20 px-4 ${
              index % 2 === 0 ? "bg-white" : "bg-[#F4F6F0]"
            }`}
          >
            <div className="max-w-screen-extended mx-auto">
              <div className="max-w-screen mx-auto">
                {/* Header */}
                <div className="strategy-header text-center mb-8 md:mb-12">
                  <div
                    className={`strategy-icon w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full ${strategy.iconBg} flex items-center justify-center shadow-lg`}
                  >
                    <strategy.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <SectionHeader
                    label={strategy.subtitle}
                    title={strategy.title}
                    description={strategy.description}
                    centered
                  />
                </div>

                {/* Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {strategy.pillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="strategy-card bg-white rounded-[30px] p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-brand-orange" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-oswald font-bold text-base md:text-lg text-gray-900 mb-2 uppercase">
                            {pillar.title}
                          </h3>
                          <p className="font-poppins text-gray-600 text-sm leading-relaxed">
                            {pillar.description}
                          </p>
                        </div>
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
            </div>
          </section>
        ))}
      </div>

      {/* Goals Section - Orange Box */}
      <section ref={goalsRef} className="w-full py-12 md:py-16 px-4 relative">
        <div className="max-w-screen-extended mx-auto relative">
          <div className="bg-brand-orange rounded-[30px] md:rounded-[50px] py-12 md:py-16 px-6 md:px-16 lg:px-24 shadow-xl relative overflow-hidden">
            {/* Decorative image */}
            <Image
              src="/flowerPots.svg"
              alt="Decorative"
              width={200}
              height={200}
              className="absolute top-[-30px] right-8 opacity-60 hidden lg:block"
            />

            <div className="relative z-10">
              <div className="goals-header mb-8 md:mb-12">
                <SectionHeader
                  label="NAŠI CILJEVI"
                  title="Ciljevi do 2030."
                  theme="brand"
                  centered
                />
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/20 mb-8 md:mb-12" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {goals.map((goal, index) => (
                  <div key={index} className="goal-item text-center">
                    <p className="font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-1 md:mb-2">
                      {goal.value}
                    </p>
                    <p className="font-oswald text-base md:text-xl text-gray-900 font-bold uppercase mb-0.5 md:mb-1">
                      {goal.label}
                    </p>
                    <p className="font-poppins text-xs md:text-sm text-white/80">
                      {goal.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="w-full py-12 md:py-24 px-4 md:px-8 bg-gray-900">
        <div className="max-w-screen-extended mx-auto">
          <div className="cta-content bg-[#F4F6F0] rounded-[30px] md:rounded-[50px] p-8 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -bottom-16 -right-16 w-40 h-40 border-8 border-brand-orange/10 rounded-full" />
            <div className="absolute -top-12 -left-12 w-28 h-28 border-8 border-brand-orange/10 rounded-full" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <SectionHeader
                label="SAZNAJTE VIŠE"
                title="Želite saznati više o nama?"
                description="Pročitajte našu kompletnu priču i upoznajte vrijednosti koje nas vode."
                centered
                className="mb-6 md:mb-10"
              />

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Link href="/o-nama">
                  <Button
                    variant="brand"
                    className="font-oswald uppercase px-6 md:px-8 py-4 md:py-6 text-sm md:text-base w-full sm:w-auto"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    Naša Priča
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/o-nama/politike">
                  <Button
                    variant="outline"
                    className="font-oswald uppercase px-6 md:px-8 py-4 md:py-6 text-sm md:text-base border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white w-full sm:w-auto"
                  >
                    Naše Politike
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
