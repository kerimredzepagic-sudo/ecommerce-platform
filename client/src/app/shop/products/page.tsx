import { Metadata } from "next";
import ShopProductsClient from "./ShopProductsClient";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all products in our store.",
};

export default function ShopPage() {
  return <ShopProductsClient />;
}
