import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  name: string;
  price: string;
  currency?: string;
  image: string;
  className?: string;
}

export function ProductCard({
  name,
  price,
  currency = "KM",
  image,
  className,
}: ProductCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-gray-100 rounded-lg w-full max-w-[350px] h-[400px] relative justify-end",
        className
      )}
    >
      {/* Image */}
      <div className="flex-1 flex items-center justify-center bg-transparent p-6 absolute top-[-50px] left-0 right-0 z-[999]">
        <Image
          src={image}
          alt={name}
          width={200}
          height={300}
          className="object-contain z-[999999]"
        />
      </div>

      {/* Content - Product name, price, and cart icon */}
      <div className="flex items-center justify-between px-4 pb-8 bg-transparent">
        <div className="flex flex-col gap-1">
          <h4 className="font-oswald font-bold text-gray-900 uppercase text-sm">
            {name}
          </h4>
          <p className="font-oswald text-gray-700 text-xl">
            {price} {currency}
          </p>
        </div>

        {/* Shopping Bag Icon */}
        <button className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-orange hover:bg-brand-orange/90 transition-colors shadow-md flex-shrink-0">
          <svg
            width="24"
            height="24"
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
  );
}
