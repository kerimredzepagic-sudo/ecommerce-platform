import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ApiTerapijeCardProps {
  name: string;
  description?: string;
  image: string;
  discount?: number;
  className?: string;
}

export function ApiTerapijeCard({
  name,
  description,
  image,
  discount,
  className,
}: ApiTerapijeCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 relative",
        className
      )}
    >
      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-brand-orange text-white text-xs font-oswald font-bold px-2 py-1 rounded">
            -{discount}% AKCIJA
          </span>
        </div>
      )}

      {/* Image */}
      <div className="flex items-center justify-center p-4 min-h-[180px] bg-gray-50">
        <Image
          src={image}
          alt={name}
          width={150}
          height={150}
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col p-4">
        <h4 className="font-oswald font-bold text-gray-900 uppercase text-base mb-1">
          {name}
        </h4>
        {description && (
          <p className="font-poppins text-gray-500 text-xs mb-3 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="font-oswald text-xs uppercase border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
          >
            Vise O Api Terapij
          </Button>
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-orange hover:bg-brand-orange/90 transition-colors shadow-md">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 7H18L17 14H7L6 7ZM6 7L5 3H3M9 19C9.55228 19 10 18.5523 10 18C10 17.4477 9.55228 17 9 17C8.44772 17 8 17.4477 8 18C8 18.5523 8.44772 19 9 19ZM17 19C17.5523 19 18 18.5523 18 18C18 17.4477 17.5523 17 17 17C16.4477 17 16 17.4477 16 18C16 18.5523 16.4477 19 17 19Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}


