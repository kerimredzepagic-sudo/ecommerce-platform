import { NavItem } from "@/components/shared/MainNavbar";
import type { ShopCategoryTreeNode } from "@/hooks/useShopApi";

// ========================================
// DYNAMIC NAVIGATION BUILDER
// ========================================

/**
 * Build shop navigation items dynamically from category tree
 * Respects the order set in admin panel
 */
export function buildDynamicShopNavItems(categories: ShopCategoryTreeNode[]): NavItem[] {
  // Filter active categories and sort by order
  const activeCategories = categories
    .filter(c => c.isActive)
    .sort((a, b) => a.order - b.order);
  
  // Transform to NavItem format with subcategories
  const categoryNavItems: NavItem[] = activeCategories.map(cat => {
    const activeChildren = (cat.children || [])
      .filter(c => c.isActive)
      .sort((a, b) => a.order - b.order);
    
    const hasChildren = activeChildren.length > 0;
    
    return {
      href: `/shop/products?category=${cat.slug}`,
      label: cat.name.toUpperCase(),
      hasDropdown: hasChildren,
      subcategories: hasChildren ? {
        [cat.name.toUpperCase()]: activeChildren.map(child => ({
          href: `/shop/products?category=${child.slug}`,
          label: child.name,
        }))
      } : undefined,
    };
  });

  // Return navigation with static items + dynamic categories
  return [
    { href: "/shop", label: "POČETNA", hasDropdown: false },
    ...categoryNavItems,
    { href: "/shop/products?sort=newest", label: "NOVO", hasDropdown: false },
    { href: "/", label: "KORPORATIVNA STRANICA", hasDropdown: false },
  ];
}

// ========================================
// CORPORATE NAVIGATION - Subcategories
// ========================================

// Naša Priča dropdown
const nasaPricaSubcategories = {
  "NAŠA PRIČA": [
    { href: "/o-nama", label: "O Nama" },
    { href: "/misijavizija", label: "Misija i Vizija" },
    { href: "/o-nama/strategije", label: "Strategije" },
    { href: "/o-nama/politike", label: "Politike" },
    { href: "/karijera", label: "Karijera" },
  ],
};

// Proizvodi dropdown - organized by lines and categories
const proizvodiSubcategories = {
  "LINIJE PROIZVODA": [
    { href: "/shop/products?line=originals", label: "Originals" },
    { href: "/shop/products?line=premium", label: "Premium" },
    { href: "/shop/products?line=health", label: "Health" },
    { href: "/shop/products?line=energy", label: "Energy" },
  ],
  "KATEGORIJE": [
    { href: "/shop/products?category=pica", label: "Pića" },
    { href: "/shop/products?category=med-i-medne-mjesavine", label: "Med i medne mješavine" },
    { href: "/shop/products?category=namazi", label: "Namazi" },
    { href: "/shop/products?category=pekmezi", label: "Pekmezi" },
    { href: "/shop/products?category=slani-program", label: "Slani program" },
    { href: "/shop/products?category=slatki-program", label: "Slatki program" },
    { href: "/shop/products?category=ulja-i-zacini", label: "Ulja i začini" },
  ],
};

// Pčelinjak dropdown
const pcelinjakhSubcategories = {
  "SHOPKIT PČELINJAK": [
    { href: "/api-terapija", label: "Api Centar" },
    { href: "/proizvodnja", label: "Proizvodnja" },
    { href: "/pcelinjak/caffe", label: "ShopKit Caffe", comingSoon: true },
    { href: "/pcelinjak/trgovina", label: "ShopKit Trgovina" },
    { href: "/pcelinjak/edukacija", label: "Edukacija", comingSoon: true },
  ],
};

// Poklon paketi dropdown
const poklonPaketiSubcategories = {
  "POKLON PAKETI": [
    { href: "/poklon-paketi", label: "Svi Paketi" },
    { href: "/poklon-paketi#originals", label: "Originals Paket" },
    { href: "/poklon-paketi#premium", label: "Premium Paket" },
    { href: "/poklon-paketi#health", label: "Health Paket" },
    { href: "/poklon-paketi#energy", label: "Energy Paket" },
    { href: "/team-building", label: "Team Building" },
  ],
};

