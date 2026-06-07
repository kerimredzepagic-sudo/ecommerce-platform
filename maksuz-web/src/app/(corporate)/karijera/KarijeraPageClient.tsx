"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Heart,
  TrendingUp,
  MapPin,
  Clock,
  Send,
  Target,
  Sparkles,
  Award,
  ArrowRight,
} from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { usePublicCareers } from "@/hooks/useShopApi";

const benefits = [
  {
    icon: Users,
    title: "Timski Duh",
    description:
      "Radite u prijateljskom okruženju sa kolegama koji postaju prijatelji",
    color: "text-blue-500",
  },
  {
    icon: TrendingUp,
    title: "Razvoj Karijere",
    description: "Kontinuirana edukacija i mogućnosti napredovanja",
    color: "text-green-500",
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    description: "Fleksibilno radno vrijeme i podrška za lični život",
    color: "text-red-500",
  },
  {
    icon: Briefcase,
    title: "Konkurentna Primanja",
    description: "Fer plate, bonusi i dodatne beneficije",
    color: "text-yellow-500",
  },
];

const coreValues = [
  {
    icon: Target,
    title: "Poštovanje",
    description: "Cijenimo svakog člana tima i njegovu jedinstvenu perspektivu",
  },
  {
    icon: Award,
    title: "Kvaliteta",
    description: "U svemu što radimo težimo izvrsnosti i visokim standardima",
  },
  {
    icon: Sparkles,
    title: "Inovacija",
    description: "Kontinuirano učimo i unapređujemo naše procese i proizvode",
  },
];

const valuesList = [
  "Poštovanje i integritet",
  "Kvaliteta u svemu što radimo",
  "Timski rad i saradnja",
  "Kontinuirano učenje",
  "Odgovornost prema zajednici",
];

const employmentTypeLabels: Record<string, string> = {
  "full-time": "Puno radno vrijeme",
  "part-time": "Pola radnog vremena",
  contract: "Ugovor",
  internship: "Praksa",
};

