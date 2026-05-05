"use client";

import Image from "next/image";
import { MapPin, Phone, Clock } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { ArrowButton } from "./ui/arrow-button";
import { cn } from "@/lib/utils";

interface LocationCardProps {
  name: string;
  subtitle?: string;
  address: string;
  city: string;
  phone: string;
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  image?: string;
  mapUrl?: string;
  isHighlight?: boolean;
  className?: string;
}

export function LocationCard({
  name,
  address,
  city,
  phone,
  workingHours,
  image,
  mapUrl,
  isHighlight = false,
  className,
}: LocationCardProps) {
  // Extract short location name (e.g., "ShopKit kutak Grbavica" -> "Grbavica")
  const shortName = name.replace(/ShopKit kutak\s*/i, "");

  return (
    <Card
      className={cn(
        "flex flex-col bg-brand-orange rounded-2xl sm:rounded-3xl md:rounded-[32px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5",
        className
      )}
    >
      {/* Image area */}
      <div className="relative w-full h-32 sm:h-40 md:h-52 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden bg-white flex items-center justify-center">
        <Image
          src={image || "/SHOPKIT_mix_logo.png"}
          alt={name}
          width={200}
          height={200}
          className="object-contain w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36"
        />
      </div>

      {/* Content */}
      <CardContent className="flex flex-col flex-1 py-3 sm:py-4 md:py-6 gap-2 sm:gap-3 md:gap-4 px-0">
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <p className="text-xs sm:text-sm text-white/80 font-poppins uppercase">
            {isHighlight ? "CENTRALA" : "POSLOVNICA"}
          </p>
          <h4 className="text-base uppercase sm:text-lg md:text-2xl font-oswald font-normal text-gray-900">
            {shortName}
          </h4>
        </div>

        {/* Address with icon */}
        <div className="flex items-start gap-2 text-xs sm:text-sm text-white/90">
          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p>{address}</p>
            <p className="text-white/70">{city}</p>
          </div>
        </div>

        {/* Phone with icon */}
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="flex items-center gap-2 text-xs sm:text-sm text-white hover:text-white/80 transition-colors font-medium"
        >
          <Phone className="w-4 h-4 flex-shrink-0" />
          {phone}
        </a>

        {/* Working Hours with icon */}
        <div className="flex items-start gap-2 text-[10px] sm:text-xs text-white/70">
          <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p>Pon-Pet: {workingHours.weekdays}</p>
            <p>Sub: {workingHours.saturday}</p>
          </div>
        </div>

        {/* Button */}
        {mapUrl && (
          <ArrowButton
            href={mapUrl}
            className="bg-black text-white text-xs sm:text-sm mt-auto"
          >
            Otvori Mapu
          </ArrowButton>
        )}
      </CardContent>
    </Card>
  );
}
