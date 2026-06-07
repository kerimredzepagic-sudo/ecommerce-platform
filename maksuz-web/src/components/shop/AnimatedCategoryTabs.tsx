"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface CategoryTab {
  id: string;
  label: string;
}

const tabs: CategoryTab[] = [
  { id: "svi", label: "Sve" },
  { id: "originals", label: "Maksuz Originals" },
  { id: "health", label: "Maksuz Health" },
  { id: "premium", label: "Maksuz Premium" },
  { id: "energy", label: "Maksuz Energy" },
  { id: "na-popustu", label: "Na popustu" },
  { id: "api-terapija", label: "Api terapija" },
  { id: "poklon-paketi", label: "Poklon paketi" },
];

interface AnimatedCategoryTabsProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function AnimatedCategoryTabs({ activeTab: controlledActiveTab, onTabChange }: AnimatedCategoryTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState("svi");
  const containerRef = useRef<HTMLDivElement>(null);

  // Use controlled tab if provided, otherwise use internal state
  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  useEffect(() => {
    if (containerRef.current) {
      const buttons = containerRef.current.children;
      gsap.set(buttons, { opacity: 0, x: -30, scale: 0.9 });
      gsap.to(buttons, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.7,
        ease: "back.out(1.2)",
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="flex flex-wrap gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={cn(
            "px-5 py-2.5 rounded-full font-poppins text-sm font-medium transition-all duration-200",
            activeTab === tab.id
              ? "bg-brand-orange text-white shadow-sm border border-brand-orange"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-brand-orange"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