// Blog dropdown (disabled - no subcategories)
// const blogSubcategories = {
//   "BLOG": [
//     { href: "/blog", label: "Svi Članci" },
//   ],
// };

// ========================================
// SHOP NAVIGATION - Subcategories
// ========================================

// Linije dropdown for shop
const shopLinijeSubcategories = {
  "LINIJE": [
    { href: "/shop/products?line=originals", label: "Originals" },
    { href: "/shop/products?line=premium", label: "Premium" },
    { href: "/shop/products?line=health", label: "Health" },
    { href: "/shop/products?line=energy", label: "Energy" },
  ],
};

// Med i medne mješavine subcategories (real from database)
const shopMedSubcategories = {
  "MED": [
    { href: "/shop/products?category=med", label: "Čisti med" },
    { href: "/shop/products?category=medne-mjesavine", label: "Medne mješavine" },
    { href: "/shop/products?category=med-sa-dodacima", label: "Med sa dodacima" },
  ],
};

// Pića subcategories
const shopPicaSubcategories = {
  "PIĆA": [
    { href: "/shop/products?category=vocni-sokovi", label: "100% Voćni sokovi" },
    { href: "/shop/products?category=vocni-sirupi", label: "Voćni sirupi" },
    { href: "/shop/products?category=biljni-sirupi", label: "Biljni sirupi" },
  ],
};

// Namazi subcategories
const shopNamaziSubcategories = {
  "NAMAZI": [
    { href: "/shop/products?category=dzemovi-i-vocni-namazi", label: "Džemovi i voćni namazi" },
    { href: "/shop/products?category=hurma-namazi", label: "Namazi na bazi hurme" },
    { href: "/shop/products?category=puteri", label: "100% puteri" },
  ],
};

// Pekmezi subcategories
const shopPekmeziSubcategories = {
  "PEKMEZI": [
    { href: "/shop/products?category=100-pekmezi", label: "100% Pekmezi" },
    { href: "/shop/products?category=imuno-pekmezi", label: "Imuno Pekmezi" },
  ],
};

// Slani program subcategories
const shopSlaniSubcategories = {
  "SLANI PROGRAM": [
    { href: "/shop/products?category=orasasti-plodovi", label: "Orašasti plodovi" },
    { href: "/shop/products?category=sjemenke", label: "Sjemenke" },
    { href: "/shop/products?category=sosevi-i-preradevine", label: "Sosevi i prerađevine" },
  ],
};

// Slatki program subcategories
const shopSlatkiSubcategories = {
  "SLATKI PROGRAM": [
    { href: "/shop/products?category=energy-balls", label: "Energy balls" },
    { href: "/shop/products?category=suho-voce", label: "Suho voće" },
    { href: "/shop/products?category=lokumi-i-vocni-mixevi", label: "Lokumi i mixevi" },
    { href: "/shop/products?category=slatki-program-ostalo", label: "Ostalo" },
  ],
};

// Ulja i začini subcategories
const shopUljaSubcategories = {
  "ULJA I ZAČINI": [
    { href: "/shop/products?category=ulja", label: "Ulja" },
    { href: "/shop/products?category=slani-zacini", label: "Slani začini" },
    { href: "/shop/products?category=slatki-zacini", label: "Slatki začini" },
    { href: "/shop/products?category=domace-sirce", label: "Domaće sirće" },
  ],
};

