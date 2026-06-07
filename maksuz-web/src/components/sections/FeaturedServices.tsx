import { ServiceCard } from "../ServiceCard";
import { SectionHeader } from "../ui/section-header";
import { cn } from "@/lib/utils";

interface Service {
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  href?: string;
}

interface FeaturedServicesProps {
  services: Service[];
  className?: string;
  extended?: boolean;
  label?: string;
  title?: string;
  description?: string;
}

export function FeaturedServices({
  services,
  className,
  extended = false,
  label,
  title,
  description,
}: FeaturedServicesProps) {
  return (
    <div
      className={cn(
        "flex justify-center bg-brand-orange py-8 sm:py-12 md:py-16 w-full rounded-2xl sm:rounded-32 overflow-hidden",
        className,
        extended ? "max-w-screen-extended" : "max-w-screen"
      )}
    >
      <div className="w-full px-3 sm:px-6 md:px-12 lg:px-20">
        {/* Heading */}
        {(label || title || description) && (
          <div className="mb-8 sm:mb-12">
            <SectionHeader
              label={label}
              title={title || ""}
              description={description}
              centered
              theme="brand"
              size="md"
            />
          </div>
        )}

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              subtitle={service.subtitle}
              image={service.image}
              buttonText={service.buttonText}
              href={service.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
