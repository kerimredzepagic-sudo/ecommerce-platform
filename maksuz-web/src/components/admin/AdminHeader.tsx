"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormActionsProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  submitIcon?: React.ReactNode;
}

interface AdminHeaderProps {
  title: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  showBack?: boolean;
  formActions?: FormActionsProps;
  className?: string;
}

export function AdminHeader({
  title,
  description,
  actions,
  showBack = false,
  formActions,
  className,
}: AdminHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border px-6 py-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        {/* Left Side - Back Button & Title */}
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Custom Actions */}
          {actions}

          {/* Form Actions */}
          {formActions && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={formActions.onCancel || (() => router.back())}
                className="h-9"
              >
                <X className="w-4 h-4 mr-2" />
                {formActions.cancelLabel || "Odustani"}
              </Button>
              <Button
                type="submit"
                onClick={formActions.onSubmit}
                disabled={formActions.isSubmitting}
                className="h-9 bg-brand-orange hover:bg-brand-orange/90"
              >
                {formActions.isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  formActions.submitIcon || <Save className="w-4 h-4 mr-2" />
                )}
                {formActions.submitLabel || "Spremi promjene"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
