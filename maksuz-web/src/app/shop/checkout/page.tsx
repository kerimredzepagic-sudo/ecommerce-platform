import { Metadata } from "next";
import CheckoutPageClient from "./CheckoutPageClient";

export const metadata: Metadata = {
  title: "Završi kupovinu | Maksuz Shop",
  description: "Završite vašu narudžbu na Maksuz webshopu.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
