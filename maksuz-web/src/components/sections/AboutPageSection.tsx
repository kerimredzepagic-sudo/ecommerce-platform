"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Heart, Award, Users, Leaf, Sparkles, Target, Lightbulb, BookOpen, Fingerprint } from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TestimonialCard } from "./TestimonialCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const values = [
  {
    icon: Heart,
    title: "LJUBAV",
    description: "Svaki proizvod pravimo s ljubavlju i pažnjom, baš kao što su to radili naši preci.",
    color: "text-red-500",
  },
  {
    icon: Leaf,
    title: "PRIRODNOST",
    description: "100% prirodni sastojci bez aditiva, konzervansa i umjetnih boja.",
    color: "text-green-500",
  },
  {
    icon: Award,
    title: "KVALITETA",
    description: "HACCP i Halal certifikovani proizvodi najvišeg kvaliteta.",
    color: "text-yellow-500",
  },
  {
    icon: Users,
    title: "PORODICA",
    description: "Porodično poduzeće gdje svaki član doprinosi uspjehu.",
    color: "text-blue-500",
  },
];

const milestones = [
  { year: "2018", title: "Početak priče", description: "Porodični ručak, ideja, mala prostorija sa dvije mašine i tri zaposlenika" },
  { year: "2019", title: "Osnivanje", description: "Pokretanje proizvodnje voćnih sokova, meda i mednih mješavina" },
  { year: "2020", title: "Velika prekretnica", description: "Nastaju Imuno Pekmez i Energetske kuglice - simboli našeg brenda" },
  { year: "2021", title: "HACCP certifikat", description: "Dobijanje HACCP certifikata za kvalitetu proizvodnje" },
  { year: "2022", title: "Halal certifikat", description: "Potvrda halal standarda za sve proizvode" },
  { year: "2024", title: "100+ proizvoda", description: "Prepoznatljiv bh. brend sa tri sektora i dvadeset zaposlenika" },
];

const missionPoints = [
  {
    icon: Target,
    title: "Naša Misija",
    description: "Naša misija je pronaći mjesto u vašoj kuhinji i srcu, obogatiti vašu sofru i druženja, te postati najvolji prijatelj onih koji poklanjaju srcem.",
  },
  {
    icon: Lightbulb,
    title: "Naša Vizija",
    description: "Maksuz teži postati brend broj 1 u Bosni i Hercegovini za premium prirodne proizvode – simbol kvalitete, autentičnosti i inovacije.",
  },
  {
    icon: Sparkles,
    title: "Naši Ciljevi",
    description: "Graditi dugoročnu prepoznatljivost i održiv poslovni model koji otvara put ka franšiznom širenju i međunarodnim tržištima.",
  },
];

const testimonials = [
  {
    customerName: "Amina Hasanović",
    customerImage: "/womanAvatar.png",
    customerTitle: "Zadovoljan kupac",
    reviewText: "Maksuz proizvodi su postali dio naše svakodnevice. Med je nevjerovatno ukusan i prirodan!",
  },
  {
    customerName: "Marko Petrović",
    customerImage: "/womanAvatar.png",
    customerTitle: "Redovan kupac",
    reviewText: "Kvaliteta proizvoda je na najvišem nivou. Preporučujem svima koji cijene prirodne delicije.",
  },
  {
    customerName: "Lejla Delić",
    customerImage: "/womanAvatar.png",
    customerTitle: "Porodični kupac",
    reviewText: "Cijela porodica uživa u Maksuz proizvodima. Posebno volimo medne mješavine!",
  },
  {
    customerName: "Emir Kovačević",
    customerImage: "/womanAvatar.png",
    customerTitle: "Korporativni klijent",
    reviewText: "Odlični poklon paketi za naše partnere. Profesionalna usluga i vrhunski proizvodi.",
  },
];

