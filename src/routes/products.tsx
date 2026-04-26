import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { ConfigBanner } from "@/components/ConfigBanner";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { CATEGORIES, listProducts, type Product } from "@/lib/products";

type Search = { category?: string; q?: string };

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: typeof s.category === "string" ? s.category : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Furniture Collection — M.A.T.Furniture Chidambaram & Kattumannarkoil" },
      {
        name: "description",
        content:
          "Browse our premium furniture collection — wooden cots, sofas, wardrobes, dining tables, TV units & more. Available at M.A.T.Furniture showrooms in Chidambaram & Kattumannarkoil, Tamil Nadu.",
      },
    ],
  }),
});

function ProductsPage() {
  const { category = "", q = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/products" });
  const [items, setItems] = useState<Product[] | null>(null);

  useEffect(() => {
    listProducts()
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const filtered = useMemo(() => {
    if (!items) return null;
    return items.filter((p) => {
      if (category && p.category !== category) return false;
      if (q && !`${p.name} ${p.description}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
  }, [items, category, q]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ConfigBanner />
      <AnnouncementBanner />
      <SiteHeader />
      <main className="flex-1">
        <section className="py-16 border-b border-border">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-accent">
              The Collection
            </span>
            <h1 className="mt-3 font-display text-5xl md:text-6xl">Our furniture</h1>
            <div className="mx-auto my-6 gold-divider" />
            <div className="mt-6 max-w-md mx-auto relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={q}
                onChange={(e) => {
                  const value = e.target.value;
                  navigate({ search: (prev: Search) => ({ ...prev, q: value }) });
                }}
                placeholder="Search products..."
                className="w-full rounded-full border border-border bg-card pl-11 pr-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              <Pill
                active={!category}
                onClick={() => navigate({ search: (p: Search) => ({ ...p, category: "" }) })}
              >
                All
              </Pill>
              {CATEGORIES.map((c) => (
                <Pill
                  key={c}
                  active={category === c}
                  onClick={() => navigate({ search: (p: Search) => ({ ...p, category: c }) })}
                >
                  {c}
                </Pill>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered === null ? (
                Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  No products match your filters.
                </div>
              ) : (
                filtered.map((p) => <ProductCard key={p.id} product={p} />)
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-soft"
          : "bg-card text-foreground/80 border-border hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}
