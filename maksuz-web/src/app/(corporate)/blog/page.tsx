import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog",
  description:
    "Recepti, savjeti i novosti iz svijeta prirodne hrane. Naučite kako koristiti med, pekmeze i druge Maksuz proizvode u svakodnevnoj prehrani.",
  path: "/blog",
  keywords: [
    "blog",
    "recepti",
    "savjeti",
    "zdravlje",
    "prehrana",
    "med",
    "pekmez",
  ],
});

export default function BlogPage() {
  return <BlogPageClient />;
}
