import { Metadata } from "next";
import ForgotPasswordPageClient from "./ForgotPasswordPageClient";

export const metadata: Metadata = {
  title: "Zaboravljena lozinka | Maksuz",
  description: "Zatražite link za resetovanje lozinke vašeg Maksuz računa.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />;
}
