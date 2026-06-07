"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  GraduationCap,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Heart,
  Star,
  Award,
  Lightbulb,
} from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const programs = [
  {
    title: "Škole i Vrtići",
    age: "5-18 godina",
    duration: "2-3 sata",
    description:
      "Prilagođen program za djecu svih uzrasta. Interaktivno učenje o pčelama, proizvodnji meda i važnosti pčela za ekosistem.",
    includes: [
      "Obilazak pčelinjaka",
      "Edukativna prezentacija",
      "Praktične aktivnosti",
      "Degustacija meda",
      "Edukativni materijali",
    ],
    color: "from-green-500 to-emerald-600",
    popular: true,
    icon: BookOpen,
  },
  {
    title: "Porodični Dan",
    age: "Sve uzrasti",
    duration: "3-4 sata",
    description:
      "Zabavan i edukativan dan za cijelu porodicu. Upoznajte svijet pčela i provedite kvalitetno vrijeme u prirodi.",
    includes: [
      "Obilazak pčelinjaka",
      "Aktivnosti za djecu",
      "Degustacija proizvoda",
      "Piknik u prirodi",
      "Mali pokloni za djecu",
    ],
    color: "from-amber-500 to-orange-600",
    icon: Heart,
  },
  {
    title: "Početni Kurs Pčelarstva",
    age: "18+ godina",
    duration: "2 dana (vikend)",
    description:
      "Kompletna obuka za sve koji žele započeti sa pčelarstvom. Teoretska i praktična nastava.",
    includes: [
      "Osnove pčelarstva",
      "Praktičan rad sa košnicama",
      "Sezonski radovi",
      "Oprema i alati",
      "Certifikat o završenom kursu",
    ],
    color: "from-blue-500 to-indigo-600",
    icon: Award,
  },
];

const workshops = [
  {
    icon: Sparkles,
    title: "Pravljenje Svijeća",
    description: "Naučite kako napraviti prirodne svijeće od pčelinjeg voska",
    duration: "90 min",
    color: "from-yellow-500 to-amber-600",
  },
  {
    icon: BookOpen,
    title: "Med u Kulinarstvu",
    description: "Kreativne recepte sa medom i pčelinjim proizvodima",
    duration: "2 sata",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: GraduationCap,
    title: "Apiterapija",
    description: "Upoznajte ljekovita svojstva pčelinjih proizvoda",
    duration: "2 sata",
    color: "from-purple-500 to-violet-600",
  },
];

const statistics = [
  { value: "5,000", suffix: "+", label: "Polaznika godišnje" },
  { value: "100", suffix: "+", label: "Škola i vrtića" },
  { value: "15", suffix: "+", label: "Godina iskustva" },
  { value: "98", suffix: "%", label: "Zadovoljnih polaznika" },
];

const schoolBenefits = [
  "Besplatan prevoz za grupe 30+ učenika",
  "Prilagođen program prema uzrastu",
  "Edukativni materijali uključeni",
  "Stručni edukatori",
];

