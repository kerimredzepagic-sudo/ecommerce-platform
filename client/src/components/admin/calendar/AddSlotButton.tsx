"use client";

import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AddSlotButtonProps {
  variant: "empty" | "with-slots";
  onClick: () => void;
  time: string;
}

export function AddSlotButton({ variant, onClick, time }: AddSlotButtonProps) {
  if (variant === "empty") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className="absolute inset-2 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-brand-orange hover:bg-brand-orange/10 transition-all flex items-center justify-center group"
          >
            <Plus className="w-5 h-5 text-muted-foreground/40 group-hover:text-brand-orange group-hover:scale-125 transition-all duration-200" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="font-medium">Dodaj termin u {time}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // with-slots variant: Small floating "+" button in bottom-right, appears on hover
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={cn(
            "absolute bottom-2 right-2 z-30",
            "w-7 h-7 rounded-full",
            "bg-brand-orange text-white shadow-lg",
            "flex items-center justify-center",
            "opacity-0 group-hover/cell:opacity-100",
            "hover:bg-brand-orange/90 hover:scale-110",
            "transition-all duration-200"
          )}
        >
          <Plus className="w-4 h-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="font-medium">Dodaj termin u {time}</p>
      </TooltipContent>
    </Tooltip>
  );
}
