import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface SectionHeaderProps {
  /** Small orange uppercase label above the title */
  label?: string;
  /** Main title/heading */
  title: string;
  /** Optional description paragraph */
  description?: string;
  /** Center align all content */
  centered?: boolean;
  /** Additional content like buttons rendered below description */
  children?: ReactNode;
  /** Custom className for the container */
  className?: string;
  /** Size variant for responsive sizing */
  size?: "sm" | "md" | "lg";
  /** Color scheme for different backgrounds */
  theme?: "light" | "dark" | "brand";
}

/**
 * SectionHeader - Consistent heading pattern for all sections
 * 
 * Structure:
 * 1. Label (orange uppercase text)
 * 2. Title (large poppins heading)
 * 3. Description (gray paragraph)
 * 4. Children (buttons, etc.)
 */
export function SectionHeader({
  label,
  title,
  description,
  centered = false,
  children,
  className,
  size = "lg",
  theme = "light",
}: SectionHeaderProps) {
  // Label size classes based on size prop
  const labelSizeClasses = {
    sm: "text-xs sm:text-sm",
    md: "text-sm sm:text-base md:text-lg",
    lg: "text-sm sm:text-base md:text-lg lg:text-xl",
  };

  // Title size classes based on size prop
  const titleSizeClasses = {
    sm: "text-base sm:text-lg md:text-xl lg:text-2xl",
    md: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
    lg: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
  };

  // Description size classes
  const descriptionSizeClasses = {
    sm: "text-xs sm:text-sm",
    md: "text-sm sm:text-base",
    lg: "text-sm sm:text-base md:text-lg",
  };

  // Theme-based colors
  const titleColorClasses = {
    light: "text-gray-900",
    dark: "text-white",
    brand: "text-white",
  };

  const descriptionColorClasses = {
    light: "text-gray-500",
    dark: "text-white/70",
    brand: "text-white/80",
  };

  const labelColorClasses = {
    light: "text-brand-orange",
    dark: "text-white",
    brand: "text-gray-900",
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        centered && "items-center text-center",
        className
      )}
    >
      {/* Label */}
      {label && (
        <p
          className={cn(
            "font-oswald uppercase tracking-wide font-bold mb-3",
            labelSizeClasses[size],
            labelColorClasses[theme]
          )}
        >
          {label}
        </p>
      )}

      {/* Title */}
      <h2
        className={cn(
          "font-poppins font-normal leading-tight capitalize",
          titleSizeClasses[size],
          titleColorClasses[theme],
          description || children ? "mb-4" : ""
        )}
      >
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p
          className={cn(
            "font-poppins leading-relaxed",
            descriptionSizeClasses[size],
            descriptionColorClasses[theme],
            centered && "max-w-3xl",
            children ? "mb-6" : ""
          )}
        >
          {description}
        </p>
      )}

      {/* Additional content (buttons, etc.) */}
      {children}
    </div>
  );
}
