"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatedPromotionalBanner, ShareModal } from "@/components/shop";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useShopProduct,
  type ShopProductDetail,
  type ShopProductVariant,
} from "@/hooks/useShopApi";
import { Loader2, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { formatProductContent, getPlainTextExcerpt } from "@/lib/formatContent";
import {
  Hero,
  HeroSection,
  RecommendedProducts,
} from "@/components";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Mock recommended products
const recommendedProducts = [
  {
    id: "1",
    name: "DADEL & TAHINKRAM",
    price: 20.0,
    currency: "USD",
    image: "/productimage.png",
  },
  {
    id: "2",
    name: "ACACIA HONEY",
    price: 25.0,
    currency: "KM",
    image: "/productimage.png",
  },
  {
    id: "3",
    name: "MANUKA HONEY",
    price: 25.0,
    currency: "KM",
    image: "/productimage.png",
  },
];

// Mock Api Terapije products
const apiTerapijeProducts = [
  {
    id: "1",
    name: "API MINI",
    price: 25,
    currency: "Maraka",
    image: "/productimage.png",
  },
  {
    id: "2",
    name: "API FULL",
    price: null,
    description: "Proizvod koji liječi duša.",
    image: "/productimage.png",
  },
  {
    id: "3",
    name: "PAKET 4 TRETMANA",
    price: null,
    description: "Proizvod koji liječi duša.",
    image: "/productimage.png",
    discount: "-20 % AKCIJA",
  },
  {
    id: "4",
    name: "PAKET 8 TRETMANA",
    price: null,
    description: "Proizvod koji liječi duša.",
    image: "/productimage.png",
    discount: "-20 % AKCIJA",
  },
];

const categoryTabs = [
  "SVI ISTAKNUTI",
  "MED",
  "PČELA & SOKOVI",
  "NAMAZI & PUTERI",
];

// Line configuration with colors and logos
const LINE_CONFIG: Record<
  string,
  { color: string; logo: string; name: string }
> = {
  premium: {
    color: "#673626",
    logo: "/maksuz_logos/MAKSUZ_Premium_light.png",
    name: "Maksuz Premium",
  },
  originals: {
    color: "#431E10",
    logo: "/maksuz_logos/MAKSUZ_Originals_no background.png",
    name: "Maksuz Originals",
  },
  health: {
    color: "#ED5926",
    logo: "/maksuz_logos/MAKSUZ_Health_no background.png",
    name: "Maksuz Health",
  },
  energy: {
    color: "#ED5926",
    logo: "/maksuz_logos/MAKSUZ_white Energy.png",
    name: "Maksuz Energy",
  },
};

export default function ProductPageClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params.id as string;

  const { data: productResponse, isLoading, isError } = useShopProduct(slug);
  const productData = productResponse?.data;
  const { addItem } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("OSNOVNE INFORMACIJE");
  const [activeCategory, setActiveCategory] = useState("SVI ISTAKNUTI");
  const [selectedImage, setSelectedImage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Zoom state
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const productImageRef = useRef<HTMLDivElement>(null);
  const productDetailsRef = useRef<HTMLDivElement>(null);
  const recommendedRef = useRef<HTMLElement>(null);
  const apiTerapijeRef = useRef<HTMLElement>(null);

  // Extract size options from variants
  const sizeOptions = useMemo(() => {
    if (!productData?.variants || productData.variants.length === 0) return [];
    return productData.variants.map((variant) => {
      // Try to extract size from attributes (Pakovanje, Masa) or use variant name
      const sizeAttr = variant.attributes.find(
        (attr) =>
          attr.key === "Pakovanje" ||
          attr.key === "Masa" ||
          attr.key.toLowerCase() === "size"
      );
      return {
        id: variant.id,
        label: sizeAttr?.value || variant.name,
        variant,
      };
    });
  }, [productData]);

  // Get selected variant
  const selectedVariant = useMemo(() => {
    if (!selectedVariantId || !productData) return null;
    return productData.variants.find((v) => v.id === selectedVariantId) || null;
  }, [selectedVariantId, productData]);

  // Calculate current price (variant price or base price)
  const currentPrice = useMemo(() => {
    if (!productData) return 0;
    if (selectedVariant && selectedVariant.price !== undefined) {
      return selectedVariant.price;
    }
    return productData.price;
  }, [productData, selectedVariant]);

  // Calculate compare at price (variant compareAtPrice or base compareAtPrice)
  const currentCompareAtPrice = useMemo(() => {
    if (!productData) return undefined;
    // Variants don't have compareAtPrice in the API, so use base product's compareAtPrice
    return productData.compareAtPrice;
  }, [productData]);

  // Get product images
  const productImages = useMemo(() => {
    if (!productData) return [];
    return productData.images.map((img) => img.url);
  }, [productData]);

  // Zoom handlers
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsZooming(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsZooming(false);
    setZoomPosition({ x: 50, y: 50 });
  }, []);

  // Lightbox handlers
  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const goToPrevImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev > 0 ? prev - 1 : productImages.length - 1
    );
  }, [productImages.length]);

  const goToNextImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev < productImages.length - 1 ? prev + 1 : 0
    );
  }, [productImages.length]);

  // Share handler - tries Web Share API first, falls back to modal
  const handleShare = useCallback(async () => {
    const shareData = {
      title: productData?.name || "Maksuz Proizvod",
      text:
        productData?.shortDescription ||
        `Pogledajte ${productData?.name || "ovaj proizvod"}`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    // Try Web Share API first (works on mobile and some desktop browsers)
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or error - fall through to modal
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }

    // Fall back to share modal
    setShareModalOpen(true);
  }, [productData]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevImage();
      if (e.key === "ArrowRight") goToNextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, closeLightbox, goToPrevImage, goToNextImage]);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set first variant as selected by default when product loads
  useEffect(() => {
    if (productData && productData.variants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(productData.variants[0].id);
    }
  }, [productData, selectedVariantId]);

  useEffect(() => {
    if (!productData) return;

    // Animate product image
    gsap.fromTo(
      productImageRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
    );

    // Animate product details
    gsap.fromTo(
      productDetailsRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.4 }
    );

    // Animate recommended section on scroll
    if (recommendedRef.current) {
      gsap.fromTo(
        recommendedRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: recommendedRef.current,
            start: "top 80%",
          },
        }
      );
    }

    // Animate api terapije section on scroll
    if (apiTerapijeRef.current) {
      gsap.fromTo(
        apiTerapijeRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: apiTerapijeRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, [productData]);

  const tabs = [
    "OSNOVNE INFORMACIJE",
    "DOSTAVA I POVRAT",
    "SASTAV I NUTRITIVNE VRIJEDNOSTI",
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  // Error state
  if (isError || !productData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Proizvod nije pronađen</p>
          <Link href="/shop">
            <Button>Nazad na prodavnicu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-16 md:top-20 left-0 right-0 z-40">
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-brand-orange transition-all duration-100 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <div className="min-h-screen bg-white">
        {/* Product Hero Section */}
        <section ref={heroRef} className="relative">
            <div className="max-w-screen-extended mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-8 sm:pb-16 relative z-10">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left - Sticky Product Images Section */}
              <div ref={productImageRef} className="relative lg:w-[50%]">
                <div className="lg:sticky lg:top-[92px]">
                  <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                    {/* Thumbnails - Horizontal on mobile, vertical on desktop */}
                    {productImages.length > 0 && (
                      <div className="flex sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
                        {productImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={cn(
                              "w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-all bg-white p-1.5 sm:p-2 flex-shrink-0",
                              selectedImage === idx
                                ? "border-brand-orange"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <Image
                              src={img}
                              alt={`${productData.name} ${idx + 1}`}
                              width={72}
                              height={72}
                              className="object-contain w-full h-full"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Main Image with Orange Background */}
                    <div className="relative flex-1 bg-brand-orange rounded-2xl sm:rounded-3xl p-[1px] min-h-[280px] sm:min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
                      {/* White Card with Product Image - Zoomable */}
                      <div
                        ref={imageContainerRef}
                        className="bg-white rounded-[15px] sm:rounded-[23px] p-4 sm:p-6 lg:p-8 w-full h-full flex items-center justify-center min-h-[220px] sm:min-h-[320px] lg:min-h-[420px] cursor-zoom-in relative overflow-hidden group"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() =>
                          productImages.length > 0 &&
                          openLightbox(selectedImage)
                        }
                      >
                        {productImages.length > 0 ? (
                          <>
                            {/* Normal Image */}
                            <Image
                              src={
                                productImages[selectedImage] || productImages[0]
                              }
                              alt={productData.name}
                              width={280}
                              height={380}
                              className={cn(
                                "object-contain max-h-[180px] sm:max-h-[280px] lg:max-h-[350px] transition-opacity duration-200",
                                isZooming ? "opacity-0" : "opacity-100"
                              )}
                            />
                            {/* Zoomed Image */}
                            <div
                              className={cn(
                                "absolute inset-0 transition-opacity duration-200 pointer-events-none",
                                isZooming ? "opacity-100" : "opacity-0"
                              )}
                              style={{
                                backgroundImage: `url(${productImages[selectedImage] || productImages[0]})`,
                                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                backgroundSize: "200%",
                                backgroundRepeat: "no-repeat",
                              }}
                            />
                            {/* Zoom indicator */}
                            <div
                              className={cn(
                                "absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full transition-opacity duration-200",
                                isZooming
                                  ? "opacity-0"
                                  : "opacity-0 group-hover:opacity-100"
                              )}
                            >
                              <ZoomIn className="w-5 h-5" />
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-400">Nema slike</div>
                        )}
                      </div>
 
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Product Details */}
              <div
                ref={productDetailsRef}
                className="flex-1 bg-white p-4 sm:p-6 lg:p-8"
              >
                {/* Product Info with Line Logo */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Category Badge */}
                    {productData.category && (
                      <span className="inline-block bg-brand-orange text-white text-xs font-oswald uppercase px-3 py-1 rounded-full mb-4">
                        {productData.category.name}
                      </span>
                    )}

                    {/* Product Name */}
                    <h1 className="font-oswald text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {productData.name}
                    </h1>

                    {/* Price */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="font-oswald text-xl sm:text-2xl font-bold text-gray-900">
                        {currentPrice.toFixed(2)} KM
                      </span>
                      {productData.isOnSale &&
                        currentCompareAtPrice && (
                          <span className="font-oswald text-lg text-gray-400 line-through">
                            {currentCompareAtPrice.toFixed(2)} KM
                          </span>
                        )}
                      {!productData.inStock && (
                        <span className="bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Nema na zalihama
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Line Logo */}
                  {productData.line && LINE_CONFIG[productData.line] && (
                    <div className="flex-shrink-0">
                      <Image
                        src={LINE_CONFIG[productData.line].logo}
                        alt={LINE_CONFIG[productData.line].name}
                        width={80}
                        height={80}
                        className="object-contain w-20 h-20 sm:w-24 sm:h-24"
                      />
                    </div>
                  )}
                </div>

                {/* Description Pill with Share Button */}
                <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                  <span className="inline-block border border-gray-300 text-gray-700 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full max-w-[85%] truncate">
                    {getPlainTextExcerpt(
                      productData.shortDescription || productData.description,
                      100
                    )}
                  </span>
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Podijeli proizvod"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </button>
                    <ShareModal
                      isOpen={shareModalOpen}
                      onClose={() => setShareModalOpen(false)}
                      title={productData.name}
                      text={
                        productData.shortDescription ||
                        `Pogledajte ${productData.name}`
                      }
                      url={
                        typeof window !== "undefined"
                          ? window.location.href
                          : ""
                      }
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-4 sm:mb-6">
                  <label className="block font-oswald text-sm font-medium text-gray-700 mb-2">
                    Kolicina
                  </label>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 sm:px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        −
                      </button>
                      <span className="px-3 sm:px-4 py-2 font-oswald">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 sm:px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-oswald text-lg sm:text-xl font-bold">
                        {(currentPrice * quantity).toFixed(2)} KM
                      </span>
                      {productData.isOnSale &&
                        currentCompareAtPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            {(currentCompareAtPrice * quantity).toFixed(2)} KM
                          </span>
                        )}
                    </div>
                  </div>
                </div>

                {/* Size Selector */}
                {sizeOptions.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <label className="font-oswald text-sm font-medium text-gray-700">
                        Masa
                      </label>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <span>Size Guide</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {sizeOptions.map((sizeOption) => (
                        <button
                          key={sizeOption.id}
                          onClick={() => setSelectedVariantId(sizeOption.id)}
                          className={cn(
                            "px-4 sm:px-6 py-1.5 sm:py-2 border rounded-lg font-oswald text-xs sm:text-sm transition-all",
                            selectedVariantId === sizeOption.id
                              ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                              : "border-gray-300 hover:border-gray-400"
                          )}
                        >
                          {sizeOption.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Short Description */}
                {productData.shortDescription && (
                  <div className="mb-4 sm:mb-6">
                    <label className="block font-oswald text-sm font-medium text-gray-700 mb-2">
                      Kratak opis
                    </label>
                    <p className="text-gray-600 text-sm">
                      {productData.shortDescription}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  {productData.inStock ? (
                    <>
                      <Button
                        onClick={() => {
                          addItem({
                            productId: productData.id,
                            slug: productData.slug,
                            name: productData.name,
                            price: currentPrice,
                            image: productImages[0] || "/productimage.png",
                            quantity,
                            variantId: selectedVariantId || undefined,
                            variantName: selectedVariant?.name,
                          });
                          toast.success(`${productData.name} dodano u korpu`, {
                            description: `Količina: ${quantity}`,
                          });
                        }}
                        className="flex-1 font-oswald uppercase bg-gray-900 text-white hover:bg-gray-800 py-6"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="mr-2"
                        >
                          <path d="M6 7H18L17 14H7L6 7ZM6 7L5 3H3M9 19C9.55228 19 10 18.5523 10 18C10 17.4477 9.55228 17 9 17C8.44772 17 8 17.4477 8 18C8 18.5523 8.44772 19 9 19ZM17 19C17.5523 19 18 18.5523 18 18C18 17.4477 17.5523 17 17 17C16.4477 17 16 17.4477 16 18C16 18.5523 16.4477 19 17 19Z" />
                        </svg>
                        DODAJ U KORPU
                      </Button>
                      <Button
                        onClick={() => {
                          addItem({
                            productId: productData.id,
                            slug: productData.slug,
                            name: productData.name,
                            price: currentPrice,
                            image: productImages[0] || "/productimage.png",
                            quantity,
                            variantId: selectedVariantId || undefined,
                            variantName: selectedVariant?.name,
                          });
                          router.push("/shop/checkout");
                        }}
                        className="flex-1 font-oswald uppercase bg-brand-orange text-white hover:bg-brand-orange/90 py-6"
                      >
                        IDI NA KASU
                      </Button>
                    </>
                  ) : (
                    <Button
                      disabled
                      className="flex-1 font-oswald uppercase bg-gray-300 text-gray-500 cursor-not-allowed py-6"
                    >
                      NEMA NA ZALIHAMA
                    </Button>
                  )}
                </div>

                {/* Product Tabs & Description - Inside Details Panel */}
                <div className="border-t border-gray-200 pt-4 sm:pt-6">
                  {/* Tabs */}
                  <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto pb-0 -mb-px">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "font-oswald text-[10px] sm:text-xs lg:text-sm uppercase py-2 sm:py-3 transition-colors relative whitespace-nowrap flex-shrink-0",
                          activeTab === tab
                            ? "text-brand-orange font-bold"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        {tab}
                        {activeTab === tab && (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-orange" />
                        )}
                      </button>
                    ))}
                    <button className="ml-auto p-2 hover:bg-gray-100 rounded-lg flex-shrink-0 hidden sm:block">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="prose max-w-none">
                    {activeTab === "OSNOVNE INFORMACIJE" && (
                      <div
                        className="text-gray-600 text-sm leading-relaxed [&_p]:mb-2 [&_ul]:my-3 [&_li]:mb-1"
                        dangerouslySetInnerHTML={{
                          __html: formatProductContent(productData.description),
                        }}
                      />
                    )}
                    {activeTab === "DOSTAVA I POVRAT" && (
                      <div className="text-gray-600 text-sm leading-relaxed space-y-4">
                        <div>
                          <h3 className="font-oswald font-bold text-gray-900 mb-2">
                            Dostava
                          </h3>
                          <p>
                            Dostavljamo proizvode širom Bosne i Hercegovine.
                            Vrijeme dostave je obično 2-5 radnih dana, ovisno o
                            lokaciji. Besplatna dostava za narudžbe preko 50 KM.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-oswald font-bold text-gray-900 mb-2">
                            Povrat i zamjena
                          </h3>
                          <p>
                            Imate pravo na povrat proizvoda u roku od 14 dana od
                            dana primitka, bez objašnjenja razloga. Proizvod
                            mora biti u originalnom pakovanju i neiskorišten.
                            Troškovi povrata snosi kupac.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-oswald font-bold text-gray-900 mb-2">
                            Kontakt
                          </h3>
                          <p>
                            Za sva pitanja o dostavi i povratu, kontaktirajte
                            nas putem emaila ili telefona.
                          </p>
                        </div>
                      </div>
                    )}
                    {activeTab === "SASTAV I NUTRITIVNE VRIJEDNOSTI" && (
                      <div className="text-gray-600 text-sm leading-relaxed [&_p]:mb-2 [&_ul]:my-3 [&_li]:mb-1">
                        {productData.nutritionalInfo ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: formatProductContent(
                                productData.nutritionalInfo
                              ),
                            }}
                          />
                        ) : (
                          <p>
                            Informacije o nutritivnim vrijednostima nisu
                            dostupne za ovaj proizvod.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Products Section */}
        <RecommendedProducts />

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
      </div>

      {/* Image Lightbox */}
      {lightboxOpen && productImages.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
            aria-label="Zatvori"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous button */}
          {productImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-10"
              aria-label="Prethodna slika"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Next button */}
          {productImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-10"
              aria-label="Sljedeća slika"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Main image container */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={productImages[lightboxIndex]}
              alt={productData?.name || "Product image"}
              width={1200}
              height={1200}
              className="object-contain max-w-full max-h-[85vh] select-none"
              priority
            />
          </div>

          {/* Thumbnail navigation */}
          {productImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-xl">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(idx);
                  }}
                  className={cn(
                    "w-12 h-12 rounded-lg overflow-hidden border-2 transition-all",
                    lightboxIndex === idx
                      ? "border-brand-orange"
                      : "border-transparent hover:border-white/50"
                  )}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white/70 font-oswald text-sm">
            {lightboxIndex + 1} / {productImages.length}
          </div>
        </div>
      )}
    </>
  );
}
