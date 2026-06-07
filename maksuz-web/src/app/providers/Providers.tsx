"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { QueryProvider } from "@/contexts/QueryProvider";
import { CartDrawer } from "@/components/cart";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <QueryProvider>
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <Toaster position="top-right" richColors />
          </CartProvider>
        </AuthProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
