import { Metadata } from "next";
import VerifyCodePageClient from "./VerifyCodePageClient";

export const metadata: Metadata = {
  title: "Verifikacija koda | Maksuz",
  description: "Unesite verifikacijski kod za potvrdu identiteta.",
  robots: { index: false, follow: false },
};

export default function VerifyCodePage() {
  return <VerifyCodePageClient />;
}
