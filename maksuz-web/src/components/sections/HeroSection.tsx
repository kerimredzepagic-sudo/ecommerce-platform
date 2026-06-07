import Image from "next/image";
import { cn } from "@/lib/utils";

export function HeroSection({
  children,
  image,
  video,
  className,
  extended = false,
  screen = false,
}: {
  children: React.ReactNode;
  image?: string;
  video?: string;
  className?: string;
  extended?: boolean;
  screen?: boolean;
}) {
  return (
    <div className="w-full flex justify-center">
      <section
        className={cn(
          "relative h-[70vh] sm:h-[60vh] md:h-[500px] lg:h-[600px] w-full flex flex-col overflow-hidden px-4 sm:px-8 md:px-12 lg:px-16",
          className,
          extended && "max-w-screen-extended",
          screen && "max-w-screen"
        )}
      >
        {/* Background Video */}
        {video ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={video} type="video/mp4" />
          </video>
        ) : null}

        {image ? (
          <div className="absolute inset-0 z-0">
            <Image src={image} alt="Hero" fill className="object-cover" />
          </div>
        ) : null}

        {/* Gradient Overlay - Top to Bottom */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          {children}
        </div>
      </section>
    </div>
  );
}
