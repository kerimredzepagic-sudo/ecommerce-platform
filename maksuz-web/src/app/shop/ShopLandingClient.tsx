"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useShopCategories, useShopProducts } from "@/hooks/useShopApi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Truck, Heart, Award, UtensilsCrossed, ShoppingBag, Loader2 } from "lucide-react";
import {
  ShopHeroSlider,
} from "@/components/shop";
import { Hero, HeroSection, SectionHeader, LocationsCarousel } from "@/components";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Benefits/features
const benefits = [
  {
    icon: Truck,
    title: "BESPLATNA DOSTAVA",
    description: "Za narudžbe preko 50 KM",
  },
  {
    icon: UtensilsCrossed,
    title: "DOMAĆA PROIZVODNJA",
    description: "Bez aditiva i konzervansa",
  },
  {
    icon: Heart,
    title: "PRAVLJENO S LJUBAVLJU",
    description: "Porodična tradicija od 2019.",
  },
  {
    icon: Award,
    title: "ZAGARANTOVAN KVALITET",
    description: "HACCP i Halal certifikat",
  },
];

// Filter interface
interface FilterOption {
  label: string;
  value: string | null;
}

// Product Card for Carousel
interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency?: string;
  image: string | null;
  className?: string;
}

function ProductCard({
  id,
  slug,
  name,
  price,
  currency = "KM",
  image,
  className,
}: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: id,
      slug,
      name,
      price,
      image: image || "/productimage.png",
      quantity: 1,
    });

    toast.success(`${name} dodano u korpu`, {
      description: "Kliknite na korpu za pregled",
    });
  };

  return (
    <Link href={`/shop/product/${slug}`}>
      <div
        className={cn(
          "flex flex-col w-[280px] h-[380px] relative justify-end cursor-pointer group",
          "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow",
          className
        )}
      >
        {/* Image Container */}
        <div className="absolute top-0 left-0 right-0 h-[220px] flex items-center justify-center p-4 overflow-hidden">
          <div className="relative w-[180px] h-[180px]">
            <Image
              src={image || "/productimage.png"}
              alt={name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Content - Product name, price, and cart icon */}
        <div className="flex items-center justify-between px-5 pb-6 pt-4 border-t border-gray-100">
          <div className="flex flex-col gap-1 flex-1 min-w-0 pr-3">
            <h4 className="font-oswald font-bold text-gray-900 uppercase text-base group-hover:text-brand-orange transition-colors truncate">
              {name}
            </h4>
            <p className="font-oswald text-gray-700 text-lg font-medium">
              {price.toFixed(2)} {currency}
            </p>
          </div>

          {/* Shopping Bag Icon */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-brand-orange hover:bg-brand-orange/90 transition-all shadow-md flex-shrink-0 hover:scale-110"
            aria-label="Dodaj u korpu"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function ShopLandingClient() {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const autoplayPlugin = useRef(
    Autoplay({ delay: 8000, stopOnInteraction: true })
  );

  // Fetch categories
  const { data: categoriesData } = useShopCategories();
  const categories = (categoriesData?.data || [])
    .filter((cat) => cat.isActive && cat.level === 0)
    .slice(0, 6);

  // Fetch featured products with category filter
  const { data: productsData, isLoading: productsLoading } = useShopProducts({
    limit: 20,
    isFeatured: true,
    isActive: true,
    category: selectedCategory || undefined,
  });
  const featuredProducts = productsData?.data || [];

  // Build filter options from categories
  const filterOptions: FilterOption[] = useMemo(() => {
    const topLevelCategories = categories
      .filter((cat) => cat.level === 0 && cat.isActive)
      .sort((a, b) => a.order - b.order)
      .slice(0, 4);

    return [
      { label: "SVI ISTAKNUTI", value: null },
      ...topLevelCategories.map((cat) => ({
        label: cat.name.toUpperCase(),
        value: cat.slug,
      })),
    ];
  }, [categories]);

  const handleFilterClick = (value: string | null) => {
    setSelectedCategory(value);
    autoplayPlugin.current.reset();
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Categories animation
      gsap.from(".category-card", {
        scrollTrigger: {
          trigger: categoriesRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Benefits animation
      gsap.from(".benefit-card", {
        scrollTrigger: {
          trigger: benefitsRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Dynamic Hero Slider */}
      <ShopHeroSlider />

      {/* Benefits Section */}
      <section
        ref={benefitsRef}
        className="py-12 bg-gray-50 border-b border-gray-100"
      >
        <div className="max-w-screen-extended mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="benefit-card flex flex-col items-center text-center p-4"
              >
                <div className="w-14 h-14 bg-brand-orange/10 rounded-full flex items-center justify-center mb-3">
                  <benefit.icon className="w-7 h-7 text-brand-orange" />
                </div>
                <h3 className="font-oswald font-bold text-gray-900 mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories & Featured Products Section */}
      <section ref={categoriesRef} className="py-16 bg-white">
        <div className="max-w-screen-extended mx-auto px-6">
          {/* Section Header with label and description */}
          <div className="mb-6">
            <SectionHeader
              label="ISTRAŽITE KATEGORIJE"
              title="Istražite naš asortiman"
              description="Pronađite savršen proizvod za sebe ili nekoga koga volite"
              centered
            />
          </div>

          {/* Filter Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {filterOptions.map((filter) => (
              <Button
                key={filter.label}
                onClick={() => handleFilterClick(filter.value)}
                variant={selectedCategory === filter.value ? "brand" : "outline"}
                className={cn(
                  "font-oswald text-sm uppercase px-6 font-bold transition-all duration-300 group",
                  selectedCategory === filter.value
                    ? "shadow-lg hover:shadow-xl hover:scale-105"
                    : "bg-[#F8F8F8] text-gray-900 border-gray-300 border hover:border-brand-orange hover:text-brand-orange hover:scale-105"
                )}
              >
                {filter.label}
                {selectedCategory === filter.value && (
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            ))}
          </div>

          {/* Featured Products Carousel */}
          <div className="w-full relative px-12">
            {productsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-gray-500 font-oswald text-lg">
                  Nema proizvoda u ovoj kategoriji
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(null)}
                  className="font-oswald uppercase"
                >
                  Pogledaj sve proizvode
                </Button>
              </div>
            ) : (
              <Carousel
                plugins={[autoplayPlugin.current]}
                opts={{
                  align: "center",
                  loop: featuredProducts.length > 4,
                  slidesToScroll: 1,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-6 py-4 justify-center">
                  {featuredProducts.map((product) => (
                    <CarouselItem key={product.id} className="pl-6 basis-auto">
                      <ProductCard
                        id={product.id}
                        slug={product.slug}
                        name={product.name}
                        price={product.price}
                        image={product.image}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/shop/products">
              <Button
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-oswald uppercase px-10"
              >
                Pogledaj sve proizvode
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            {featuredProducts.length > 0 && (
              <Link href="/shop/products?isFeatured=true">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-brand-orange text-brand-orange hover:bg-brand-orange/10 font-oswald uppercase px-10"
                >
                  Pogledaj sve istaknute
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
            </div>
          </div>
        </section>

      {/* Promotional Banner */}
      <HeroSection
        image="/ajvar.png"
        className="rounded-32 mt-8 h-[600px]"
        screen
      >
        <Hero
          headTitle="NAJTRAŽENIJI PROIZVOD"
          title="Domaca receptura i domace paprike - idealan spoj za savrsen ajvar"
          description="Autentičan bosanski ukus napravljen u skladnoj Pazar Premium proizvodnji od paprike uzorene na idealnoj i svježoj hranjici Od svežeg branja do pecerija paprike za 4 sata je naslanjeni"
          linkText1="Pogledaj kategoriju"
          linkText2="KORPORATIVNI POKLONI"
          linkHref1="/shop/products?category=slani-program"
          linkHref2="/poklon-paketi"
        />
      </HeroSection>

      {/* Locations Carousel */}
      <LocationsCarousel />
    </div>
  );
}
