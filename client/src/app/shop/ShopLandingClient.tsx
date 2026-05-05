"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useShopCategories, useShopProducts } from "@/hooks/useShopApi";
import { ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function ShopLandingClient() {
  const { data: categoriesData } = useShopCategories();
  const { data: productsData, isLoading } = useShopProducts({ limit: 8, isActive: true, isFeatured: true });
  const { addItem } = useCart();

  const categories = categoriesData?.data || [];
  const products = productsData?.data || [];

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "",
      slug: product.slug,
      quantity: 1,
    });
    toast.success("Product added to cart");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-orange-100 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-orange-600">ShopKit</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your modern e-commerce platform. Browse our products and enjoy a seamless shopping experience.
          </p>
          <Link href="/shop/products">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
              Browse Products <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/shop/products?category=${cat.slug}`}
                  className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border"
                >
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Featured Products</h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border">
                  <Link href={`/shop/product/${product.slug}`}>
                    <div className="aspect-square relative bg-gray-100">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/shop/product/${product.slug}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-orange-600 transition-colors truncate">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-orange-600">
                        {product.price.toFixed(2)} KM
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToCart(product)}
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {products.length > 0 && (
            <div className="text-center mt-10">
              <Link href="/shop/products">
                <Button variant="outline" size="lg">
                  View All Products <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
