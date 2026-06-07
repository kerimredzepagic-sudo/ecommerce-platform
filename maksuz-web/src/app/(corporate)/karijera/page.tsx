import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import KarijeraPageClient from "./KarijeraPageClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Karijera",
    description:
    "Pridružite se Maksuz timu. Pogledajte otvorene pozicije i postanite dio porodice koja proizvodi najbolje prirodne proizvode u BiH.",
  path: "/karijera",
  keywords: [
    "karijera",
    "posao",
    "zaposlenje",
    "otvorene pozicije",
    "prijava za posao",
  ],
});

export default function KarijeraPage() {
  return <KarijeraPageClient />;
}
