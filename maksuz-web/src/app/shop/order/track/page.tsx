import { Metadata } from "next";
import OrderTrackClient from "./OrderTrackClient";

export const metadata: Metadata = {
  title: "Praćenje narudžbe | Maksuz Shop",
  description: "Pratite status vaše narudžbe u realnom vremenu.",
  robots: { index: false, follow: false },
};

export default function OrderTrackPage() {
  return <OrderTrackClient />;
}
