"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { SectionHeader } from "../ui/section-header";
import { ArrowRight, Info, Mail, Target, Lightbulb } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const statistics = [
  { value: "100+", label: "Proizvoda" },
  { value: "3", label: "Poslovnice" },
  { value: "3", label: "Tržišta" },
];

const missionVisionCards = [
  {
    id: 1,
    icon: Target,
    title: "NAŠA MISIJA",
    content:
      "Naša misija je pronaći mjesto u vašoj kuhinji i srcu, obogatiti vašu sofru i druženja, te postati najvolji prijatelj onih koji poklanjaju srcem.",
    bgColor: "bg-brand-orange",
    iconColor: "text-white",
  },
  {
    id: 2,
    icon: Lightbulb,
    title: "NAŠA VIZIJA",
    content:
      "Maksuz teži postati brend broj 1 u Bosni i Hercegovini za premium prirodne proizvode – simbol kvalitete, autentičnosti i inovacije.",
    bgColor: "bg-gray-900",
    iconColor: "text-white",
  },
];

export function StatisticsAndMissionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsBoxRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the orange statistics box
      gsap.fromTo(
        statsBoxRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsBoxRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Animate header content
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsBoxRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Animate statistics with stagger
      if (statsRef.current) {
        const statItems = statsRef.current.children;
        gsap.fromTo(
          statItems,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.15,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate decorative image
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: 50, rotate: -10 },
        {
          opacity: 1,
          x: 0,
          rotate: 0,
          duration: 0.8,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsBoxRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Animate mission/vision cards
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.2,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-8 sm:py-12 md:py-16 px-4 mt-8 sm:mt-12 md:mt-16">
      {/* Outer container with max-w-screen-extended */}
      <div className="max-w-screen-extended mx-auto relative h-fit">
        {/* Orange Statistics Box */}
        <div
          ref={statsBoxRef}
          className="max-w-screen mx-auto bg-brand-orange rounded-3xl py-8 md:py-12 lg:py-16 px-4 sm:px-6 md:px-16 lg:px-24 shadow-xl absolute top-0 left-0 right-0 overflow-hidden"
        >
          <div
            ref={imageRef}
            className="absolute top-[-50px] right-8 pointer-events-none hidden md:block"
          >
            <Image
              src="/flowerPots.svg"
              alt="Maksuz Logo"
              width={250}
              height={250}
            />
          </div>
          {/* Top Section with Title and Buttons */}
          <div
            ref={headerRef}
            className="flex flex-col md:items-start md:justify-between gap-4 md:gap-6 mb-8 md:mb-12 lg:mb-16"
          >
            <SectionHeader
              label="KVALITETA PROIZVODA"
              title="Brojke govore za nas."
              theme="brand"
            >
              <div className="flex flex-wrap gap-2 sm:gap-4 flex-shrink-0 mt-4 md:mt-6">
                <Link href="/o-nama">
                  <Button
                    variant="brand"
                    size="lg"
                    className="bg-white text-brand-orange hover:bg-gray-100 font-oswald uppercase text-xs sm:text-sm px-4 sm:px-6 py-3 sm:py-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  >
                    <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    VIŠE
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/kontakt">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-brand-orange font-oswald uppercase text-xs sm:text-sm px-4 sm:px-6 py-3 sm:py-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  >
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    KONTAKT
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </SectionHeader>
          </div>
          {/* Divider Line */}
          <div className="w-full h-px bg-white/30 mb-4 md:mb-8" />

          {/* Statistics Row */}
          <div
            ref={statsRef}
            className="flex flex-row justify-between items-center gap-2 sm:gap-4 md:gap-8 mt-4 md:mt-8"
          >
            {statistics.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center group cursor-default flex-1"
              >
                <p className="font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </p>
                <p className="font-poppins text-xs sm:text-sm md:text-lg lg:text-xl text-white/80 mt-1 md:mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-screen-extended flex justify-center mx-auto mt-[120px] sm:mt-[150px] md:mt-[180px] lg:mt-[220px] bg-gray-100 pt-[140px] sm:pt-[180px] md:pt-[240px] lg:pt-[280px] pb-12 sm:pb-16 md:pb-24 lg:pb-32 rounded-32 px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 max-w-screen w-full">
          {/* Left Column - Image */}
          <div className="flex-1 relative">
            <div className="relative w-full h-[250px] sm:h-[320px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/garden.svg"
                alt="Maksuz Mission"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Column - Text Content */}
          <div className="flex-1 flex flex-col justify-center">
            <SectionHeader
              label="MAKSUZ"
              title="Misija i vizija"
              description="Otkrijte šta nas pokreće i čemu težimo kao kompanija."
              className="mb-4 md:mb-8"
            />

            {/* Mission & Vision Cards */}
            <div ref={cardsRef} className="space-y-3 sm:space-y-4">
              {missionVisionCards.map((card) => (
                <div
                  key={card.id}
                  className={`${card.bgColor} rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <card.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${card.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-oswald font-bold text-sm sm:text-base md:text-lg text-white mb-1 sm:mb-2 uppercase tracking-wide">
                        {card.title}
                      </h3>
                      <p className="font-poppins text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">
                        {card.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Link to full page */}
            <Link href="/misijavizija" className="mt-4 sm:mt-6 inline-flex items-center gap-2 group">
              <span className="font-poppins text-sm sm:text-base text-gray-700 group-hover:text-brand-orange transition-colors">
                Saznajte više o nama
              </span>
              <ArrowRight className="w-4 h-4 text-brand-orange group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
