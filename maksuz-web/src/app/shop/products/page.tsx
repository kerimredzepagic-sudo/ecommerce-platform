import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import ShopProductsClient from "./ShopProductsClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Svi Proizvodi",
  description:
    "Istražite kompletan asortiman Maksuz proizvoda. Med, pekmezi, sokovi, namazi, ajvar i još mnogo toga. Brza dostava širom BiH.",
  path: "/shop/products",
  keywords: [
    "kupovina",
    "web shop",
    "prirodni proizvodi",
    "med",
    "pekmez",
    "sok",
    "namaz",
    "ajvar",
  ],
});

export default function ShopPage() {
  return <ShopProductsClient />;
}
