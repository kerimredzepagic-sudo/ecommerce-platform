import { Metadata } from "next";
import OrderConfirmedClient from "./OrderConfirmedClient";

export const metadata: Metadata = {
  title: "Narudžba potvrđena | ShopKit Shop",
  description: "Vaša narudžba je uspješno kreirana. Hvala na kupovini!",
  robots: { index: false, follow: false },
};

export default function OrderConfirmedPage() {
  return <OrderConfirmedClient />;
}
