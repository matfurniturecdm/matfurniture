import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-foreground">404</h1>
        <div className="mx-auto my-4 gold-divider" />
        <h2 className="mt-2 text-xl text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── JSON-LD Structured Data ── */
const SITE_URL = "https://matfurniture.in";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "@id": `${SITE_URL}/#organization`,
  name: "M.A.T.Furniture",
  alternateName: "MAT Furniture",
  description:
    "Premium furniture showroom in Chidambaram & Kattumannarkoil, Tamil Nadu. Wooden cots, sofas, wardrobes, dining tables, dressing tables, TV units, office furniture, shoe racks and pooja units.",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.jpg`,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: "+919385877457",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Bank Transfer",
  openingHours: "Mo-Su 10:00-21:00",
  sameAs: [],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "50, S.P Kovil Street",
      addressLocality: "Chidambaram",
      addressRegion: "Tamil Nadu",
      postalCode: "608001",
      addressCountry: "IN",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "83/11, Reddiyar Road",
      addressLocality: "Kattumannarkoil",
      addressRegion: "Tamil Nadu",
      postalCode: "608301",
      addressCountry: "IN",
    },
  ],
  geo: [
    {
      "@type": "GeoCoordinates",
      latitude: "11.3993",
      longitude: "79.6932",
    },
    {
      "@type": "GeoCoordinates",
      latitude: "11.2802",
      longitude: "79.5348",
    },
  ],
  areaServed: [
    { "@type": "City", name: "Chidambaram" },
    { "@type": "City", name: "Kattumannarkoil" },
    { "@type": "State", name: "Tamil Nadu" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Furniture Collection",
    itemListElement: [
      "Wooden Cot", "Sofa Collection", "Wardrobes", "Dining Tables",
      "Dressing Tables", "TV Units", "Office Furniture",
      "Shoe Racks & Utility", "Pooja Units",
    ].map((cat) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: cat },
    })),
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "M.A.T.Furniture",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});


function RootComponent() {
  const isNavigating = useRouterState({ select: (s) => s.isLoading });
  
  return (
    <>
      {isNavigating && <div className="route-loading-bar" />}
      <Outlet />
      <Toaster position="top-center" richColors />
    </>
  );
}
