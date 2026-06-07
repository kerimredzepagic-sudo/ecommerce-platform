"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Briefcase,
  ArrowLeft,
  Building2,
  Gift,
  Target,
} from "lucide-react";
import { HeroSection, Hero } from "@/components/sections";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { usePublicCareer } from "@/hooks/useShopApi";
import { formatProductContent } from "@/lib/formatContent";

const employmentTypeLabels: Record<string, string> = {
  "full-time": "Puno radno vrijeme",
  "part-time": "Pola radnog vremena",
  contract: "Ugovor",
  internship: "Praksa",
};

export default function CareerPageClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { data: careerData, isLoading, isError } = usePublicCareer(slug);

  const career = careerData?.data;

  // Handle 404 or error
  if (isError || (!isLoading && !career)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pozicija nije pronađena
          </h1>
          <p className="text-gray-600 mb-6">
            Pozicija koju tražite ne postoji ili više nije aktivna.
          </p>
          <Link href="/karijera" className="text-brand-orange hover:underline">
            ← Povratak na sve pozicije
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || !career) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Učitavanje pozicije...</div>
      </div>
    );
  }

  // Format content for display
  const formattedContent = formatProductContent(career.fullDescription);

  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection image="/image5.svg" className="h-[500px]">
        <div className="relative flex-1 flex items-center z-10">
          <Hero
            headTitle={career.department.toUpperCase()}
            title={career.title}
            description={career.shortDescription}
            textCenter
          />
        </div>
      </HeroSection>

      {/* Back Navigation */}
      <div className="max-w-screen-extended mx-auto px-4 md:px-8 py-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/karijera")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Sve pozicije
        </Button>
      </div>

      {/* Job Details Section */}
      <section className="w-full pb-16 px-4 md:px-8">
        <div className="max-w-screen-extended mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Info Card */}
              <div className="bg-white rounded-[30px] shadow-lg p-8">
                {/* Header with badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-poppins text-gray-700">
                    <MapPin className="w-4 h-4 text-brand-orange" />
                    {career.location}
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-poppins text-gray-700">
                    <Clock className="w-4 h-4 text-brand-orange" />
                    {employmentTypeLabels[career.employmentType] ||
                      career.employmentType}
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-poppins text-gray-700">
                    <Building2 className="w-4 h-4 text-brand-orange" />
                    {career.department}
                  </span>
                </div>

                {/* Decorative line */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-0.5 bg-brand-orange" />
                  <div className="w-3 h-3 rounded-full bg-brand-orange" />
                  <div className="flex-1 border-t-2 border-dashed border-brand-orange/30" />
                </div>

                {/* Full Description */}
                <div
                  className="font-poppins text-gray-700 text-base leading-relaxed prose prose-lg max-w-none
                    prose-headings:font-oswald prose-headings:text-gray-900
                    prose-h2:text-xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8
                    prose-h3:text-lg prose-h3:font-bold prose-h3:mb-3 prose-h3:mt-6
                    prose-p:mb-4 prose-p:leading-relaxed
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-a:text-brand-orange prose-a:no-underline hover:prose-a:underline
                    prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
                    prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
                    prose-li:mb-2"
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />
              </div>

              {/* Requirements */}
              {career.requirements && career.requirements.length > 0 && (
                <div className="bg-white rounded-[30px] shadow-lg p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                      <Target className="w-6 h-6 text-brand-orange" />
                    </div>
                    <h2 className="font-oswald text-2xl font-bold text-gray-900 uppercase">
                      Zahtjevi
                    </h2>
                  </div>
                  <ul className="space-y-4">
                    {career.requirements.map((req, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-4 font-poppins text-gray-700"
                      >
                        <div className="w-6 h-6 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-lime-600" />
                        </div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Responsibilities */}
              {career.responsibilities &&
                career.responsibilities.length > 0 && (
                  <div className="bg-white rounded-[30px] shadow-lg p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-brand-orange" />
                      </div>
                      <h2 className="font-oswald text-2xl font-bold text-gray-900 uppercase">
                        Odgovornosti
                      </h2>
                    </div>
                    <ul className="space-y-4">
                      {career.responsibilities.map((resp, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-4 font-poppins text-gray-700"
                        >
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          </div>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Benefits */}
              {career.benefits && career.benefits.length > 0 && (
                <div className="bg-white rounded-[30px] shadow-lg p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                      <Gift className="w-6 h-6 text-brand-orange" />
                    </div>
                    <h2 className="font-oswald text-2xl font-bold text-gray-900 uppercase">
                      Beneficije
                    </h2>
                  </div>
                  <ul className="space-y-4">
                    {career.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-4 font-poppins text-gray-700"
                      >
                        <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-yellow-600" />
                        </div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Apply Card */}
                <div className="bg-brand-orange rounded-[30px] p-8 text-center relative overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 border-8 border-white/10 rounded-full" />
                  <div className="absolute -top-4 -left-4 w-16 h-16 border-8 border-white/10 rounded-full" />

                  <div className="relative z-10">
                    <h3 className="font-oswald text-xl font-bold text-gray-900 mb-3 uppercase">
                      Zainteresovani ste?
                    </h3>
                    <p className="font-poppins text-white/90 text-sm mb-6">
                      Pošaljite nam svoj CV i motivacijsko pismo na email
                    </p>
                    <Button
                      asChild
                      className="bg-gray-900 hover:bg-gray-800 text-white font-oswald uppercase w-full"
                    >
                      <a
                        href={`mailto:karijera@maksuz.ba?subject=Prijava za poziciju: ${career.title}`}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Prijavi se
                      </a>
                    </Button>
                    <p className="font-poppins text-white/70 text-xs mt-4">
                      karijera@maksuz.ba
                    </p>
                  </div>
                </div>

                {/* Cover Image */}
                {career.coverImage && (
                  <div className="rounded-[30px] overflow-hidden">
                    <Image
                      src={career.coverImage}
                      alt={career.title}
                      width={400}
                      height={300}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {/* Related Careers */}
                {career.relatedCareers && career.relatedCareers.length > 0 && (
                  <div className="bg-gray-100 rounded-[30px] p-6">
                    <h3 className="font-oswald text-lg font-bold text-gray-900 mb-4 uppercase">
                      Slične pozicije
                    </h3>
                    <div className="space-y-3">
                      {career.relatedCareers.map((related) => (
                        <Link
                          key={related.id}
                          href={`/karijera/${related.slug}`}
                          className="block bg-white rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <h4 className="font-oswald font-bold text-gray-900">
                            {related.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{related.location}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 px-4 md:px-8 bg-gray-900">
        <div className="max-w-screen-extended mx-auto">
          <div className="bg-[#F4F6F0] rounded-[40px] py-16 px-8 md:px-16 relative overflow-hidden">
            <div className="absolute top-8 right-8 hidden lg:block">
              <Image
                src="/hands.svg"
                alt="Decorative"
                width={120}
                height={120}
                className="opacity-80"
              />
            </div>

            <div className="relative z-10 max-w-2xl">
              <SectionHeader
                label="IMATE PITANJA?"
                title="Kontaktirajte nas za više informacija"
                description="Ako imate bilo kakvih pitanja o ovoj poziciji ili procesu prijave, slobodno nas kontaktirajte."
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="brand" className="font-oswald uppercase">
                  <a href="mailto:karijera@maksuz.ba">
                    <Send className="w-4 h-4 mr-2" />
                    Pošalji email
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="font-oswald uppercase"
                >
                  <Link href="/kontakt">Kontakt stranica</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
