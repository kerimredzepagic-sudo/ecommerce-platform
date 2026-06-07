import { Metadata } from "next";
import ResetPasswordPageClient from "./ResetPasswordPageClient";

export const metadata: Metadata = {
  title: "Resetovanje lozinke | Maksuz",
  description: "Postavite novu lozinku za vaš Maksuz račun.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <ResetPasswordPageClient />;
}
