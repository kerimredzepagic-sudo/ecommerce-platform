"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarTab {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface SidebarLayoutProps {
  tabs: SidebarTab[];
  children: React.ReactNode;
  className?: string;
}

export function SidebarLayout({
  tabs,
  children,
  className,
}: SidebarLayoutProps) {
  const [activeSection, setActiveSection] = useState(tabs[0]?.id || "");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const isClickScrolling = useRef(false);

  // Setup intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (isClickScrolling.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    // Observe all sections
    tabs.forEach((tab) => {
      const element = document.getElementById(tab.id);
      if (element) {
        sectionRefs.current.set(tab.id, element);
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [tabs]);

  const handleTabClick = useCallback((tabId: string) => {
    const element = document.getElementById(tabId);
    if (element) {
      isClickScrolling.current = true;
      setActiveSection(tabId);

      const headerOffset = 140; // Breadcrumb header (64px) + AdminHeader (~76px)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Reset click scrolling after animation
      setTimeout(() => {
        isClickScrolling.current = false;
      }, 1000);
    }
  }, []);

  return (
    <div className={cn("flex gap-6 relative", className)}>
      {/* Sidebar Navigation - Fixed position within viewport */}
      <aside className="w-60 flex-shrink-0">
        <div className="sticky top-40">
          <nav className="bg-card rounded-xl border border-border shadow-sm">
            <div className="p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-brand-orange text-white shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {Icon && (
                      <Icon
                        className={cn(
                          "w-4 h-4 flex-shrink-0",
                          isActive ? "text-white" : "text-muted-foreground"
                        )}
                      />
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
