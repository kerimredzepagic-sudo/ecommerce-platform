"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { SectionHeader } from "../ui/section-header";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Using Natural Earth 110m resolution for faster loading
const geoUrl =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

const countries = [
  { name: "Bosna i Hercegovina", flag: "🇧🇦" },
  { name: "Crna Gora", flag: "🇲🇪" },
  { name: "Švedska", flag: "🇸🇪" },
  { name: "Holandija", flag: "🇳🇱" },
];

// Country names to highlight
const highlightedCountries = [
  "Sweden",
  "Netherlands",
  "Bosnia and Herzegovina",
  "Montenegro",
];

// European country names to display
const europeanCountries = [
  "Sweden",
  "Norway",
  "Finland",
  "Denmark",
  "Iceland",
  "United Kingdom",
  "Ireland",
  "Netherlands",
  "Belgium",
  "Luxembourg",
  "France",
  "Germany",
  "Switzerland",
  "Austria",
  "Liechtenstein",
  "Italy",
  "Spain",
  "Portugal",
  "Andorra",
  "Monaco",
  "San Marino",
  "Vatican",
  "Malta",
  "Poland",
  "Czech Republic",
  "Czechia",
  "Slovakia",
  "Hungary",
  "Slovenia",
  "Croatia",
  "Bosnia and Herzegovina",
  "Serbia",
  "Montenegro",
  "Kosovo",
  "Albania",
  "North Macedonia",
  "Macedonia",
  "Greece",
  "Bulgaria",
  "Romania",
  "Moldova",
  "Ukraine",
  "Belarus",
  "Lithuania",
  "Latvia",
  "Estonia",
  "Russia",
  "Turkey",
  "Cyprus",
];

// Marker positions [longitude, latitude]
const markers: Array<{
  name: string;
  coordinates: [number, number];
  flag: string;
}> = [
  { name: "Sweden", coordinates: [18.6435, 62.1282], flag: "🇸🇪" },
  { name: "Netherlands", coordinates: [5.2913, 52.1326], flag: "🇳🇱" },
  { name: "Bosnia", coordinates: [17.6791, 43.9159], flag: "🇧🇦" },
  { name: "Montenegro", coordinates: [19.3744, 42.7087], flag: "🇲🇪" },
];

export const MarketsSection = () => {
  const [isClient, setIsClient] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const ctx = gsap.context(() => {
      // Animate text content from left
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Animate country cards with stagger
      if (countriesRef.current) {
        const countryCards = countriesRef.current.children;
        gsap.fromTo(
          countryCards,
          { opacity: 0, x: -30, scale: 0.9 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: countriesRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate map from right
      gsap.fromTo(
        mapRef.current,
        { opacity: 0, x: 50, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isClient]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white py-16 md:py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          {/* Left Side - Text Content */}
          <div ref={textRef} className="relative z-10 lg:w-2/5">
            <SectionHeader
              label="TRŽIŠTA"
              title="Ovdje nas možete pronaći"
              description="Maksuz proizvodi dostupni su širom Europe. Od Bosne i Hercegovine do Skandinavije, naši prirodni proizvodi i med pronašli su put do kupaca koji cijene kvalitetu i tradiciju."
              size="lg"
            />

            {/* Additional copy */}
            <p className="text-gray-500 text-sm md:text-base mt-4 mb-8 leading-relaxed">
              Surađujemo s partnerima u četiri europske zemlje, osiguravajući da
              naši certificirani proizvodi stignu do vas bez obzira gdje se
              nalazite. Svako tržište odabrano je s pažnjom prema zajednicama
              koje dijele našu ljubav prema prirodnim i kvalitetnim proizvodima.
            </p>

            {/* Country List */}
            <div ref={countriesRef} className="flex flex-col gap-3">
              {countries.map((country) => (
                <div
                  key={country.name}
                  className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow w-fit"
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="font-poppins text-gray-800">
                    {country.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Europe Map */}
          <div
            ref={mapRef}
            className="relative lg:w-3/5 w-full min-h-[500px] md:min-h-[600px]"
          >
            {isClient && (
              <ComposableMap
                projection="geoAzimuthalEqualArea"
                projectionConfig={{
                  rotate: [-10, -52, 0],
                  center: [0, 0],
                  scale: 900,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Geographies geography={geoUrl}>
                  {({
                    geographies,
                  }: {
                    geographies: Array<{
                      rsmKey: string;
                      properties: { ADMIN?: string; name?: string };
                    }>;
                  }) =>
                    geographies
                      .filter((geo) => {
                        const name =
                          geo.properties.ADMIN || geo.properties.name || "";
                        return europeanCountries.some(
                          (country) =>
                            name.toLowerCase().includes(country.toLowerCase()) ||
                            country.toLowerCase().includes(name.toLowerCase())
                        );
                      })
                      .map((geo) => {
                        const name =
                          geo.properties.ADMIN || geo.properties.name || "";
                        const isHighlighted = highlightedCountries.some(
                          (country) =>
                            name.toLowerCase().includes(country.toLowerCase()) ||
                            country.toLowerCase().includes(name.toLowerCase())
                        );
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={isHighlighted ? "#E85D25" : "#e2e8f0"}
                            stroke="#ffffff"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: {
                                outline: "none",
                                fill: isHighlighted ? "#d14d1a" : "#cbd5e1",
                              },
                              pressed: { outline: "none" },
                            }}
                          />
                        );
                      })
                  }
                </Geographies>

                {/* Flag Markers */}
                {markers.map(({ name, coordinates, flag }) => (
                  <Marker key={name} coordinates={coordinates}>
                    <circle
                      r={14}
                      fill="#fff"
                      stroke="#fff"
                      strokeWidth={2}
                      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
                    />
                    <text
                      textAnchor="middle"
                      y={6}
                      style={{ fontSize: "16px" }}
                    >
                      {flag}
                    </text>
                  </Marker>
                ))}
              </ComposableMap>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
