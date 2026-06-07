import { Metadata } from "next";
import VerifyEmailPageClient from "./VerifyEmailPageClient";

export const metadata: Metadata = {
  title: "Verifikacija emaila | Maksuz",
  description: "Verificirajte vašu email adresu za aktivaciju Maksuz računa.",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return <VerifyEmailPageClient />;
}
