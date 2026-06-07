"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CategoryTab {
  id: string;
  label: string;
}

const tabs: CategoryTab[] = [
  { id: "svi", label: "Svi" },
  { id: "maksuz-health", label: "Maksuz Health" },
  { id: "maksuz-premium", label: "Maksuz Premium" },
  { id: "maksuz-energy", label: "Maksuz Energy" },
  { id: "na-popustu", label: "Na popustu" },
  { id: "api-terapija", label: "Api terapija" },
  { id: "poklon-paketi", label: "Poklon paketi" },
];

interface CategoryTabsProps {
  onTabChange?: (tabId: string) => void;
}

export function CategoryTabs({ onTabChange }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState("svi");

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={cn(
            "px-5 py-2 rounded-full font-poppins text-sm font-medium transition-all",
            activeTab === tab.id
              ? "bg-brand-orange text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}


