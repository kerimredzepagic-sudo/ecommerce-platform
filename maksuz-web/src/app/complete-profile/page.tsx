import { Metadata } from "next";
import CompleteProfilePageClient from "./CompleteProfilePageClient";

export const metadata: Metadata = {
  title: "Dovršite profil | Maksuz",
  description: "Dovršite podešavanje vašeg Maksuz profila.",
  robots: { index: false, follow: false },
};

export default function CompleteProfilePage() {
  return <CompleteProfilePageClient />;
}
