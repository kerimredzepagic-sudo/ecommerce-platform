"use client";

import { format } from "date-fns";
import { bs } from "date-fns/locale";
import { Check, Lock, User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { AdminApiSlot } from "@/hooks/useAdminApi";

interface SlotOverflowPopoverProps {
  overflowSlots: AdminApiSlot[];
  overflowCount: number;
  date: Date;
  position: { left: string; width: string };
  onSlotClick: (slot: AdminApiSlot) => void;
}

// Parse date string without timezone issues
function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function SlotOverflowPopover({
  overflowSlots,
  overflowCount,
  date,
  position,
  onSlotClick,
}: SlotOverflowPopoverProps) {
  if (overflowCount === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          style={{
            position: "absolute",
            top: "8px",
            left: position.left,
            width: position.width,
            height: "calc(100% - 16px)",
            minHeight: "28px",
          }}
          className={cn(
            "rounded-lg bg-muted/80 hover:bg-muted",
            "border-2 border-dashed border-muted-foreground/30",
            "hover:border-muted-foreground/50",
            "flex items-center justify-center",
            "text-xs font-bold text-muted-foreground",
            "transition-all hover:scale-105",
            "cursor-pointer z-20"
          )}
        >
          +{overflowCount}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        className="w-64 p-0"
        sideOffset={8}
      >
        <div className="px-4 py-3 border-b bg-muted/30">
          <p className="font-bold text-sm">
            Jos {overflowCount} termin{overflowCount > 1 ? "a" : ""}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {format(date, "d. MMMM yyyy.", { locale: bs })}
          </p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {overflowSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => onSlotClick(slot)}
              className={cn(
                "w-full px-4 py-3 text-left border-b last:border-b-0",
                "hover:bg-muted/50 transition-colors",
                "flex items-start gap-3"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                  slot.isBooked && "bg-blue-100 text-blue-600",
                  slot.isBlocked && "bg-amber-100 text-amber-600",
                  !slot.isBooked && !slot.isBlocked && "bg-emerald-100 text-emerald-600"
                )}
              >
                {slot.isBooked ? (
                  <User className="w-4 h-4" />
                ) : slot.isBlocked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">
                  {slot.startTime} - {slot.endTime}
                </p>
                <p
                  className={cn(
                    "text-xs mt-0.5",
                    slot.isBooked && "text-blue-600",
                    slot.isBlocked && "text-amber-600",
                    !slot.isBooked && !slot.isBlocked && "text-emerald-600"
                  )}
                >
                  {slot.isBooked
                    ? "Rezervisano"
                    : slot.isBlocked
                      ? "Blokirano"
                      : "Slobodno"}
                </p>
                {slot.isBooked && slot.bookings && (
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                    #{slot.bookings?.[0]?.bookingNumber}
                  </p>
                )}  
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
