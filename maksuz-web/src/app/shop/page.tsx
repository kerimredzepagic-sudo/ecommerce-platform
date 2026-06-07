import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import ShopLandingClient from "./ShopLandingClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Web Shop",
  description:
    "Maksuz online trgovina - Naručite prirodne proizvode iz Bosne i Hercegovine. Med, pekmezi, sokovi, namazi i još mnogo toga. Brza dostava.",
  path: "/shop",
  keywords: [
    "web shop",
    "online kupovina",
    "prirodni proizvodi",
    "dostava",
    "med",
    "pekmez",
    "sok",
  ],
});

export default function ShopLandingPage() {
  return <ShopLandingClient />;
}
