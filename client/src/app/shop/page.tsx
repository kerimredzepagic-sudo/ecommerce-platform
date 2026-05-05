import { Metadata } from "next";
import ShopLandingClient from "./ShopLandingClient";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our products and find what you need.",
};

export default function ShopLandingPage() {
  return <ShopLandingClient />;
}
