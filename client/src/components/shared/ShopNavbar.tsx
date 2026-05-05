"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { MainNavbar } from "./MainNavbar";
import { shopNavItems, buildDynamicShopNavItems } from "@/config/navigation";
import { useShopCategoryTree } from "@/hooks/useShopApi";

/**
 * Shop navbar wrapper that automatically switches between
 * transparent (dark) and solid (white) variants based on the route.
 * 
 * - /shop (landing page with hero slider) → fixed dark navbar that follows on scroll
 * - /shop/products, /shop/product/* → white background with dark text, sticky positioning
 * 
 * Navigation items are dynamically built from categories in admin panel,
 * respecting the order set there. Falls back to static items if API fails.
 */
export function ShopNavbar() {
  const pathname = usePathname();
  const { data: categoryTree } = useShopCategoryTree();
  
  // Build nav items from categories or use fallback
  const navItems = useMemo(() => {
    if (categoryTree?.data && categoryTree.data.length > 0) {
      return buildDynamicShopNavItems(categoryTree.data);
    }
    return shopNavItems; // Fallback to static items while loading or on error
  }, [categoryTree]);
  
  // Landing page has a hero slider with dark background, so use transparent navbar
  const isLandingPage = pathname === "/shop";
  
  // Use white variant for internal pages (products list, product detail)
  const variant = isLandingPage ? "dark" : "white";
  
  // Dark variant: MainNavbar handles fixed positioning internally
  // White variant: sticky at top
  if (isLandingPage) {
    return <MainNavbar navItems={navItems} logoHref="/shop" variant={variant} />;
  }
  
  return (
    <div className="sticky top-0 z-50">
      <MainNavbar navItems={navItems} logoHref="/shop" variant={variant} />
    </div>
  );
}