export function AboutPageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const brandNameRef = useRef<HTMLDivElement>(null);
  const logoMeaningRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const certificatesRef = useRef<HTMLDivElement>(null);

  // Duplicate testimonials for seamless infinite loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    // Story Section Animation
    if (storyRef.current) {
      const image = storyRef.current.querySelector(".story-image");
      const content = storyRef.current.querySelector(".story-content");
      const decorativeLines = storyRef.current.querySelectorAll(".decorative-line");

      gsap.fromTo(
        image,
        { opacity: 0, x: -80, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        content,
        { opacity: 0, x: 80, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        decorativeLines,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.8,
          delay: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Brand Name Section Animation
    if (brandNameRef.current) {
      const content = brandNameRef.current.querySelector(".brand-content");
      const highlight = brandNameRef.current.querySelector(".brand-highlight");
      const icon = brandNameRef.current.querySelector(".brand-icon");

      gsap.fromTo(
        content,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: brandNameRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        highlight,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: brandNameRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      if (icon) {
        gsap.fromTo(
          icon,
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            delay: 0.5,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: brandNameRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }

    // Logo Meaning Section Animation
    if (logoMeaningRef.current) {
      const image = logoMeaningRef.current.querySelector(".logo-image");
      const content = logoMeaningRef.current.querySelector(".logo-content");
      const points = logoMeaningRef.current.querySelectorAll(".logo-point");

      gsap.fromTo(
        image,
        { opacity: 0, x: -80, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: logoMeaningRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        content,
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: logoMeaningRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        points,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: logoMeaningRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Values Section Animation
    if (valuesRef.current) {
      const header = valuesRef.current.querySelector(".values-header");
      const cards = valuesRef.current.querySelectorAll(".value-card");
      const icons = valuesRef.current.querySelectorAll(".value-icon");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: valuesRef.current,
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
            trigger: valuesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        icons,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.5,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Timeline Section Animation
    if (timelineRef.current) {
      const header = timelineRef.current.querySelector(".timeline-header");
      const lines = timelineRef.current.querySelectorAll(".timeline-line");
      const dots = timelineRef.current.querySelectorAll(".timeline-dot");
      const items = timelineRef.current.querySelectorAll(".timeline-item");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        lines,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "power2.inOut",
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
          stagger: 0.15,
          delay: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: timelineRef.current,
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
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Mission Section Animation
    if (missionRef.current) {
      const orangeBox = missionRef.current.querySelector(".mission-orange-box");
      const missionCards = missionRef.current.querySelectorAll(".mission-card");
      const missionImage = missionRef.current.querySelector(".mission-image");

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
            trigger: missionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        missionCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      if (missionImage) {
        gsap.fromTo(
          missionImage,
          { opacity: 0, scale: 0.8, x: 100 },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 1.2,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: missionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }

    // Testimonials Section Animation
    if (testimonialsRef.current) {
      const header = testimonialsRef.current.querySelector(".testimonials-header");
      const carousel = testimonialsRef.current.querySelector(".testimonials-carousel");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        carousel,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Certificates Section Animation
    if (certificatesRef.current) {
      const header = certificatesRef.current.querySelector(".certificates-header");
      const items = certificatesRef.current.querySelectorAll(".certificate-item");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
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
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          delay: 0.3,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: certificatesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Cleanup ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full">
      {/* Story Section */}
      <div ref={storyRef} className="w-full py-16 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-stretch">
            {/* Left Side - Image with decorative elements */}
            <div className="flex-1 relative">
              <div className="story-image relative w-full h-[400px] lg:h-[600px] rounded-[50px] overflow-hidden">
                <Image
                  src="/image2.svg"
                  alt="Maksuz Pčelinjak"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Decorative overlay shapes */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Floating decorative image */}
              <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-[30px] overflow-hidden shadow-xl hidden lg:block">
                <Image
                  src="/apiTherapyGardening.svg"
                  alt="Decorative"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 flex flex-col justify-center story-content">
              <div className="relative">
                {/* Decorative lines */}
                <div className="decorative-line absolute -left-8 top-0 w-1 h-24 bg-brand-orange rounded-full hidden lg:block" />
                
                <SectionHeader
                  label="POČETAK NAŠE PRIČE"
                  title="Od porodičnog ručka do prepoznatljivog brenda"
                  className="mb-8"
                />
                
                <div className="space-y-6 text-gray-700 font-poppins text-base md:text-lg leading-relaxed">
                  <p>
                    Unazad sedam godina, zahvaljujući porodičnom ručku i ideji koja se taj dan rodila, 
                    maloj prostoriji sa dvije mašine, marljivim i požrtovanim radom svega tri zaposlenika, 
                    započinje Maksuz priča. Sloga, ljubav i bezuslovna podrška uz dvije mašine su sve što smo imali.
                  </p>
                  <p>
                    Želja i potreba da stvorimo nešto posebno, autentično, domaće, rezultirala je pokretanjem 
                    proizvodnje voćnih sokova, meda i mednih mješavina. Velika prekretnica dogodila se 2020. godine, 
                    kada smo, pored voćnih sokova i meda, odlučili napraviti nešto novo, posebno, što će poželjeti 
                    svako domaćinstvo – i tada nastaju dva Maksuz proizvoda: <strong>imuno pekmez sa dodacima</strong> i 
                    <strong> energetske kuglice od suhog voća</strong> koje su danas jedan od važnih simbola našeg brenda.
                  </p>
                  <p>
                    Sedam godina poslije, mnogo toga se pozitivno promijenilo, ali sloga, ljubav i bezuslovna podrška 
                    koju smo imali na početku nas je dovela do današnjeg dana, kada je Maksuz prepoznatljiv bh. brend 
                    sa preko <strong>100 proizvoda</strong> u asortimanu iz različitih kategorija, <strong>tri sektora</strong> i 
                    <strong> dvadeset zaposlenika</strong>.
                  </p>
                </div>

                {/* Decorative dashed line */}
                <div className="decorative-line mt-8 flex items-center gap-4">
                  <div className="w-12 h-0.5 bg-brand-orange" />
                  <div className="w-3 h-3 rounded-full bg-brand-orange" />
                  <div className="flex-1 border-t-2 border-dashed border-brand-orange/40" />
                </div>

                <Link href="/shop">
                  <Button variant="brand" className="font-oswald uppercase mt-8 px-8 py-6 text-lg">
                    Pogledaj proizvode
                  </Button>
                </Link>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Name Inspiration Section */}
      <div ref={brandNameRef} className="w-full py-24 px-4 md:px-8 bg-gray-900 text-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="flex-1 brand-content">
              <SectionHeader
                label="INSPIRACIJA ZA IME BRENDA"
                title='Zašto „MAKSUZ"?'
                theme="dark"
                className="mb-8"
              />
              
              <div className="space-y-6 text-gray-300 font-poppins text-base md:text-lg leading-relaxed">
                <p>
                  Pronaći savršenu riječ koja će oslikavati filozofiju našeg brenda i prenijeti emociju 
                  koju smo osjetili onog dana kada se rodila ideja o ovoj priči, bio je izazovan, ali uspješan zadatak.
                </p>
                <p>
                  Naš izbor je pao na riječ <strong className="text-brand-orange">„MAKSUZ"</strong> – riječ čije porijeklo 
                  vodi iz turskog jezika, dok njen korijen potiče iz arapskog glagola <strong className="text-brand-orange">„hassa"</strong>, 
                  što znači: <em>izdvojiti se, posebno namijeniti, biti poseban po nečemu</em>.
                </p>
                <p>
                  Maksuz je danas upravo to – proizvodi nastali iz ljubavi, pažnje i onog posebnog osjećaja 
                  koji nas vodi kada stvaramo nešto novo, autentično i nesvakidašnje.
                </p>
              </div>
            </div>

            {/* Right - Highlight Box */}
            <div className="flex-1 lg:flex-none lg:w-1/3">
              <div className="brand-highlight bg-brand-orange rounded-[40px] p-10 text-center relative overflow-hidden">
                <div className="brand-icon w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-oswald text-3xl md:text-4xl font-bold text-white mb-4 uppercase">
                  MAKSUZ
                </h3>
                <p className="font-poppins text-white/90 text-lg italic mb-4">
                  /mak-suz/
                </p>
                <div className="w-16 h-0.5 bg-white/40 mx-auto mb-4" />
                <p className="font-poppins text-white text-base leading-relaxed">
                  <span className="font-semibold">Značenje:</span><br />
                  Izdvojiti se, biti poseban, posebno namijenjen
                </p>
                <p className="font-poppins text-white/80 text-sm mt-4">
                  Porijeklo: Turski / Arapski
                </p>
                {/* Decorative circles */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 border-4 border-white/20 rounded-full" />
                <div className="absolute -top-6 -left-6 w-20 h-20 border-4 border-white/10 rounded-full" />
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Meaning Section */}
      <div ref={logoMeaningRef} className="w-full py-24 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            {/* Left Side - Logo Image */}
            <div className="flex-1 logo-image">
              <div className="relative w-full max-w-md mx-auto">
                <div className="bg-[#F4F6F0] rounded-[50px] p-12 flex items-center justify-center">
                  <Image
                    src="/MAKSUZ_orange_logo.png"
                    alt="Maksuz Logo - Srce od ruku"
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-brand-orange/10 rounded-full" />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-brand-orange/20 rounded-full" />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 logo-content">
              <SectionHeader
                label="LOGO SRCA - SPOJENIH RUKU"
                title="Značenje našeg loga"
                className="mb-8"
              />
              
              <div className="space-y-6">
                <div className="logo-point flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-oswald font-bold text-lg text-gray-900 mb-2">DVA PARA RUKU KOJE FORMIRAJU SRCE</h4>
                    <p className="font-poppins text-gray-600 text-base leading-relaxed">
                      Logo MAKSUZ-a prikazuje dva para ruku koje formiraju srce – organ koji pokreće život u tijelu.
                    </p>
                  </div>
                </div>

                <div className="logo-point flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-oswald font-bold text-lg text-gray-900 mb-2">SIMBOL DVA BRATA</h4>
                    <p className="font-poppins text-gray-600 text-base leading-relaxed">
                      U našoj priči, ruke koje tvore srce simbolizuju dva brata, njihovu upornost, vjeru jednog u drugog i zajednički rad.
                    </p>
                  </div>
                </div>

                <div className="logo-point flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                    <Fingerprint className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-oswald font-bold text-lg text-gray-900 mb-2">SIMBOL STVARANJA</h4>
                    <p className="font-poppins text-gray-600 text-base leading-relaxed">
                      Te ruke nisu samo znak porodične povezanosti, već i simbol stvaranja – proizvoda, ideja i tradicije koja će se prenositi iz generacije u generaciju.
                    </p>
                  </div>
                </div>

                <div className="logo-point flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-oswald font-bold text-lg text-gray-900 mb-2">NAŠIH 20 ZAPOSLENIKA</h4>
                    <p className="font-poppins text-gray-600 text-base leading-relaxed">
                      Kao što tijelo ne može funkcionisati samo zahvaljujući jednom organu – srcu, tako ni MAKSUZ danas ne bi bio ono što jeste bez naših dvadeset posvećenih zaposlenika, koji zajedno s nama žive i pišu ovu priču.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div ref={valuesRef} className="w-full py-24 px-4 md:px-8 bg-[#F4F6F0]">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="values-header mb-16">
              <SectionHeader
                label="NAŠE VRIJEDNOSTI"
                title="Što nas čini posebnim"
                description="Vjerujemo u snagu prirode i tradicije. Svaki naš proizvod nosi u sebi ljubav, pažnju i posvećenost kvaliteti."
                centered
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="value-card bg-white rounded-[30px] p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="value-icon w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center mb-6">
                  <value.icon className={`w-8 h-8 ${value.color}`} />
                </div>
                <h3 className="font-oswald font-bold text-xl text-gray-900 mb-3 uppercase">
                  {value.title}
                </h3>
                <p className="font-poppins text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
                {/* Decorative element */}
                <div className="mt-6 flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-brand-orange" />
                  <div className="w-2 h-2 rounded-full bg-brand-orange" />
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div ref={timelineRef} className="w-full py-24 px-4 md:px-8 bg-gray-900 text-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="timeline-header mb-16">
            <SectionHeader
              label="NAŠE PUTOVANJE"
              title="Ključni momenti"
              theme="dark"
              centered
            />
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center vertical line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-brand-orange/30" />
            
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`timeline-item relative flex items-start gap-8 mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="timeline-dot absolute left-4 md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center z-10 shadow-lg">
                  <span className="font-oswald font-bold text-sm text-white">
                    {milestone.year.slice(2)}
                  </span>
                </div>

                {/* Timeline line segment */}
                <div className="timeline-line absolute left-4 md:left-1/2 md:-translate-x-1/2 w-0.5 h-full border-l-2 border-dashed border-brand-orange z-0" style={{ top: "40px" }} />

                {/* Content */}
                <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-[20px] p-6 border border-white/10">
                    <p className="font-oswald text-brand-orange text-2xl font-bold mb-2">
                      {milestone.year}
                    </p>
                    <h3 className="font-oswald font-bold text-xl text-white mb-2 uppercase">
                      {milestone.title}
                    </h3>
                    <p className="font-poppins text-gray-400 text-sm leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section - Overlapping design like StatisticsAndMissionSection */}
      <div ref={missionRef} className="w-full py-16 px-4 relative">
        <div className="max-w-screen-extended mx-auto relative">
          {/* Orange Statistics Box */}
          <div className="mission-orange-box bg-brand-orange rounded-3xl py-16 px-8 md:px-16 lg:px-24 shadow-lg relative overflow-hidden">
            {/* Decorative image */}
            <Image
              src="/flowerPots.svg"
              alt="Decorative"
              width={200}
              height={200}
              className="absolute top-[-30px] right-8 opacity-80 hidden lg:block"
            />
            
            <div className="relative z-10">
              <SectionHeader
                label="MAKSUZ KUTAK"
                title="Misija i vizija."
                theme="brand"
                className="mb-8"
              />

              {/* Divider Line */}
              <div className="w-full h-px bg-white/20 mb-8" />

              {/* Mission Points */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {missionPoints.map((point, index) => (
                  <div key={point.title} className="mission-card text-center md:text-left">
                    <div className="w-14 h-14 rounded-full bg-gray-900/20 flex items-center justify-center mb-4 mx-auto md:mx-0">
                      <point.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-oswald font-bold text-xl text-gray-900 mb-2 uppercase">
                      {point.title}
                    </h3>
                    <p className="font-poppins text-white/90 text-sm leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gray background section below */}
        <div className="max-w-screen-extended mx-auto mt-[-80px] bg-gray-100 pt-32 pb-16 px-8 md:px-16 rounded-[40px]">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Content */}
            <div className="flex-1">
              <SectionHeader
                label="MAKSUZ"
                title="Vaš partner za zdravlje"
                description="Više od proizvođača meda - mi smo vaši partneri u zdravom životu. Svaki proizvod koji napustimo nosi garanciju kvalitete i ljubavi s kojom je napravljen."
              >
                <div className="flex gap-4 mt-6">
                  <Link href="/shop">
                    <Button variant="brand" className="font-oswald uppercase">
                      WEBSHOP
                    </Button>
                  </Link>
                  <Link href="/kontakt">
                    <Button variant="outline" className="font-oswald uppercase border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
                      KONTAKT
                    </Button>
                  </Link>
                </div>
              </SectionHeader>
            </div>

            {/* Right Image */}
            <div className="flex-1">
              <div className="mission-image relative w-full h-[400px] rounded-[40px] overflow-hidden">
                <Image
                  src="/garden.svg"
                  alt="Maksuz Garden"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div ref={testimonialsRef} className="w-full py-24 px-4 bg-[#F4F6F0] overflow-hidden">
        <div className="testimonials-header mb-16 max-w-screen-extended mx-auto">
          <SectionHeader
            label="REFERENCE"
            title="Šta naši kupci kažu"
            description="Povjerenje naših kupaca je naša najveća nagrada. Evo što kažu o Maksuz proizvodima."
            centered
          />
        </div>

        {/* Carousel Container */}
        <div className="testimonials-carousel mx-auto max-w-screen-extended pt-[10px] overflow-x-hidden overflow-y-visible">
          {/* Continuous scrolling wrapper */}
          <div
            className="flex gap-6 items-start"
            style={{
              animation: "scroll 20s linear infinite",
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div key={index} className="flex-shrink-0 w-[350px]">
                <TestimonialCard
                  customerName={testimonial.customerName}
                  customerImage={testimonial.customerImage}
                  customerTitle={testimonial.customerTitle}
                  reviewText={testimonial.reviewText}
                  className="bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificates Section */}
      <div ref={certificatesRef} className="w-full py-24 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="certificates-header mb-16">
              <SectionHeader
                label="CERTIFIKATI"
                title="Garancija kvalitete"
                centered
              />
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="certificate-item flex flex-col items-center">
              <div className="w-28 h-28 bg-gradient-to-br from-brand-orange to-orange-600 rounded-full flex items-center justify-center shadow-xl mb-4 transform hover:scale-110 transition-transform duration-300">
                <Award className="w-14 h-14 text-white" />
              </div>
              <p className="font-oswald font-bold text-xl text-gray-900">HACCP</p>
              <p className="font-poppins text-gray-600 text-sm">Certifikat</p>
              {/* Decorative line */}
              <div className="mt-4 flex items-center gap-2">
                <div className="w-8 h-0.5 bg-brand-orange" />
                <div className="w-2 h-2 rounded-full bg-brand-orange" />
              </div>
            </div>

            <div className="certificate-item flex flex-col items-center">
              <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-xl mb-4 transform hover:scale-110 transition-transform duration-300">
                <Award className="w-14 h-14 text-white" />
              </div>
              <p className="font-oswald font-bold text-xl text-gray-900">HALAL</p>
              <p className="font-poppins text-gray-600 text-sm">Certifikat</p>
              {/* Decorative line */}
              <div className="mt-4 flex items-center gap-2">
                <div className="w-8 h-0.5 bg-green-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            </div>

            <div className="certificate-item flex flex-col items-center">
              <div className="w-28 h-28 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center shadow-xl mb-4 transform hover:scale-110 transition-transform duration-300">
                <Leaf className="w-14 h-14 text-white" />
              </div>
              <p className="font-oswald font-bold text-xl text-gray-900">100% Prirodno</p>
              <p className="font-poppins text-gray-600 text-sm">Bez aditiva</p>
              {/* Decorative line */}
              <div className="mt-4 flex items-center gap-2">
                <div className="w-8 h-0.5 bg-lime-500" />
                <div className="w-2 h-2 rounded-full bg-lime-500" />
              </div>
            </div>

            <div className="certificate-item flex flex-col items-center">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-xl mb-4 transform hover:scale-110 transition-transform duration-300">
                <Heart className="w-14 h-14 text-white" />
              </div>
              <p className="font-oswald font-bold text-xl text-gray-900">S Ljubavlju</p>
              <p className="font-poppins text-gray-600 text-sm">Od 2019.</p>
              {/* Decorative line */}
              <div className="mt-4 flex items-center gap-2">
                <div className="w-8 h-0.5 bg-blue-500" />
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