export function EdukacijaSection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const programsRef = useRef<HTMLDivElement>(null);
  const workshopsRef = useRef<HTMLDivElement>(null);
  const schoolsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stats Section Animation
    if (statsRef.current) {
      const items = statsRef.current.querySelectorAll(".stat-item");

      gsap.fromTo(
        items,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Programs Section Animation
    if (programsRef.current) {
      const header = programsRef.current.querySelector(".programs-header");
      const cards = programsRef.current.querySelectorAll(".program-card");

      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: programsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: programsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Workshops Section Animation
    if (workshopsRef.current) {
      const header = workshopsRef.current.querySelector(".workshops-header");
      const cards = workshopsRef.current.querySelectorAll(".workshop-card");

      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: workshopsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

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
            trigger: workshopsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Schools Section Animation
    if (schoolsRef.current) {
      const content = schoolsRef.current.querySelector(".schools-content");
      const image = schoolsRef.current.querySelector(".schools-image");
      const items = schoolsRef.current.querySelectorAll(".school-benefit");

      gsap.fromTo(
        content,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: schoolsRef.current,
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
          stagger: 0.1,
          delay: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: schoolsRef.current,
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
            trigger: schoolsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // CTA Section Animation
    if (ctaRef.current) {
      const orangeBox = ctaRef.current.querySelector(".cta-orange-box");

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
      {/* Statistics Section */}
      <div ref={statsRef} className="w-full py-16 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {statistics.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <p className="font-oswald text-4xl md:text-5xl lg:text-6xl font-bold text-brand-orange">
                  {stat.value}{stat.suffix}
                </p>
                <p className="font-poppins text-gray-600 text-sm mt-2">{stat.label}</p>
                {/* Decorative element */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-6 h-0.5 bg-brand-orange" />
                  <div className="w-2 h-2 rounded-full bg-brand-orange" />
                  <div className="w-6 h-0.5 bg-brand-orange" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programs Section */}
      <div ref={programsRef} className="w-full py-24 px-4 md:px-8 bg-[#F4F6F0]">
        <div className="max-w-screen-extended mx-auto">
          <div className="programs-header mb-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-brand-orange rounded-full flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <SectionHeader
              label="EDUKATIVNI PROGRAMI"
              title="Odaberite program za vas"
              description="Odaberite program koji vam najviše odgovara ili nas kontaktirajte za prilagođenu ponudu"
              centered
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {programs.map((program, index) => (
              <div
                key={index}
                className={`program-card relative bg-white rounded-[40px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  program.popular ? "ring-2 ring-brand-orange" : ""
                }`}
              >
                {program.popular && (
                  <div className="absolute top-6 right-6 bg-brand-orange text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 z-10">
                    <Star className="w-3 h-3" /> NAJPOPULARNIJI
                  </div>
                )}

                {/* Header with gradient */}
                <div className={`bg-gradient-to-br ${program.color} p-8 text-white relative overflow-hidden`}>
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-[15px] flex items-center justify-center mb-4">
                      <program.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-oswald text-2xl font-bold uppercase mb-3">
                      {program.title}
                    </h3>
                    <div className="flex gap-4 text-sm text-white/80">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {program.age}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {program.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="font-poppins text-gray-600 mb-6 leading-relaxed">
                    {program.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {program.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="font-poppins text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/kontakt">
                    <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 font-oswald uppercase rounded-full py-6">
                      Zatražite Ponudu
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workshops Section */}
      <div ref={workshopsRef} className="w-full py-24 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="workshops-header mb-16">
            <SectionHeader
              label="KREATIVNE RADIONICE"
              title="Dodatne aktivnosti za sve uzraste"
              centered
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {workshops.map((workshop, index) => (
              <div
                key={index}
                className="workshop-card bg-[#F4F6F0] rounded-[30px] p-8 text-center hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${workshop.color} rounded-[20px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <workshop.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-oswald font-bold text-xl text-gray-900 mb-3 uppercase">
                  {workshop.title}
                </h3>
                <p className="font-poppins text-gray-600 text-sm leading-relaxed mb-4">
                  {workshop.description}
                </p>
                <span className="inline-block bg-white px-4 py-2 rounded-full font-poppins text-sm font-medium text-gray-700 shadow-sm">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {workshop.duration}
                </span>
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

      {/* For Schools Section - Dark */}
      <div ref={schoolsRef} className="w-full py-24 px-4 md:px-8 bg-gray-900 text-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Content */}
            <div className="flex-1 schools-content">
              <SectionHeader
                label="POSEBNA PONUDA"
                title="Za škole i vrtiće"
                description="Nudimo posebne programe za obrazovne institucije sa prilagođenim sadržajem prema kurikulumu i uzrastu učenika."
                theme="dark"
              />
              
              <div className="space-y-4 mb-8">
                {schoolBenefits.map((benefit, index) => (
                  <div key={index} className="school-benefit flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-poppins text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link href="/kontakt">
                <Button className="bg-brand-orange hover:bg-brand-orange/90 font-oswald uppercase rounded-full px-8 py-6 text-lg">
                  Kontaktirajte Nas
                </Button>
              </Link>
            </div>

            {/* Right Image */}
            <div className="flex-1">
              <div className="schools-image relative w-full h-[400px] lg:h-[500px] rounded-[50px] overflow-hidden">
                <Image
                  src="/apiTherapyGardening.svg"
                  alt="Edukacija za škole"
                  fill
                  className="object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                {/* Floating badge */}
                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm rounded-[20px] p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-oswald text-green-600 text-sm font-bold uppercase">Grupe 30+</p>
                      <p className="font-poppins text-xl font-bold text-gray-900">Besplatan prevoz</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Orange Box */}
      <div ref={ctaRef} className="w-full py-16 px-4 relative bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="cta-orange-box bg-brand-orange rounded-[40px] py-16 px-8 md:px-16 shadow-xl relative overflow-hidden">
            {/* Decorative elements */}
            <Image
              src="/flowerPots.svg"
              alt="Decorative"
              width={200}
              height={200}
              className="absolute top-[-30px] right-8 opacity-70 hidden lg:block"
            />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <SectionHeader
                label=""
                title="Rezervišite termin"
                description="Kontaktirajte nas za dostupne termine i personaliziranu ponudu za vašu grupu ili instituciju."
                theme="brand"
                centered
                className="mb-8"
              />
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/kontakt">
                  <Button className="bg-white text-brand-orange hover:bg-gray-100 font-oswald uppercase rounded-full px-8 py-6 text-lg">
                    Pošaljite Upit
                  </Button>
                </Link>
                <Button asChild variant="outline" className="font-oswald uppercase rounded-full px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-brand-orange">
                  <a href="tel:+38733123456">+387 33 123 456</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
