import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import PolitikePageClient from "./PolitikePageClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Politike i Pravne Informacije",
  description:
    "Maksuz politike i pravne informacije. Politika privatnosti, uslovi korištenja, GDPR usklađenost, HACCP i ISO certifikati.",
  path: "/o-nama/politike",
  keywords: ["politike", "privatnost", "uslovi korištenja", "GDPR", "HACCP", "ISO", "pravne informacije"],
});

export default function PolitikePage() {
  return <PolitikePageClient />;
}
