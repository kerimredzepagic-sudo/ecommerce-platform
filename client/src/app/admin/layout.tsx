"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSidebar } from "@/components/admin";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

// Map of paths to breadcrumb labels
const pathLabels: Record<string, string> = {
  admin: "Kontrolna tabla",
  products: "Proizvodi",
  categories: "Kategorije",
  orders: "Narudžbe",
  blog: "Blog",
  careers: "Karijere",
  contacts: "Poruke",
  settings: "Postavke",
  new: "Novi",
  slides: "Slajdovi",
  "api-services": "Api Usluge",
  "api-slots": "Termini",
  "api-bookings": "Rezervacije",
};

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: { label: string; href: string; isLast: boolean }[] = [];

  segments.forEach((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    // Check if it's an ID (MongoDB ObjectId pattern or any non-label segment)
    const isId = !pathLabels[segment] && segment !== "admin";

    if (isId) {
      breadcrumbs.push({
        label: "Detalji",
        href,
        isLast,
      });
    } else {
      breadcrumbs.push({
        label: pathLabels[segment] || segment,
        href,
        isLast,
      });
    }
  });

  return breadcrumbs;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAdmin } = useAuth();
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />
          <p className="text-muted-foreground">Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via the hook
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  {index > 0 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={crumb.href}
                        className="hidden md:block"
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 p-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
