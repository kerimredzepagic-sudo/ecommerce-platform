"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import {
  Leaf,
  Shield,
  CheckCircle,
  Heart,
  Droplet,
  Zap,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BenefitItem {
  icon: React.ReactNode;
  text: string;
}

interface BenefitCardData {
  icon: string;
  title: string;
  items: BenefitItem[];
  topImage?: string;
  bottomImage?: string;
  middleImage?: string;
}

interface BenefitCardProps {
  icon: string;
  title: string;
  items: BenefitItem[];
  topImage?: string;
  bottomImage?: string;
  middleImage?: string;
  className?: string;
}

function BenefitCard({
  icon,
  title,
  items,
  topImage,
  bottomImage,
  middleImage,
  className,
}: BenefitCardProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Top Image */}
      {topImage && (
        <div
          className="benefit-image relative w-full sm:w-8/12 lg:w-6/12 h-48 sm:h-56 lg:h-64 rounded-[30px] sm:rounded-[40px] lg:rounded-[50px] overflow-hidden mb-8 sm:mb-16 lg:mb-32"
          data-image-type="top"
        >
          <Image src={topImage} alt={title} fill className="object-cover" />
        </div>
      )}

      {/* Benefit Card Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col px-4 sm:px-8 lg:px-16">
          {/* Icon */}
          <div className="benefit-icon-container">
            <Image
              src={icon}
              alt={title}
              height={60}
              width={60}
              className="rounded-5 mb-8 benefit-icon"
            />
          </div>

          {/* Title */}
          <h3 className="benefit-title font-oswald text-2xl md:text-3xl font-bold text-gray-900 mb-6 uppercase">
            {title}
          </h3>

          {/* Benefit Items */}
          <div
            className={cn(
              "flex flex-col gap-4 benefit-items-container",
              (bottomImage || middleImage) && "mb-12"
            )}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="benefit-item flex items-start gap-4"
                data-item-index={index}
              >
                <div className="flex-shrink-0 mt-1 benefit-item-icon">
                  {item.icon}
                </div>
                <p className="font-poppins text-sm md:text-base text-gray-700 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Image */}
        {bottomImage && (
          <div
            className="benefit-image relative w-full sm:w-8/12 lg:w-6/12 h-48 sm:h-56 lg:h-64 rounded-2xl sm:rounded-3xl lg:rounded-32 overflow-hidden mt-8 sm:mt-16 lg:mt-32"
            data-image-type="bottom"
          >
            <Image
              src={bottomImage}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Middle Image (for right column cards) */}
        {middleImage && (
          <div
            className="benefit-image relative mt-6 mb-6 sm:mt-12 sm:mb-12 lg:mt-16 lg:mb-16 w-full sm:w-8/12 lg:w-6/12 h-48 sm:h-56 lg:h-64 ml-0 sm:ml-8 lg:ml-16 rounded-2xl sm:rounded-3xl lg:rounded-32 overflow-hidden"
            data-image-type="middle"
          >
            <Image
              src={middleImage}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

const benefits: BenefitCardData[] = [
  {
    icon: "fork-spoon.svg",
    title: "JAČANJE IMUNITETA",
    topImage: "/apiTherapyGardening.svg",
    bottomImage: "/flowers.svg",
    items: [
      {
        icon: <Leaf className="w-5 h-5 text-yellow-500" />,
        text: "Jačanje imuniteta - Povećava otpornost organizma kroz stimulaciju proizvodnje bijelih krvnih zrnaca i antitijela",
      },
      {
        icon: <Shield className="w-5 h-5 text-green-500" />,
        text: "Prirodna zaštita - Antivirusna i antibakterijska svojstva propolisa štite od sezonskih bolesti",
      },
      {
        icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
        text: "Regeneracija - Ubrzava oporavak nakon bolesti i pomaže u prevenciji čestih infekcija",
      },
    ],
  },
  {
    icon: "/hands.svg",
    title: "ČIŠĆENJE DISAJNIH PUTEVA",
    middleImage: "/vegetables.svg",
    items: [
      {
        icon: <Heart className="w-5 h-5 text-red-500" />,
        text: "Poboljšanje cirkulacije - Bolja zasićenost krvi kisikom kroz duboko disanje tokom tretmana",
      },
      {
        icon: <Droplet className="w-5 h-5 text-red-500" />,
        text: "Regulacija krvnog pritiska - Relaksacija i bolja oksigenacija pomažu u stabilizaciji pritiska",
      },
      {
        icon: <Zap className="w-5 h-5 text-yellow-500" />,
        text: "Povećanje energije - Bolja oksigenacija ćelija rezultira većom vitalnošću i izdržljivošću",
      },
      {
        icon: <Sparkles className="w-5 h-5 text-green-500" />,
        text: "Anti-aging efekti - Antioksidansi iz pčelinjih produkata usporavaju procese starenja",
      },
    ],
  },
  {
    icon: "/flower-shovel.svg",
    title: "POBOLJŠANJE CIRKULACIJE",
    items: [
      {
        icon: <Heart className="w-5 h-5 text-red-500" />,
        text: "Poboljšanje cirkulacije - Bolja zasićenost krvi kisikom kroz duboko disanje tokom tretmana",
      },
      {
        icon: <Droplet className="w-5 h-5 text-red-500" />,
        text: "Regulacija krvnog pritiska - Relaksacija i bolja oksigenacija pomažu u stabilizaciji pritiska",
      },
      {
        icon: <Zap className="w-5 h-5 text-yellow-500" />,
        text: "Povećanje energije - Bolja oksigenacija ćelija rezultira većom vitalnošću i izdržljivošću",
      },
      {
        icon: <Sparkles className="w-5 h-5 text-green-500" />,
        text: "Anti-aging efekti - Antioksidansi iz pčelinjih produkata usporavaju procese starenja",
      },
    ],
  },
];

export function ApiBenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial states for all animated elements
    gsap.set([".benefit-icon", ".benefit-title", ".benefit-item"], {
      opacity: 0,
    });

    // Animate header on scroll with split text effect
    if (headerRef.current) {
      const subtitle = headerRef.current.querySelector("p");
      const title = headerRef.current.querySelector("h2");
      const description = headerRef.current.querySelector("p:last-child");

      gsap.fromTo(
        subtitle,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        title,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        description,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Animate timeline with draw effect
    if (timelineRef.current) {
      const lines = timelineRef.current.querySelectorAll(".border-dashed");
      const dots = timelineRef.current.querySelectorAll(".bg-brand-orange");

      gsap.fromTo(
        lines,
        { scaleY: 0, transformOrigin: "center" },
        {
          scaleY: 1,
          duration: 1.2,
          ease: "power2.inOut",
          stagger: 0.2,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        dots,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.15,
          delay: 0.3,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Animate left card with enhanced effects
    if (leftCardRef.current) {
      gsap.fromTo(
        leftCardRef.current,
        { opacity: 0, x: -80, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: leftCardRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Animate icon with bounce
      const icon = leftCardRef.current.querySelector(".benefit-icon");
      if (icon) {
        gsap.fromTo(
          icon,
          { opacity: 0, scale: 0, rotation: -180 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: leftCardRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate title
      const title = leftCardRef.current.querySelector(".benefit-title");
      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            delay: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: leftCardRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Stagger animate benefit items
      const items = leftCardRef.current.querySelectorAll(".benefit-item");
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: 0.7,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: leftCardRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        // Animate icons with slight bounce
        const itemIcons =
          leftCardRef.current.querySelectorAll(".benefit-item-icon");
        gsap.fromTo(
          itemIcons,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            delay: 0.8,
            stagger: 0.15,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: leftCardRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }

    // Animate right cards with staggered effect
    if (rightCardsRef.current) {
      const cards = rightCardsRef.current.querySelectorAll(".benefit-card");
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: 80, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            delay: index * 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        // Animate icon with bounce
        const icon = card.querySelector(".benefit-icon");
        if (icon) {
          gsap.fromTo(
            icon,
            { opacity: 0, scale: 0, rotation: 180 },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.8,
              delay: index * 0.2 + 0.3,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }

        // Animate title
        const title = card.querySelector(".benefit-title");
        if (title) {
          gsap.fromTo(
            title,
            { opacity: 0, x: 30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.7,
              delay: index * 0.2 + 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }

        // Stagger animate benefit items
        const items = card.querySelectorAll(".benefit-item");
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { opacity: 0, x: 20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              delay: index * 0.2 + 0.7,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );

          // Animate icons with bounce
          const itemIcons = card.querySelectorAll(".benefit-item-icon");
          gsap.fromTo(
            itemIcons,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              delay: index * 0.2 + 0.8,
              stagger: 0.1,
              ease: "back.out(1.5)",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    }

    // Animate all images with scale and slide effect
    const images = sectionRef.current?.querySelectorAll(".benefit-image");
    images?.forEach((image, index) => {
      gsap.fromTo(
        image,
        { opacity: 0, x: -100, scale: 0.8 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: image,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Cleanup ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-8 sm:py-12 lg:py-16 px-4 bg-white mb-8 sm:mb-12 lg:mb-16">
      <div className="max-w-screen-extended mx-auto px-4 sm:px-8 md:px-16 lg:px-32">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          <SectionHeader
            label="MAKSUZ KUTAK"
            title="Ključne benefiti api terapije"
            description="Dobro došli u Maksuz kutak, mjesto gdje za vas biramo samo najbolje od prirode i uz puno ljubavi pretvaramo u vrhunske proizvode. Maksuz proizvodi su napravljeni od najkvalitetnijih sastojaka biranih uz puno pažnje da bi ispunili svaku vašu želju."
            centered
          />
        </div>

        {/* Main Content with Timeline */}
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
          {/* Left Column - First Benefit */}
          <div ref={leftCardRef} className="flex-1">
            <BenefitCard
              icon={benefits[0].icon}
              title={benefits[0].title}
              items={benefits[0].items}
              topImage={benefits[0].topImage}
              bottomImage={benefits[0].bottomImage}
            />
          </div>

          {/* Center Timeline */}
          <div
            ref={timelineRef}
            className="hidden lg:flex flex-col items-center justify-center px-4"
          >
            <div className="flex flex-col items-center justify-center h-full gap-16">
              {/* Dashed line */}
              <div className="flex-1 w-px border-l-2 border-dashed border-brand-orange"></div>
              {/* Circular markers */}
              <div className="w-4 h-4 bg-brand-orange rounded-full flex-shrink-0"></div>
              <div className="flex-1 w-px border-l-2 border-dashed border-brand-orange"></div>
              <div className="w-4 h-4 bg-brand-orange rounded-full flex-shrink-0"></div>
              <div className="flex-1 w-px border-l-2 border-dashed border-brand-orange"></div>
              <div className="w-4 h-4 bg-brand-orange rounded-full flex-shrink-0"></div>
              <div className="flex-1 w-px border-l-2 border-dashed border-brand-orange"></div>
            </div>
          </div>

          {/* Right Column - Two Stacked Benefits */}
          <div ref={rightCardsRef} className="flex-1 flex flex-col gap-8">
            {/* Second Benefit */}
            <div className="benefit-card">
              <BenefitCard
                icon={benefits[1].icon}
                title={benefits[1].title}
                items={benefits[1].items}
                middleImage={benefits[1].middleImage}
              />
            </div>

            {/* Third Benefit */}
            <div className="benefit-card">
              <BenefitCard
                icon={benefits[2].icon}
                title={benefits[2].title}
                items={benefits[2].items}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
