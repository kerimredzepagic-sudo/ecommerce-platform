import { Metadata } from "next";
import RegisterPageClient from "./RegisterPageClient";

export const metadata: Metadata = {
  title: "Registracija | Maksuz",
  description: "Kreirajte Maksuz račun za praćenje narudžbi i pristup ekskluzivnim ponudama.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}
