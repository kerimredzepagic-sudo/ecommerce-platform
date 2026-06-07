"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Target,
  Lightbulb,
  Sparkles,
  Heart,
  Users,
  Globe,
  TrendingUp,
  CheckCircle,
  Star,
  Compass,
  Award,
  Leaf,
  Briefcase,
  HandHeart,
} from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const missionPoints = [
  {
    icon: Target,
    title: "Naša Misija",
    description:
      "Naša misija je pronaći mjesto u vašoj kuhinji i srcu, obogatiti vašu sofru i druženja, te postati najvolji prijatelj onih koji poklanjaju srcem.",
    color: "text-red-500",
    bgColor: "bg-red-500",
  },
  {
    icon: Lightbulb,
    title: "Naša Vizija",
    description:
      "Maksuz teži postati brend broj 1 u Bosni i Hercegovini za premium prirodne proizvode – simbol kvalitete, autentičnosti i inovacije. Naš cilj je graditi dugoročnu prepoznatljivost i održiv poslovni model koji otvara put ka franšiznom širenju i međunarodnim tržištima.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500",
  },
  {
    icon: Sparkles,
    title: "Naš Način Života",
    description:
      "Maksuz nije samo brend – to je način života kroz kvalitetnu ishranu. Kroz naše proizvode želimo donijeti dodatnu vrijednost i omogućiti uživanje u istinskim, prirodnim okusima.",
    color: "text-blue-500",
    bgColor: "bg-blue-500",
  },
];

const coreValues = [
  {
    icon: Heart,
    title: "LJUBAV",
    description: "Svaki proizvod pravimo s ljubavlju i pažnjom, baš kao što su to radili naši preci. Ljubav je tajna sastojak svakog Maksuz proizvoda.",
  },
  {
    icon: Leaf,
    title: "PRIRODNOST",
    description: "100% prirodni sastojci bez aditiva, konzervansa i umjetnih boja. Vjerujemo u snagu prirode i tradicionalnih recepata.",
  },
  {
    icon: Award,
    title: "KVALITETA",
    description: "HACCP i Halal certifikovani proizvodi najvišeg kvaliteta. Nikada ne pravimo kompromise kada je u pitanju kvaliteta.",
  },
  {
    icon: Users,
    title: "PORODICA",
    description: "Porodično poduzeće gdje svaki član doprinosi uspjehu. Naša porodica je proširena na sve naše kupce i partnere.",
  },
  {
    icon: Globe,
    title: "ODRŽIVOST",
    description: "Brinemo o okolišu i budućim generacijama. Koristimo održive prakse u proizvodnji i pakovanju naših proizvoda.",
  },
  {
    icon: TrendingUp,
    title: "INOVACIJA",
    description: "Kombinujemo tradicionalne recepte sa modernim metodama proizvodnje. Stalno tražimo načine da unaprijedimo naše proizvode.",
  },
];

const achievements = [
  { number: "100+", label: "Proizvoda", description: "Širok asortiman prirodnih delicija" },
  { number: "3", label: "Sektora", description: "Proizvodnja, distribucija i maloprodaja" },
  { number: "7", label: "Godina", description: "Tradicije i iskustva" },
  { number: "20", label: "Zaposlenika", description: "Posvećen tim profesionalaca" },
];

const strategicGoals = [
  {
    icon: CheckCircle,
    title: "Kvaliteta iznad svega",
    description: "Održavamo najviše standarde kvalitete u svim fazama proizvodnje i distribucije.",
  },
  {
    icon: Star,
    title: "Zadovoljstvo kupaca",
    description: "Svaki kupac je za nas poseban. Slušamo vaše potrebe i prilagođavamo se.",
  },
  {
    icon: Compass,
    title: "Regionalno širenje",
    description: "Planiramo proširiti prisustvo na tržišta regiona i šire u narednim godinama.",
  },
  {
    icon: TrendingUp,
    title: "Kontinuirani rast",
    description: "Investiramo u razvoj novih proizvoda i unapređenje postojećih linija.",
  },
];

const strategies = [
  {
    icon: Briefcase,
    title: "Strategija poslovanja",
    description: "Strategija poslovanja Maksuza temelji se na sveobuhvatnom pristupu rastu i razvoju, od jačanja prepoznatljivosti i prisutnosti brenda na domaćem i međunarodnom tržištu, kontinuiranih ulaganja u proizvodne kapacitete, novu tehnologiju i edukaciju osoblja, do primjene digitalnih rješenja i inovativnih tehnologija, uključujući umjetnu inteligenciju.",
    highlight: "Poseban fokus stavljen je na razvoj i unapređenje lokalne zajednice - kroz stvaranje kvalitetnih radnih mjesta koja potiču ljude da ostanu i grade budućnost u BiH zajedno sa nama, te kroz razvoj domaćeg turizma i edukacije u okviru jedinstvenog koncepta našeg Api centra.",
  },
  {
    icon: HandHeart,
    title: "Društvena odgovornost",
    description: "Maksuz će i u narednom periodu nastaviti biti odgovoran i poželjan poslodavac, koji ulaže u svoje zaposlenike, brine o njihovim potrebama te aktivno doprinosi razvoju lokalne zajednice.",
    highlight: "Posvećeni smo proizvodnji kvalitetne hrane za domaće i međunarodno tržište, kao i provođenju društveno odgovornih projekata koji unapređuju zajednicu u kojoj djelujemo.",
  },
  {
    icon: Globe,
    title: "Primjer uspješne proizvodnje",
    description: "Ispunjavajući ove ciljeve, nastojat ćemo biti primjer uspješne domaće proizvodnje čija pozitivna priča nadilazi granice Bosne i Hercegovine.",
    highlight: "Želimo pokazati da kvalitetna domaća proizvodnja može konkurirati na međunarodnom tržištu, ostajući vjerna svojim korijenima i vrijednostima.",
  },
];

