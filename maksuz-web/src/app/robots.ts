import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Admin area
          "/admin",
          "/admin/*",

          // User account area
          "/account",
          "/account/*",

          // Authentication pages
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/verify-email-change",
          "/verify-code",
          "/complete-profile",

          // Checkout and cart
          "/shop/checkout",
          "/shop/checkout/*",
          "/shop/order",
          "/shop/order/*",

          // API routes
          "/api",
          "/api/*",

          // User settings
          "/user",
          "/user/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