export default function KarijeraPageClient() {
  const { data: careersData, isLoading } = usePublicCareers({ limit: 20 });

  const openPositions = careersData?.data || [];

  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image5.svg" className="h-[300px] md:h-[350px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle="KARIJERA U MAKSUZU"
            title="Gradite budućnost sa nama"
            description="Postanite dio tima koji stvara najbolje prirodne proizvode u BiH. Nudimo izazovno radno okruženje, mogućnosti za razvoj i poticajnu atmosferu."
            textCenter
          />
        </div>
      </HeroSection>

      {/* Benefits Section - Styled like homepage values */}
      <section className="w-full py-24 px-4 md:px-8 bg-[#F4F6F0]">
        <div className="max-w-screen-extended mx-auto">
          <div className="max-w-screen mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <SectionHeader
                label="ZAŠTO MI"
                title="Zašto raditi u Maksuzu?"
                description="Pridružite se timu koji cijeni svoje zaposlenike i gradi kulturu zasnovanu na povjerenju, razvoju i zajedničkom uspjehu."
                centered
              />
            </div>

            {/* Benefit Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-[30px] p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center mb-6">
                  <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                </div>
                <h3 className="font-oswald font-bold text-xl text-gray-900 mb-3 uppercase">
                  {benefit.title}
                </h3>
                <p className="font-poppins text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
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
      </section>

      {/* Open Positions Section - With orange overlay header */}
      <section className="w-full py-16 px-4 relative">
        <div className="max-w-screen-extended mx-auto relative">
          {/* Orange Header Box */}
          <div className="bg-brand-orange rounded-3xl py-12 px-8 md:px-16 shadow-lg relative overflow-hidden">
            {/* Decorative image */}
            <Image
              src="/flowerPots.svg"
              alt="Decorative"
              width={180}
              height={180}
              className="absolute top-[-20px] right-8 opacity-80 hidden lg:block"
            />

            <div className="relative z-10">
              <SectionHeader
                label="OTVORENE POZICIJE"
                title="Pronađite svoju priliku."
                description={isLoading
                  ? "Učitavanje pozicija..."
                  : openPositions.length > 0
                  ? "Trenutno tražimo motivirane pojedince za sljedeće pozicije. Provjerite zahtjeve i prijavite se već danas."
                  : "Trenutno nemamo otvorenih pozicija. Pošaljite otvorenu prijavu i kontaktirat ćemo vas kada se pojavi prilika."}
                theme="brand"
              />
            </div>

            {/* Divider Line */}
            <div className="w-full h-px bg-white/20 mt-8" />
          </div>
        </div>

        {/* Job Listings - Gray container below orange */}
        <div className="max-w-screen-extended mx-auto mt-[-40px] bg-gray-100 pt-24 pb-16 px-8 md:px-16 rounded-[40px]">
          <div className="max-w-4xl mx-auto space-y-8">
            {isLoading ? (
              // Loading skeleton
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-[30px] p-8 animate-pulse"
                  >
                    <div className="flex items-start gap-6 mb-6">
                      <div className="w-14 h-14 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : openPositions.length === 0 ? (
              // No positions message
              <div className="bg-white rounded-[30px] p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-brand-orange/10 flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-brand-orange" />
                </div>
                <h3 className="font-oswald text-2xl font-bold text-gray-900 mb-4">
                  Nema otvorenih pozicija
                </h3>
                <p className="font-poppins text-gray-600 mb-6 max-w-md mx-auto">
                  Trenutno nemamo aktivnih oglasa za posao. Pošaljite otvorenu
                  prijavu i obavijestit ćemo vas kada se pojavi nova prilika.
                </p>
                <Button
                  asChild
                  variant="brand"
                  className="font-oswald uppercase"
                >
                  <a href="mailto:karijera@maksuz.ba?subject=Otvorena prijava">
                    <Send className="w-4 h-4 mr-2" />
                    Pošalji otvorenu prijavu
                  </a>
                </Button>
              </div>
            ) : (
              // Job listings
              openPositions.map((position, index) => (
                <div
                  key={position.id}
                  className="bg-white rounded-[30px] shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-8">
                    {/* Header with position number */}
                    <div className="flex items-start gap-6 mb-6">
                      <div className="w-14 h-14 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
                        <span className="font-oswald text-xl font-bold text-white">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="font-oswald text-2xl font-bold text-gray-900 uppercase">
                              {position.title}
                            </h3>
                            <p className="font-poppins text-brand-orange font-medium mt-1">
                              {position.department}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-poppins text-gray-700">
                              <MapPin className="w-4 h-4 text-brand-orange" />
                              {position.location}
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-poppins text-gray-700">
                              <Clock className="w-4 h-4 text-brand-orange" />
                              {employmentTypeLabels[position.employmentType] ||
                                position.employmentType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative line */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-0.5 bg-brand-orange" />
                      <div className="w-3 h-3 rounded-full bg-brand-orange" />
                      <div className="flex-1 border-t-2 border-dashed border-brand-orange/30" />
                    </div>

                    <p className="font-poppins text-gray-600 mb-6 leading-relaxed">
                      {position.shortDescription}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        asChild
                        variant="brand"
                        className="font-oswald uppercase"
                      >
                        <Link href={`/karijera/${position.slug}`}>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Pogledaj detalje
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="font-oswald uppercase"
                      >
                        <a
                          href={`mailto:karijera@maksuz.ba?subject=Prijava za poziciju: ${position.title}`}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Prijavi se
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Values Section - Overlapping design like StatisticsAndMissionSection */}
      <section className="w-full py-16 px-4 relative">
        <div className="max-w-screen-extended mx-auto relative">
          {/* Orange Box with Values */}
          <div className="bg-brand-orange rounded-3xl py-16 px-8 md:px-16 lg:px-24 shadow-lg relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -bottom-16 -right-16 w-48 h-48 border-8 border-white/10 rounded-full" />
            <div className="absolute -top-12 -left-12 w-32 h-32 border-8 border-white/10 rounded-full" />

            <div className="relative z-10">
              <SectionHeader
                label="NAŠE VRIJEDNOSTI"
                title="Što nas pokreće."
                theme="brand"
              />

              {/* Divider Line */}
              <div className="w-full h-px bg-white/20 my-8" />

              {/* Value Points */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {coreValues.map((value) => (
                  <div key={value.title} className="text-center md:text-left">
                    <div className="w-14 h-14 rounded-full bg-gray-900/20 flex items-center justify-center mb-4 mx-auto md:mx-0">
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-oswald font-bold text-xl text-gray-900 mb-2 uppercase">
                      {value.title}
                    </h3>
                    <p className="font-poppins text-white/90 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gray section below with content */}
        <div className="max-w-screen-extended mx-auto mt-[-60px] bg-gray-100 pt-32 pb-16 px-8 md:px-16 rounded-[40px]">
          <div className="flex flex-col lg:flex-row gap-12 items-center max-w-screen mx-auto">
            {/* Left Content */}
            <div className="flex-1">
              <SectionHeader
                label="MAKSUZ"
                title="Kultura koja inspiriše"
                description="U Maksuzu vjerujemo da su ljudi naš najveći resurs. Gradimo kulturu zasnovanu na poštovanju, povjerenju i zajedničkom uspjehu."
              />

              {/* Values List */}
              <ul className="space-y-4">
                {valuesList.map((value, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-brand-orange flex-shrink-0" />
                    <span className="font-poppins text-gray-700">{value}</span>
                  </li>
                ))}
              </ul>

              {/* Decorative line */}
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-0.5 bg-brand-orange" />
                <div className="w-3 h-3 rounded-full bg-brand-orange" />
                <div className="flex-1 border-t-2 border-dashed border-brand-orange/40" />
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1">
              <div className="relative w-full h-[400px] rounded-[40px] overflow-hidden bg-[#F4F6F0] flex items-center justify-center">
                <Image
                  src="/MAKSUZ_orange_logo.png"
                  alt="Maksuz Tim"
                  width={280}
                  height={280}
                  className="object-contain"
                />
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-brand-orange/10 rounded-full" />
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-brand-orange/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Application CTA - Orange branded section */}
      <section className="w-full py-24 px-4 md:px-8 bg-gray-900">
        <div className="max-w-screen-extended mx-auto">
          <div className="bg-brand-orange rounded-[40px] py-16 px-8 md:px-16 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -bottom-20 -right-20 w-56 h-56 border-8 border-white/10 rounded-full" />
            <div className="absolute top-8 right-8 hidden lg:block">
              <Image
                src="/hands.svg"
                alt="Decorative"
                width={120}
                height={120}
                className="opacity-80"
              />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <SectionHeader
                label="NE VIDITE POZICIJU ZA VAS?"
                title="Pošaljite otvorenu prijavu"
                description="Uvijek smo u potrazi za talentiranim i motiviranim ljudima. Pošaljite nam svoj CV i motivacijsko pismo, a mi ćemo vas kontaktirati kada se pojavi prikladna pozicija."
                theme="brand"
                centered
              />

              {/* Divider */}
              <div className="w-24 h-px bg-white/30 mx-auto my-8" />

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-gray-900 hover:bg-gray-800 text-white font-oswald uppercase px-8 py-6 text-lg"
                >
                  <a href="mailto:karijera@maksuz.ba?subject=Otvorena prijava">
                    <Send className="w-5 h-5 mr-2" />
                    Pošalji Prijavu
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white bg-transparent hover:bg-white/10 font-oswald uppercase px-8 py-6 text-lg"
                >
                  <Link href="/kontakt">Kontaktirajte Nas</Link>
                </Button>
              </div>

              <p className="font-poppins text-white/70 text-sm mt-8">
                Email: karijera@maksuz.ba | Tel: +387 62 200 088
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
