import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatCard({
  title,
  value,
  description,
  change,
  icon: Icon,
  iconColor = "text-orange-500",
  iconBgColor = "bg-orange-100",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
          {change && (
            <p
              className={cn(
                "text-sm mt-2 flex items-center gap-1",
                change.type === "increase" ? "text-green-600" : "text-red-600"
              )}
            >
              <span>{change.type === "increase" ? "↑" : "↓"}</span>
              <span>{Math.abs(change.value)}%</span>
              <span className="text-gray-500">u odnosu na prošli mjesec</span>
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconBgColor)}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
      </div>
    </div>
  );
}
