import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { ArrowButton } from "./ui/arrow-button";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  href?: string;
}

export function ServiceCard({
  title,
  subtitle,
  image,
  buttonText,
  href = "/proizvodi",
}: ServiceCardProps) {
  return (
    <Card className="flex flex-col bg-white rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4">
      {/* Image */}
      <div className="relative w-full h-28 sm:h-36 md:h-48 rounded-lg sm:rounded-xl">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-xl"
        />
      </div>

      {/* Content */}
      <CardContent className="flex flex-col flex-1 py-3 sm:py-4 md:py-6 gap-2 sm:gap-3 md:gap-4 px-0">
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <p className="text-xs sm:text-sm text-gray-500 font-poppins uppercase">
            {subtitle}
          </p>
          <h4 className="text-sm uppercase sm:text-base md:text-xl font-oswald font-normal text-gray-900">
            {title}
          </h4>
        </div>

        {/* Button */}
        <ArrowButton href={href} className="bg-black text-white text-xs sm:text-sm">
            {buttonText}
        </ArrowButton>
      </CardContent>
    </Card>
  );
}
