"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  id?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function ContentCard({
  id,
  title,
  description,
  icon: Icon,
  children,
  className,
  noPadding = false,
}: ContentCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "bg-card rounded-xl border border-border shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-9 h-9 rounded-lg bg-brand-orange/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-brand-orange" />
            </div>
          )}
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={cn(noPadding ? "" : "p-6")}>{children}</div>
    </div>
  );
}

