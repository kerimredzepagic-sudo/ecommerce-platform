import { Metadata } from "next";
import LoginPageClient from "./LoginPageClient";

export const metadata: Metadata = {
  title: "Prijava | Maksuz",
  description: "Prijavite se na svoj Maksuz račun za pristup narudžbama i postavkama.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginPageClient />;
}
