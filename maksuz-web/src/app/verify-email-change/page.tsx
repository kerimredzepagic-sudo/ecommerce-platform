import { Metadata } from "next";
import VerifyEmailChangePageClient from "./VerifyEmailChangePageClient";

export const metadata: Metadata = {
  title: "Verifikacija promjene emaila | Maksuz",
  description: "Potvrdite promjenu email adrese vašeg Maksuz računa.",
  robots: { index: false, follow: false },
};

export default function VerifyEmailChangePage() {
  return <VerifyEmailChangePageClient />;
}
