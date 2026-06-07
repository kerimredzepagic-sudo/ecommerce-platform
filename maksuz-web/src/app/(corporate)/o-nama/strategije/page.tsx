import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import StrategijePageClient from "./StrategijePageClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Strategije",
  description:
    "Maksuz strateški pravci: poslovna strategija, nutritivna strategija i strategija društvene odgovornosti. Vizija i ciljevi do 2030.",
  path: "/o-nama/strategije",
  keywords: ["strategija", "vizija", "ciljevi", "poslovanje", "nutritivna", "društvena odgovornost", "budućnost"],
});

export default function StrategijePage() {
  return <StrategijePageClient />;
}
