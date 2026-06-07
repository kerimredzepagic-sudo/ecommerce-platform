import { Metadata } from "next";
import {
  CorporateHeroSlider,
  About,
  OrganizationStructure,
  RecommendedProducts,
  ImagesSection,
  QualitySection,
  StatisticsAndMissionSection,
  CertificatesSection,
  MarketsSection,
  LocationsCarousel,
} from "@/components";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Početna",
  description:
    "Maksuz - Porodični proizvođači prirodnih delicija iz srca Bosne i Hercegovine. Otkrijte naš asortiman meda, pekmeza, sokova, namaza i premium poklon paketa.",
  path: "/",
  keywords: [
    "domaći proizvodi",
    "bosanski med",
    "pekmez",
    "prirodna hrana",
    "poklon paketi",
  ],
});

export default function Home() {
  return (
    <div className="relative">
      <CorporateHeroSlider />
      <About />
      <OrganizationStructure />
      <RecommendedProducts />
      <ImagesSection />
      <QualitySection />
      <StatisticsAndMissionSection />
      <CertificatesSection />
      <MarketsSection />
      <LocationsCarousel />
    </div>
  );
}
