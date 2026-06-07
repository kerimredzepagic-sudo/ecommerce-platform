"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { MenuIcon } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ChevronDown, X } from "lucide-react";

// Types for navigation items
export interface NavSubcategory {
  href: string;
  label: string;
  comingSoon?: boolean;
}

export interface NavItem {
  href: string;
  label: string;
  hasDropdown?: boolean;
  subcategories?: Record<string, NavSubcategory[]>;
}

export interface MainNavbarProps {
  variant?: "dark" | "white";
  navItems: NavItem[];
  logoHref?: string;
}

export function MainNavbar({ 
  variant = "dark", 
  navItems,
  logoHref = "/" 
}: MainNavbarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { itemCount, openCart } = useCart();
  const isWhite = variant === "white";
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [prevDropdown, setPrevDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/shop") return pathname === "/shop";
    return pathname === href || pathname?.startsWith(href + "/");
  };

  // Track scroll position for dark navbar background
  useEffect(() => {
    if (isWhite) return; // Only track scroll for dark variant
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isWhite]);

  // Animate dropdown in/out
  const animateDropdownIn = useCallback((isSwitch: boolean = false) => {
    if (dropdownRef.current && dropdownContentRef.current) {
      gsap.killTweensOf([dropdownRef.current, dropdownContentRef.current, ...Array.from(dropdownContentRef.current.children)]);
      
      if (!isSwitch) {
        // Opening from closed state - fade in and slide down
        gsap.fromTo(
          dropdownRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
        );
        
        gsap.fromTo(
          dropdownContentRef.current.children,
          { opacity: 0, y: -10 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.3, 
            stagger: 0.05, 
            ease: "power2.out",
            delay: 0.1 
          }
        );
      } else {
        // Switching between dropdowns - ensure container is fully visible
        gsap.set(dropdownRef.current, { opacity: 1, y: 0 });
        
        // Slide in content from right
        gsap.fromTo(
          dropdownContentRef.current.children,
          { opacity: 0, x: 30 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.25, 
            stagger: 0.03, 
            ease: "power2.out"
          }
        );
      }
    }
  }, []);

  const animateDropdownOut = useCallback(() => {
    if (dropdownRef.current) {
      gsap.to(dropdownRef.current, {
        opacity: 0,
        y: -5,
        duration: 0.15,
        ease: "power2.in",
      });
    }
  }, []);

  useEffect(() => {
    if (activeDropdown) {
      const isSwitch = prevDropdown !== null && prevDropdown !== activeDropdown;
      
      if (isSwitch) {
        // Switching between dropdowns - animate switch
        animateDropdownIn(true);
      } else if (prevDropdown === null) {
        // Opening from closed state
        animateDropdownIn(false);
      }
    }
    
    setPrevDropdown(activeDropdown);
  }, [activeDropdown, animateDropdownIn, prevDropdown]);

  useEffect(() => {
    // Set initial states
    gsap.set(navRef.current, { opacity: 0, y: -30 });
    gsap.set(logoRef.current, { opacity: 0, scale: 0.8 });
    gsap.set(actionsRef.current, { opacity: 0, x: 20 });
    if (linksRef.current) {
      gsap.set(linksRef.current, { opacity: 0, y: -20 });
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate navbar container
    tl.to(navRef.current, { opacity: 1, y: 0, duration: 0.6 });

    // Animate logo
    tl.to(logoRef.current, { opacity: 1, scale: 1, duration: 0.5 }, "-=0.3");

    // Animate nav links
    if (linksRef.current) {
      tl.to(linksRef.current, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3");
    }

    // Animate actions
    tl.to(actionsRef.current, { opacity: 1, x: 0, duration: 0.5 }, "-=0.2");
  }, []);

  const handleMouseLeaveNav = () => {
    animateDropdownOut();
    setTimeout(() => setActiveDropdown(null), 150);
  };

  const currentDropdownItem = navItems.find(item => item.href === activeDropdown);
  const subcategories = currentDropdownItem?.subcategories;
  const subcategoryEntries = subcategories ? Object.entries(subcategories) : [];

  return (
    <nav
      ref={navRef}
      className={cn(
        "w-full z-50 transition-all duration-300",
        isWhite
          ? "relative bg-white border-b border-gray-100 shadow-sm"
          : cn(
              "fixed top-0 left-0 right-0 border-b",
              isScrolled 
                ? "bg-black/80 backdrop-blur-md border-white/10" 
                : "bg-transparent border-white/10"
            )
      )}
      onMouseLeave={handleMouseLeaveNav}
    >
      <div className="flex h-16 md:h-20 items-center justify-between mx-auto max-w-screen-extended px-4 md:px-6">
        {/* Logo */}
        <Link ref={logoRef} href={logoHref} className="font-oswald text-2xl font-bold">
          <div className="relative w-16 h-8 md:w-32 md:h-12">
            <Image
              src="/MAKSUZ_mix_logo.png"
              alt="Maksuz"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        {/* Navigation Links */}
        <div
          ref={linksRef}
          className="hidden lg:flex gap-0.5 xl:gap-1 items-center h-full"
        >
          {navItems.map((item) => (
            <div
              key={item.href}
              className="relative h-full flex items-center group/nav"
              onMouseEnter={() =>
                item.hasDropdown
                  ? setActiveDropdown(item.href)
                  : setActiveDropdown(null)
              }
            >
              <Link
                href={item.href}
                className={cn(
                  "font-oswald text-[11px] xl:text-[13px] font-medium uppercase transition-all px-2 py-2 rounded-lg flex items-center gap-1",
                  isActive(item.href)
                    ? "text-brand-orange"
                    : isWhite
                      ? "text-gray-700 hover:text-brand-orange hover:bg-gray-50"
                      : "text-white/90 hover:text-white hover:bg-white/10",
                  activeDropdown === item.href && (isWhite ? "text-brand-orange bg-gray-50" : "text-white bg-white/10")
                )}
              >
                {item.label}
                {item.hasDropdown && (
                  <ChevronDown 
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-200",
                      activeDropdown === item.href && "rotate-180"
                    )} 
                  />
                )}
              </Link>
              {/* Orange underline - visible when active OR on hover */}
              <span 
                className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 w-[50px] h-0.5 bg-brand-orange rounded-full transition-all duration-200",
                  isActive(item.href) 
                    ? "opacity-100 scale-x-100" 
                    : "opacity-0 scale-x-0 group-hover/nav:opacity-100 group-hover/nav:scale-x-100"
                )} 
              />
            </div>
          ))}
        </div>

        {/* Right side - Cart & Phone */}
        <div ref={actionsRef} className="flex items-center gap-2 md:gap-4">
          {/* Cart Icon */}
          <button
            onClick={openCart}
            className={cn(
              "p-2.5 rounded-xl transition-all relative group",
              isWhite 
                ? "hover:bg-gray-100 active:scale-95" 
                : "hover:bg-white/10 active:scale-95"
            )}
            aria-label="Otvori korpu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform group-hover:scale-110"
            >
              <path
                d="M6 7H18L17 14H7L6 7ZM6 7L5 3H3M9 19C9.55228 19 10 18.5523 10 18C10 17.4477 9.55228 17 9 17C8.44772 17 8 17.4477 8 18C8 18.5523 8.44772 19 9 19ZM17 19C17.5523 19 18 18.5523 18 18C18 17.4477 17.5523 17 17 17C16.4477 17 16 17.4477 16 18C16 18.5523 16.4477 19 17 19Z"
                stroke={isWhite ? "#374151" : "white"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-orange text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-oswald font-bold shadow-lg">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* Phone Icon - Small screens only */}
          <a 
            href="tel:+38762200088"
            className={cn(
              "hidden sm:flex lg:hidden p-2.5 rounded-xl transition-all",
              isWhite 
                ? "hover:bg-gray-100 active:scale-95" 
                : "hover:bg-white/10 active:scale-95"
            )}
            aria-label="Nazovi nas"
          >
            <svg className={cn("w-5 h-5", isWhite ? "text-gray-700" : "text-white")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>

          {/* Phone Number - Large screens */}
          <a 
            href="tel:+38762200088"
            className={cn(
              "font-oswald text-xs font-medium hidden lg:flex items-center gap-2 px-2 py-2 rounded-lg transition-colors",
              isWhite 
                ? "text-gray-700 hover:bg-gray-100" 
                : "text-white/90 hover:bg-white/10"
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            + 387 62 200 088
          </a>

          {/* Account Button / Avatar - Hidden on mobile */}
          <Link
            href={
              isAuthenticated
                ? user?.role === "admin"
                  ? "/admin"
                  : "/account"
                : "/login"
            }
            className="flex-shrink-0 hidden md:block"
          >
            {isAuthenticated ? (
              <div className="relative group flex-shrink-0">
                <div
                  className={cn(
                    "w-10 h-10 min-w-[40px] min-h-[40px] rounded-full overflow-hidden border-2 transition-all flex items-center justify-center",
                    isWhite
                      ? "border-brand-orange hover:border-brand-orange/70 hover:shadow-lg"
                      : "border-white/50 hover:border-brand-orange"
                  )}
                >
                  {user?.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.fullName || "Avatar"}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover"
                    />
                  ) : (
                    <span
                      className={cn(
                        "w-10 h-10 flex items-center justify-center font-oswald font-bold text-base",
                        isWhite
                          ? "bg-brand-orange text-white"
                          : "bg-white/20 text-white"
                      )}
                    >
                      {user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                {/* Hover tooltip */}
                <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="bg-gray-900 text-white text-xs font-oswald px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                    {user?.fullName || user?.email || "Moj nalog"}
                  </div>
                </div>
              </div>
            ) : (
              <Button
                className={cn(
                  "font-oswald uppercase text-sm px-5 gap-2",
                  isWhite
                    ? "bg-brand-orange text-white hover:bg-brand-orange/90 shadow-md hover:shadow-lg"
                    : "border-brand-orange bg-brand-orange text-white hover:bg-brand-orange/90"
                )}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                MOJ NALOG
              </Button>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "lg:hidden rounded-xl p-2.5 transition-colors",
              isWhite ? "hover:bg-gray-100" : "hover:bg-white/10"
            )}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className={cn("w-6 h-6", isWhite ? "text-gray-800" : "text-white")} />
            ) : (
              <MenuIcon className={isWhite ? "text-gray-800" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Mega Menu Dropdown */}
      {activeDropdown && subcategoryEntries.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full w-full z-50"
          onMouseEnter={() => setActiveDropdown(activeDropdown)}
        >
          {/* Blurred backdrop */}
          <div 
            className={cn(
              "absolute inset-0",
              isWhite 
                ? "bg-white/80" 
                : isScrolled 
                  ? "bg-black/80" 
                  : "bg-black/60"
            )}
            style={{
              backdropFilter: isScrolled ? 'blur(24px)' : 'blur(16px)',
              WebkitBackdropFilter: isScrolled ? 'blur(24px)' : 'blur(16px)',
            }}
          />
          
          {/* Top border accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent" />
          
          {/* Content */}
          <div className="relative max-w-4xl mx-auto px-8 py-8">
            <div 
              ref={dropdownContentRef}
              className={cn(
                "grid gap-x-16 gap-y-6",
                subcategoryEntries.length === 1 
                  ? "grid-cols-1 place-items-center text-center" 
                  : subcategoryEntries.length === 2 
                    ? "grid-cols-2" 
                    : "grid-cols-3"
              )}
              style={{ justifyItems: subcategoryEntries.length > 1 ? 'start' : 'center' }}
            >
              {subcategoryEntries.map(([category, items]) => (
                <div key={category} className="min-w-[180px]">
                  {/* Category Header */}
                  <div className="mb-4 flex flex-col items-center">
                    <h3 className={cn(
                      "font-oswald text-xs font-bold uppercase tracking-[0.2em] mb-2 text-center",
                      isWhite ? "text-gray-800" : "text-white"
                    )}>
                      {category}
                    </h3>
                    <div className="w-[50px] h-0.5 bg-brand-orange" />
                  </div>
                  
                  {/* Items */}
                  <ul className={cn(
                    subcategoryEntries.length === 1 
                      ? "flex flex-wrap justify-center gap-x-6 gap-y-1" 
                      : "space-y-1"
                  )}>
                    {items.map((subItem) => (
                      <li key={subItem.href}>
                        {subItem.comingSoon ? (
                          <span
                            className={cn(
                              "flex items-center gap-2 font-oswald text-sm font-medium py-1.5 uppercase cursor-default",
                              isWhite ? "text-gray-400" : "text-gray-500"
                            )}
                          >
                            {subItem.label}
                            <span className="text-[10px] font-bold bg-brand-orange text-white px-1.5 py-0.5 rounded">
                              USKORO
                            </span>
                          </span>
                        ) : (
                          <Link
                            href={subItem.href}
                            className={cn(
                              "block font-oswald text-sm font-medium py-1.5 uppercase transition-colors duration-150",
                              isWhite 
                                ? "text-gray-600 hover:text-brand-orange" 
                                : "text-gray-300 hover:text-brand-orange"
                            )}
                            onClick={() => setActiveDropdown(null)}
                          >
                            {subItem.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          {/* Bottom shadow */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 h-px",
            isWhite ? "bg-gray-200/50" : "bg-white/10"
          )} />
        </div>
      )}

      {/* Enhanced Mobile Menu */}
      <div 
        className={cn(
          "lg:hidden fixed inset-0 top-16 md:top-20 z-50 transition-all duration-500 ease-out",
          mobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500",
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div 
          className={cn(
            "absolute top-0 left-0 right-0 h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] overflow-y-auto transition-all duration-500 ease-out flex flex-col",
            isWhite ? "bg-white" : "bg-black",
            mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}
        >
          <nav className="px-4 py-6 space-y-1 flex-1 flex flex-col">
            {navItems.map((link) => (
              <div key={link.href}>
                <div className="flex items-center">
                  <Link
                    href={link.href}
                    onClick={() => {
                      if (!link.hasDropdown) setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex-1 px-4 py-3 text-sm font-oswald font-medium rounded-xl transition-colors uppercase flex items-center justify-between",
                      isWhite 
                        ? "text-gray-800 hover:text-brand-orange hover:bg-gray-50" 
                        : "text-white hover:text-brand-orange hover:bg-white/10"
                    )}
                  >
                    {link.label}
                  </Link>
                  {link.hasDropdown && (
                    <button
                      onClick={() => setExpandedMobileItem(
                        expandedMobileItem === link.href ? null : link.href
                      )}
                      className={cn(
                        "p-3 rounded-xl transition-colors",
                        isWhite ? "hover:bg-gray-50" : "hover:bg-white/10"
                      )}
                    >
                      <ChevronDown 
                        className={cn(
                          "w-5 h-5 transition-transform duration-200",
                          isWhite ? "text-gray-600" : "text-gray-400",
                          expandedMobileItem === link.href && "rotate-180"
                        )} 
                      />
                    </button>
                  )}
                </div>
                
                {/* Mobile Submenu */}
                {link.hasDropdown && link.subcategories && expandedMobileItem === link.href && (
                  <div className={cn(
                    "ml-4 mt-2 mb-4 pl-4 border-l-2",
                    isWhite ? "border-gray-200" : "border-white/20"
                  )}>
                    {Object.entries(link.subcategories).map(([category, items]) => (
                      <div key={category} className="mb-4 last:mb-0">
                        <p className={cn(
                          "text-xs font-oswald font-bold uppercase tracking-wider mb-2 px-2",
                          isWhite ? "text-gray-500" : "text-gray-400"
                        )}>
                          {category}
                        </p>
                        {items.map((subItem) => (
                          subItem.comingSoon ? (
                            <span
                              key={subItem.href}
                              className={cn(
                                "flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-lg cursor-default",
                                isWhite ? "text-gray-400" : "text-gray-500"
                              )}
                            >
                              {subItem.label}
                              <span className="text-[10px] font-bold bg-brand-orange text-white px-1.5 py-0.5 rounded">
                                USKORO
                              </span>
                            </span>
                          ) : (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={cn(
                                "block px-2 py-2 text-sm font-medium rounded-lg transition-colors",
                                isWhite 
                                  ? "text-gray-700 hover:text-brand-orange hover:bg-gray-50" 
                                  : "text-gray-300 hover:text-brand-orange hover:bg-white/5"
                              )}
                            >
                              {subItem.label}
                            </Link>
                          )
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Bottom Section - Account & Phone */}
            <div className={cn(
              "mt-auto pt-4 border-t",
              isWhite ? "border-gray-200 bg-gray-50/50" : "border-white/10 bg-white/5"
            )}>
              {/* Mobile Account/Login Button */}
              <Link
                href={
                  isAuthenticated
                    ? user?.role === "admin"
                      ? "/admin"
                      : "/account"
                    : "/login"
                }
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-oswald font-medium rounded-xl transition-colors",
                  isWhite 
                    ? "text-gray-800 hover:text-brand-orange hover:bg-gray-100" 
                    : "text-white hover:text-brand-orange hover:bg-white/10"
                )}
              >
                <div className={cn(
                  "w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center",
                  isWhite ? "bg-brand-orange/10" : "bg-white/10"
                )}>
                  <svg width="20" height="20" className="text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="truncate">{isAuthenticated ? (user?.fullName || "Moj Nalog") : "Prijava / Registracija"}</span>
              </Link>

              {/* Mobile Phone */}
              <a
                href="tel:+38762200088"
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-oswald font-medium rounded-xl transition-colors",
                  isWhite 
                    ? "text-gray-800 hover:text-brand-orange hover:bg-gray-100" 
                    : "text-white hover:text-brand-orange hover:bg-white/10"
                )}
              >
                <div className={cn(
                  "w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center",
                  isWhite ? "bg-brand-orange/10" : "bg-white/10"
                )}>
                  <svg width="20" height="20" className="text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                + 387 62 200 088
              </a>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
}
