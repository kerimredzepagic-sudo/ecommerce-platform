"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  customerName: string;
  customerImage: string;
  customerTitle?: string;
  reviewText: string;
  className?: string;
}

export function TestimonialCard({
  customerName,
  customerImage,
  customerTitle,
  reviewText,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 p-8 rounded-32 bg-gray-100",
        "w-[350px] flex-shrink-0 min-h-[300px] relative",
        className
      )}
    >
      <Image
        src="/quotationMarks.svg"
        alt="Quote"
        width={32}
        height={32}
        className="absolute top-[-10px] left-10 z-10"
      />
      {/* Review Text - Top */}
      <p className="font-poppins text-gray-900 text-18 leading-relaxed flex-1 pt-2">
        {reviewText}
      </p>

      {/* Customer Information - Bottom Left */}
      <div className="flex items-center gap-4 mt-auto">
        {/* Customer Photo - Circular */}
        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={customerImage}
            alt={customerName}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Customer Name and Title */}
        <div className="flex flex-col">
          <h3 className="font-oswald font-bold text-18 text-gray-900">
            {customerName}
          </h3>
          {customerTitle && (
            <p className="font-poppins text-14 text-gray-600">
              {customerTitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