// ========================================
// CORPORATE NAVIGATION ITEMS
// ========================================
export const corporateNavItems: NavItem[] = [
  { href: "/", label: "NASLOVNICA", hasDropdown: false },
  { 
    href: "/o-nama", 
    label: "NAŠA PRIČA", 
    hasDropdown: true,
    subcategories: nasaPricaSubcategories,
  },
  {
    href: "/proizvodi",
    label: "PROIZVODI",
    hasDropdown: true,
    subcategories: proizvodiSubcategories,
  },
  {
    href: "/api-terapija",
    label: "PČELINJAK",
    hasDropdown: true,
    subcategories: pcelinjakhSubcategories,
  },
  { href: "/shop", label: "WEBSHOP", hasDropdown: false },
  { href: "/blog", label: "BLOG", hasDropdown: false },
  { href: "/poklon-paketi", label: "POKLON PAKETI", hasDropdown: false },
  { href: "/poslovnice", label: "POSLOVNICE", hasDropdown: false },
  { href: "/kontakt", label: "KONTAKT", hasDropdown: false },
];

// ========================================
// SHOP NAVIGATION ITEMS
// ========================================
export const shopNavItems: NavItem[] = [
  { href: "/shop", label: "POČETNA", hasDropdown: false },
  { 
    href: "/shop/products", 
    label: "LINIJE", 
    hasDropdown: true,
    subcategories: shopLinijeSubcategories,
  },
  {
    href: "/shop/products?category=pica",
    label: "PIĆA",
    hasDropdown: true,
    subcategories: shopPicaSubcategories,
  },
  {
    href: "/shop/products?category=med-i-medne-mjesavine",
    label: "MED",
    hasDropdown: true,
    subcategories: shopMedSubcategories,
  },
  {
    href: "/shop/products?category=namazi",
    label: "NAMAZI",
    hasDropdown: true,
    subcategories: shopNamaziSubcategories,
  },
  {
    href: "/shop/products?category=pekmezi",
    label: "PEKMEZI",
    hasDropdown: true,
    subcategories: shopPekmeziSubcategories,
  },
  {
    href: "/shop/products?category=slani-program",
    label: "SLANI PROGRAM",
    hasDropdown: true,
    subcategories: shopSlaniSubcategories,
  },
  {
    href: "/shop/products?category=slatki-program",
    label: "SLATKI PROGRAM",
    hasDropdown: true,
    subcategories: shopSlatkiSubcategories,
  },
  {
    href: "/shop/products?category=ulja-i-zacini",
    label: "ULJA I ZAČINI",
    hasDropdown: true,
    subcategories: shopUljaSubcategories,
  },
  { 
    href: "/shop/products?sort=newest", 
    label: "NOVO", 
    hasDropdown: false 
  },
  { 
    href: "/", 
    label: "KORPORATIVNA STRANICA", 
    hasDropdown: false 
  },
];

// ========================================
// FOOTER NAVIGATION
// ========================================
export const footerNavItems = {
  products: [
    { href: "/linije/originals", label: "Originals" },
    { href: "/linije/premium", label: "Premium" },
    { href: "/linije/health", label: "Health" },
    { href: "/linije/energy", label: "Energy" },
  ],
  company: [
    { href: "/o-nama", label: "O nama" },
    { href: "/o-nama/strategije", label: "Strategije" },
    { href: "/proizvodnja", label: "Proizvodnja" },
    { href: "/poslovnice", label: "Poslovnice" },
    { href: "/karijera", label: "Karijera" },
  ],
  pcelinjak: [
    { href: "/api-terapija", label: "Api Centar" },
    { href: "/pcelinjak/caffe", label: "ShopKit Caffe" },
    { href: "/pcelinjak/trgovina", label: "ShopKit Trgovina" },
    { href: "/pcelinjak/edukacija", label: "Edukacija" },
    { href: "/team-building", label: "Team Building" },
  ],
  support: [
    { href: "/kontakt", label: "Kontakt" },
    { href: "/faq", label: "Česta pitanja" },
    { href: "/novosti", label: "Novosti" },
    { href: "/mediji", label: "Mediji" },
  ],
  legal: [
    { href: "/o-nama/politike", label: "Politike" },
    { href: "/politika-privatnosti", label: "Privatnost" },
    { href: "/uslovi-koristenja", label: "Uslovi korištenja" },
    { href: "/politika-kolacica", label: "Kolačići" },
  ],
};
