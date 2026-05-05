import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ProductPageClient from "./ProductPageClient";

export const metadata: Metadata = {
  title: "Product Details",
};

function ProductPageLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
    </div>
  );
}

export default async function ProductPage() {
  return (
    <Suspense fallback={<ProductPageLoading />}>
      <ProductPageClient />
    </Suspense>
  );
}
