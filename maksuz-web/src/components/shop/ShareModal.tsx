"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Link2,
  Facebook,
  Mail,
  Check,
  X,
  MessageCircle,
  Linkedin,
} from "lucide-react";

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text: string;
  url: string;
}

interface ShareOption {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

export function ShareModal({
  isOpen,
  onClose,
  title,
  text,
  url,
}: ShareModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const encodedTitle = encodeURIComponent(title);

  const shareOptions: ShareOption[] = [
    {
      name: "Kopiraj link",
      icon: copied ? (
        <Check className="w-5 h-5" />
      ) : (
        <Link2 className="w-5 h-5" />
      ),
      onClick: handleCopyLink,
      color: copied ? "text-green-600 bg-green-50" : "text-gray-700 bg-gray-100",
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      onClick: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          "_blank",
          "width=600,height=400"
        ),
      color: "text-[#1877F2] bg-[#1877F2]/10",
    },
    {
      name: "X (Twitter)",
      icon: <XIcon className="w-4 h-4" />,
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
          "_blank",
          "width=600,height=400"
        ),
      color: "text-gray-900 bg-gray-100",
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5" />,
      onClick: () =>
        window.open(
          `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
          "_blank"
        ),
      color: "text-[#25D366] bg-[#25D366]/10",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      onClick: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          "_blank",
          "width=600,height=400"
        ),
      color: "text-[#0A66C2] bg-[#0A66C2]/10",
    },
    {
      name: "Email",
      icon: <Mail className="w-5 h-5" />,
      onClick: () =>
        window.open(
          `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`
        ),
      color: "text-gray-700 bg-gray-100",
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={cn(
        "absolute right-0 top-12 z-50 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden",
        "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-oswald font-medium text-gray-900">Podijeli</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Share Options */}
      <div className="p-2">
        {shareOptions.map((option) => (
          <button
            key={option.name}
            onClick={option.onClick}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
              "hover:bg-gray-50 active:scale-[0.98]"
            )}
          >
            <span
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                option.color
              )}
            >
              {option.icon}
            </span>
            <span className="text-sm text-gray-700">{option.name}</span>
            {option.name === "Kopiraj link" && copied && (
              <span className="ml-auto text-xs text-green-600 font-medium">
                Kopirano!
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

