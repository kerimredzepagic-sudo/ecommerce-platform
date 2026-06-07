import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag, Users, ArrowRight } from "lucide-react";

export function Hero({
  headTitle,
  title,
  description,
  linkText1 = "Naša priča.",
  linkText2 = "WEBSHOP",
  linkHref1 = "/products",
  linkHref2 = "/shop",
  textCenter = false,
}: {
  headTitle?: string;
  title?: string;
  description?: string;
  linkText1?: string;
  linkText2?: string;
  linkHref1?: string;
  linkHref2?: string;
  textCenter?: boolean;
}) {
  return (
    <div className="w-full mx-auto max-w-screen">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Left Side - Text Content */}
        <div
          className={cn(
            "flex-1 text-white space-y-6 flex flex-col",
            textCenter && "items-center"
          )}
        >
          <p className="text-brand-orange font-oswald text-sm sm:text-base md:text-lg lg:text-xl font-semibold uppercase tracking-wide">
            {headTitle}
          </p>
          <h1 className="font-poppins text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal leading-tight lg:leading-snug tracking-[-0.5px] lg:tracking-[-1px] max-w-3xl">
            {title}
          </h1>
          {description && (
            <p className="font-poppins text-xs sm:text-sm md:text-base text-white/90 max-w-2xl">{description}</p>
          )}
          <div className="flex flex-wrap gap-5 pt-6">
            <Link href={linkHref1}>
              <Button
                variant="brand"
                size="lg"
                className="font-oswald uppercase text-sm sm:text-base px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 hidden sm:inline" />
                {linkText1}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href={linkHref2}>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-gray-900 font-oswald uppercase text-sm sm:text-base px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 hidden sm:inline" />
                {linkText2}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
