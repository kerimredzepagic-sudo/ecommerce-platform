"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Factory,
  Leaf,
  Shield,
  Award,
  CheckCircle,
  ArrowRight,
  FlaskConical,
  Package,
  Truck,
  Sparkles,
  Heart,
  Timer,
} from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const productionSteps = [
  {
    number: "01",
    title: "Odabir Sirovina",
    description:
      "Pažljivo biramo sirovine od provjerenih domaćih proizvođača. Svaka sirovina prolazi rigoroznu kontrolu kvaliteta.",
    icon: Leaf,
    color: "from-green-500 to-emerald-600",
  },
  {
    number: "02",
    title: "Priprema",
    description:
      "Sirovine se čiste, sortiraju i pripremaju prema tradicionalnim recepturama s minimalnom termičkom obradom.",
    icon: Sparkles,
    color: "from-amber-500 to-orange-600",
  },
  {
    number: "03",
    title: "Proizvodnja",
    description:
      "U HACCP certificiranom pogonu, proizvodi se pripremaju uz poštivanje najviših standarda higijene.",
    icon: Factory,
    color: "from-blue-500 to-indigo-600",
  },
  {
    number: "04",
    title: "Kontrola Kvalitete",
    description:
      "Svaka serija prolazi laboratorijske testove i senzorsku analizu prije puštanja u prodaju.",
    icon: FlaskConical,
    color: "from-purple-500 to-violet-600",
  },
  {
    number: "05",
    title: "Pakovanje",
    description:
      "Proizvodi se pakuju u ekološku ambalažu koja čuva svježinu. Svi materijali su reciklabilni.",
    icon: Package,
    color: "from-teal-500 to-cyan-600",
  },
  {
    number: "06",
    title: "Distribucija",
    description:
      "Gotovi proizvodi se skladište u kontroliranim uslovima i distribuiraju do poslovnica i partnera.",
    icon: Truck,
    color: "from-rose-500 to-pink-600",
  },
];

const certifications = [
  {
    name: "HACCP",
    description: "Međunarodni standard za sigurnost hrane",
    icon: Shield,
    color: "from-brand-orange to-orange-600",
  },
  {
    name: "Halal",
    description: "Certificirano od Halal agencije BiH",
    icon: Award,
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Eko",
    description: "Ekološki održiva proizvodnja",
    icon: Leaf,
    color: "from-lime-500 to-green-600",
  },
];

const facilities = [
  {
    title: "Proizvodni Pogon",
    location: "Blažuj, Sarajevo",
    area: "2,000 m²",
    features: ["HACCP certificirano", "Moderna oprema", "Laboratorij"],
    icon: Factory,
  },
  {
    title: "Pčelinjak",
    location: "Blažuj, Sarajevo",
    area: "5 hektara",
    features: ["300+ košnica", "Api centar", "Edukativni prostor"],
    icon: Heart,
  },
  {
    title: "Skladište",
    location: "Sarajevo",
    area: "500 m²",
    features: ["Kontrolirana temperatura", "Automatizacija", "Logistika"],
    icon: Package,
  },
];

const qualityPoints = [
  "Ne koristimo umjetne aditive, konzervanse niti pojačivače ukusa",
  "Naši proizvodi su 100% prirodni",
  "Kontinuirano ulažemo u modernizaciju opreme",
  "Edukacija zaposlenika je naš prioritet",
];