export function MisijaVizijaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const strategiesRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  const goalsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mission Section Animation
    if (missionRef.current) {
      const header = missionRef.current.querySelector(".mission-header");
      const cards = missionRef.current.querySelectorAll(".mission-card");
      const icons = missionRef.current.querySelectorAll(".mission-icon");
      const timeline = missionRef.current.querySelectorAll(".timeline-element");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: missionRef.current,
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
          stagger: 0.2,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: missionRef.current,
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
          stagger: 0.2,
          delay: 0.5,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        timeline,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Strategies Section Animation
    if (strategiesRef.current) {
      const header = strategiesRef.current.querySelector(".strategies-header");
      const cards = strategiesRef.current.querySelectorAll(".strategy-card");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: strategiesRef.current,
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
          duration: 0.8,
          stagger: 0.2,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: strategiesRef.current,
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
            trigger: valuesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        icons,
        { scale: 0, rotation: 180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.5,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Achievements Section Animation
    if (achievementsRef.current) {
      const items = achievementsRef.current.querySelectorAll(".achievement-item");
      const numbers = achievementsRef.current.querySelectorAll(".achievement-number");

      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: achievementsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        numbers,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.3,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: achievementsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Goals Section Animation
    if (goalsRef.current) {
      const header = goalsRef.current.querySelector(".goals-header");
      const cards = goalsRef.current.querySelectorAll(".goal-card");
      const image = goalsRef.current.querySelector(".goals-image");

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
        cards,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.15,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: goalsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      if (image) {
        gsap.fromTo(
          image,
          { opacity: 0, x: 80, scale: 0.9 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            delay: 0.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: goalsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }

    // CTA Section Animation
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
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

    // Cleanup ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full">
      {/* Mission, Vision, Goals Section */}
      <div ref={missionRef} className="w-full py-24 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="mission-header mb-16">
              <SectionHeader
                label="MAKSUZ KUTAK"
                title="Misija, Vizija i Ciljevi"
                description="Naše putovanje je vođeno jasnom vizijom i snažnom misijom. Svaki dan radimo na ostvarenju naših ciljeva, ostajući vjerni našim vrijednostima."
                centered
              />
            </div>

            {/* Mission Cards with Timeline */}
            <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-0 items-stretch">
            {/* Timeline line - hidden on mobile */}
            <div className="timeline-element hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dashed border-brand-orange/40 -translate-y-1/2" />
            
            {missionPoints.map((point, index) => (
              <div key={point.title} className="flex-1 relative flex flex-col items-center">
                {/* Timeline dot */}
                <div className="timeline-element hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-brand-orange z-10 items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>

                <div className={`mission-card w-full max-w-sm mx-auto p-8 rounded-[40px] ${index === 1 ? 'bg-gray-900 text-white lg:mt-0' : 'bg-[#F4F6F0] lg:mt-16'} ${index === 0 ? 'lg:-mt-16' : ''} ${index === 2 ? 'lg:-mt-16' : ''}`}>
                  <div className={`mission-icon w-20 h-20 rounded-full ${point.bgColor} flex items-center justify-center mb-6 mx-auto shadow-lg`}>
                    <point.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-oswald font-bold text-2xl text-center mb-4 uppercase">
                    {point.title}
                  </h3>
                  <p className={`font-poppins text-center leading-relaxed ${index === 1 ? 'text-gray-300' : 'text-gray-600'}`}>
                    {point.description}
                  </p>
                  {/* Decorative element */}
                  <div className="mt-6 flex justify-center items-center gap-2">
                    <div className={`w-8 h-0.5 ${index === 1 ? 'bg-white' : 'bg-brand-orange'}`} />
                    <div className={`w-2 h-2 rounded-full ${index === 1 ? 'bg-white' : 'bg-brand-orange'}`} />
                    <div className={`w-8 h-0.5 ${index === 1 ? 'bg-white' : 'bg-brand-orange'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* Strategies Section */}
      <div ref={strategiesRef} className="w-full py-24 px-4 md:px-8 bg-[#F4F6F0]">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="strategies-header mb-16">
              <SectionHeader
                label="NAŠE STRATEGIJE"
                title="Kako gradimo budućnost"
                description="Tri ključne strategije koje definišu naš pristup poslovanju i proizvodnji, usmjerene ka kvaliteti, zdravlju i društvenoj odgovornosti."
                centered
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {strategies.map((strategy, index) => (
              <div
                key={strategy.title}
                className="strategy-card bg-white rounded-[40px] p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center mb-6">
                  <strategy.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-oswald font-bold text-xl text-gray-900 mb-4 uppercase">
                  {strategy.title}
                </h3>
                <p className="font-poppins text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                  {strategy.description}
                </p>
                <div className="bg-brand-orange/10 rounded-2xl p-4 mt-auto">
                  <p className="font-poppins text-gray-800 text-sm leading-relaxed font-medium">
                    {strategy.highlight}
                  </p>
                </div>
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

      {/* Core Values Section */}
      <div ref={valuesRef} className="w-full py-24 px-4 md:px-8 bg-gray-900 text-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="values-header mb-16">
              <SectionHeader
                label="NAŠE VRIJEDNOSTI"
                title="Principi koji nas vode"
                description="Ove vrijednosti su temelj svega što radimo. One definišu naš identitet i usmjeravaju sve naše odluke."
                theme="dark"
                centered
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {coreValues.map((value, index) => (
              <div
                key={value.title}
                className="value-card bg-white/5 backdrop-blur-sm rounded-[30px] p-8 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="value-icon w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-oswald font-bold text-xl text-white mb-3 uppercase">
                  {value.title}
                </h3>
                <p className="font-poppins text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
                {/* Decorative line */}
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

      {/* Achievements Section - Orange Box */}
      <div ref={achievementsRef} className="w-full py-16 px-4 relative">
        <div className="max-w-screen-extended mx-auto relative">
          <div className="bg-brand-orange rounded-[50px] py-16 px-8 md:px-16 lg:px-24 shadow-xl relative overflow-hidden">
            {/* Decorative image */}
            <Image
              src="/flowerPots.svg"
              alt="Decorative"
              width={200}
              height={200}
              className="absolute top-[-30px] right-8 opacity-60 hidden lg:block"
            />
            
            <div className="relative z-10">
              <div className="mb-12">
                <SectionHeader
                  label="NAŠI USPJESI"
                  title="Brojke govore za nas."
                  theme="brand"
                  centered
                />
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/20 mb-12" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {achievements.map((achievement, index) => (
                  <div key={index} className="achievement-item text-center">
                    <p className="achievement-number font-poppins text-5xl md:text-6xl lg:text-7xl font-normal text-gray-900 mb-2">
                      {achievement.number}
                    </p>
                    <p className="font-oswald text-xl text-white font-bold uppercase mb-1">
                      {achievement.label}
                    </p>
                    <p className="font-poppins text-sm text-white/80">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Goals Section */}
      <div ref={goalsRef} className="w-full py-24 px-4 md:px-8 bg-[#F4F6F0]">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Left Side - Content */}
            <div className="flex-1">
              <div className="goals-header mb-12">
                <SectionHeader
                  label="STRATEŠKI CILJEVI"
                  title="Naš put naprijed"
                  description="Sa jasnom vizijom i predanim timom, radimo na ostvarenju naših strateških ciljeva koji će oblikovati našu budućnost."
                />
              </div>

              <div className="space-y-6">
                {strategicGoals.map((goal, index) => (
                  <div key={goal.title} className="goal-card flex items-start gap-5 bg-white rounded-[25px] p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="w-14 h-14 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                      <goal.icon className="w-7 h-7 text-brand-orange" />
                    </div>
                    <div>
                      <h3 className="font-oswald font-bold text-lg text-gray-900 mb-2 uppercase">
                        {goal.title}
                      </h3>
                      <p className="font-poppins text-gray-600 text-sm leading-relaxed">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="flex-1">
              <div className="goals-image relative w-full h-[500px] lg:h-[600px] rounded-[50px] overflow-hidden shadow-xl">
                <Image
                  src="/apiTherapyGardening.svg"
                  alt="Maksuz Strategic Vision"
                  fill
                  className="object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div ref={ctaRef} className="w-full py-24 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="bg-gray-900 rounded-[50px] p-12 md:p-16 lg:p-20 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-brand-orange/20 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-brand-orange/10 translate-x-1/4 translate-y-1/4" />
            
            <div className="relative z-10">
              <SectionHeader
                label="PRIDRUŽITE NAM SE"
                title="Postanite dio Maksuz priče"
                description="Bilo da tražite kvalitetne prirodne proizvode, partnerstvo ili želite biti dio našeg tima - vrata su vam otvorena."
                theme="dark"
                centered
                className="mb-10"
              />
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/shop">
                  <Button variant="brand" className="font-oswald uppercase px-8 py-6 text-lg">
                    WEBSHOP
                  </Button>
                </Link>
                <Link href="/kontakt">
                  <Button variant="outline" className="font-oswald uppercase px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-gray-900">
                    KONTAKT
                  </Button>
                </Link>
                <Link href="/karijera">
                  <Button variant="outline" className="font-oswald uppercase px-8 py-6 text-lg border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white">
                    KARIJERA
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
