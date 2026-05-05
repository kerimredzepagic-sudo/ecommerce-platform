import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArrowButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  arrowVariant?: "orange" | "white" | "black";
}

const arrowVariants = {
  orange: "bg-brand-orange text-white",
  white: "bg-white text-black",
  black: "bg-black text-white",
};

export function ArrowButton({
  href,
  children,
  className,
  arrowVariant = "orange",
}: ArrowButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-between w-full pl-3 pr-2 py-2 sm:pl-4 sm:pr-3 sm:py-2.5 md:pl-6 md:pr-4 md:py-3 font-poppins text-[10px] sm:text-xs md:text-sm rounded-full sm:rounded-32 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        className
      )}
    >
      <span>{children}</span>
      <div
        className={cn(
          "rounded-full p-1 transition-transform duration-300 group-hover:translate-x-1",
          arrowVariants[arrowVariant]
        )}
      >
        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
      </div>
    </Link>
  );
}