export function ProizvodnjaSection() {
  const introRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const certificatesRef = useRef<HTMLDivElement>(null);
  const facilitiesRef = useRef<HTMLDivElement>(null);
  const qualityRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intro Section Animation
    if (introRef.current) {
      const content = introRef.current.querySelector(".intro-content");
      const image = introRef.current.querySelector(".intro-image");

      gsap.fromTo(
        content,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        image,
        { opacity: 0, x: 60, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Production Steps Animation
    if (stepsRef.current) {
      const header = stepsRef.current.querySelector(".steps-header");
      const cards = stepsRef.current.querySelectorAll(".step-card");
      const timeline = stepsRef.current.querySelector(".steps-timeline");

      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      if (timeline) {
        gsap.fromTo(
          timeline,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      gsap.fromTo(
        cards,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Certificates Animation
    if (certificatesRef.current) {
      const header = certificatesRef.current.querySelector(".certs-header");
      const items = certificatesRef.current.querySelectorAll(".cert-item");

      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: certificatesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        items,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.3,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: certificatesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Facilities Animation
    if (facilitiesRef.current) {
      const header = facilitiesRef.current.querySelector(".facilities-header");
      const cards = facilitiesRef.current.querySelectorAll(".facility-card");

      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: facilitiesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: facilitiesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Quality Section Animation
    if (qualityRef.current) {
      const orangeBox = qualityRef.current.querySelector(".quality-orange-box");
      const items = qualityRef.current.querySelectorAll(".quality-item");

      gsap.fromTo(
        orangeBox,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: qualityRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        items,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: qualityRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // CTA Animation
    if (ctaRef.current) {
      const content = ctaRef.current.querySelector(".cta-content");

      gsap.fromTo(
        content,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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
    <section className="w-full">
      {/* Intro Section */}
      <div ref={introRef} className="w-full py-20 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Content */}
            <div className="flex-1 intro-content">
              <SectionHeader
                label="NAŠA PROIZVODNJA"
                title="Tradicija susreće inovaciju"
              />
              <p className="font-poppins text-base md:text-lg text-gray-700 leading-relaxed mb-6 mt-6">
                U srcu Bosne i Hercegovine, u mjestu Blažuj, nalazi se naš moderni proizvodni 
                pogon. Ovdje se susreću tradicija i inovacija - tradicionalne recepture naših 
                predaka kombinujemo s najmodernijom tehnologijom proizvodnje.
              </p>
              <p className="font-poppins text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                Svaki proizvod koji napusti naše pogone prolazi rigorozne kontrole kvaliteta. 
                Naš tim stručnjaka brine o tome da do vas stigne samo ono najbolje od prirode.
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="font-oswald text-4xl font-bold text-brand-orange">2,000m²</p>
                  <p className="font-poppins text-gray-600 text-sm">Proizvodni pogon</p>
                </div>
                <div>
                  <p className="font-oswald text-4xl font-bold text-brand-orange">300+</p>
                  <p className="font-poppins text-gray-600 text-sm">Košnica pčela</p>
                </div>
                <div>
                  <p className="font-oswald text-4xl font-bold text-brand-orange">100+</p>
                  <p className="font-poppins text-gray-600 text-sm">Proizvoda</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1">
              <div className="intro-image relative w-full h-[400px] lg:h-[500px] rounded-[50px] overflow-hidden shadow-xl">
                <Image
                  src="/apiTherapyGardening.svg"
                  alt="Maksuz Proizvodnja"
                  fill
                  className="object-cover"
                />
                {/* Floating badge */}
                <div className="absolute bottom-8 right-8 bg-brand-orange text-white rounded-[20px] p-4 shadow-lg">
                  <p className="font-oswald text-sm font-bold uppercase">HACCP CERTIFICIRANO</p>
                  <p className="font-poppins text-xl font-bold">Od 2021.</p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Steps Section */}
      <div ref={stepsRef} className="w-full py-24 px-4 md:px-8 bg-[#F4F6F0]">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="steps-header mb-16">
              <SectionHeader
                label="PROIZVODNI PROCES"
                title="Od sirovine do gotovog proizvoda"
                description="Svaki proizvod prolazi kroz pažljivo osmišljen proces koji garantuje kvalitetu i sigurnost."
                centered
              />
            </div>

            {/* Timeline decoration */}
            <div className="hidden lg:block mb-8">
            <div className="steps-timeline h-1 bg-brand-orange/30 rounded-full relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-between px-[8%]">
                {productionSteps.map((_, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full bg-brand-orange shadow-lg"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productionSteps.map((step, index) => (
              <div
                key={index}
                className="step-card relative bg-white rounded-[30px] p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Number badge */}
                <div className={`absolute -top-4 -left-4 w-14 h-14 bg-gradient-to-br ${step.color} text-white rounded-full flex items-center justify-center font-oswald font-bold text-xl shadow-lg`}>
                  {step.number}
                </div>
                
                <div className="pt-4">
                  <div className="w-14 h-14 rounded-[15px] bg-brand-orange/10 flex items-center justify-center mb-4">
                    <step.icon className="w-7 h-7 text-brand-orange" />
                  </div>
                  <h3 className="font-oswald text-xl font-bold text-gray-900 mb-3 uppercase">
                    {step.title}
                  </h3>
                  <p className="font-poppins text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                  {/* Decorative element */}
                  <div className="mt-6 flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-brand-orange" />
                    <div className="w-2 h-2 rounded-full bg-brand-orange" />
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certifications Section */}
      <div ref={certificatesRef} className="w-full py-24 px-4 md:px-8 bg-gray-900 text-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="certs-header mb-16">
              <SectionHeader
                label="CERTIFIKATI I STANDARDI"
                title="Garancija kvalitete i sigurnosti"
                description="Naša proizvodnja zadovoljava najviše međunarodne standarde kvalitete i sigurnosti hrane."
                theme="dark"
                centered
              />
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="cert-item text-center p-8 bg-white/5 backdrop-blur-sm rounded-[30px] border border-white/10"
              >
                <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${cert.color} rounded-full flex items-center justify-center shadow-xl`}>
                  <cert.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="font-oswald text-2xl font-bold mb-3">{cert.name}</h3>
                <p className="font-poppins text-gray-400 text-sm">{cert.description}</p>
                {/* Decorative element */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="w-8 h-0.5 bg-brand-orange" />
                  <div className="w-2 h-2 rounded-full bg-brand-orange" />
                  <div className="w-8 h-0.5 bg-brand-orange" />
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div ref={facilitiesRef} className="w-full py-24 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="facilities-header mb-16">
              <SectionHeader
                label="NAŠI OBJEKTI"
                title="Moderna infrastruktura"
                centered
              />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <div
                key={index}
                className="facility-card bg-[#F4F6F0] rounded-[40px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Header with icon */}
                <div className="h-48 bg-gradient-to-br from-brand-orange/20 to-amber-100 flex items-center justify-center relative">
                  <facility.icon className="w-20 h-20 text-brand-orange" />
                  {/* Area badge */}
                  <div className="absolute bottom-4 right-4 bg-brand-orange text-white rounded-full px-4 py-2 font-oswald font-bold">
                    {facility.area}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-oswald text-2xl font-bold text-gray-900 mb-2 uppercase">
                    {facility.title}
                  </h3>
                  <p className="font-poppins text-gray-500 text-sm mb-6 flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    {facility.location}
                  </p>
                  <ul className="space-y-3">
                    {facility.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 font-poppins text-sm text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quality Commitment Section - Orange Box */}
      <div ref={qualityRef} className="w-full py-16 px-4 relative bg-[#F4F6F0]">
        <div className="max-w-screen-extended mx-auto">
          <div className="quality-orange-box bg-brand-orange rounded-[40px] py-16 px-8 md:px-16 shadow-xl relative overflow-hidden">
            {/* Decorative image */}
            <Image
              src="/garden.svg"
              alt="Decorative"
              width={250}
              height={250}
              className="absolute top-[-30px] right-[-30px] opacity-50 hidden lg:block"
            />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                {/* Left Content */}
                <div className="flex-1">
                  <SectionHeader
                    label="MAKSUZ OBEĆANJE"
                    title="Naša posvećenost kvaliteti"
                    theme="brand"
                    className="mb-8"
                  />
                  
                  <div className="space-y-4">
                    {qualityPoints.map((point, index) => (
                      <div key={index} className="quality-item flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                          <CheckCircle className="w-5 h-5 text-brand-orange" />
                        </div>
                        <span className="font-poppins text-white text-lg">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right - Image placeholder */}
                <div className="flex-1 flex justify-center">
                  <div className="w-64 h-64 bg-white/20 rounded-[40px] flex items-center justify-center backdrop-blur-sm">
                    <Image
                      src="/maksuzlogo.png"
                      alt="Maksuz"
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div ref={ctaRef} className="w-full py-24 px-4 md:px-8 bg-gray-100">
        <div className="max-w-screen-extended mx-auto">
          <div className="cta-content max-w-3xl mx-auto">
            <SectionHeader
              label="ŽELITE POSJETITI NAŠU PROIZVODNJU?"
              title="Organiziramo posjete i edukacije"
              description="Organiziramo posjete za grupe, škole i pojedince. Doživite proizvodnju meda i prirodnih proizvoda iz prve ruke. Kontaktirajte nas za više informacija o terminima i programu."
              centered
              className="mb-8"
            />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/kontakt">
                <Button variant="brand" className="font-oswald uppercase px-8 py-6 text-lg rounded-full">
                  Kontaktirajte Nas
                </Button>
              </Link>
              <Link href="/api-terapija">
                <Button variant="outline" className="font-oswald uppercase px-8 py-6 text-lg rounded-full border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
                  Posjetite Api Centar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
