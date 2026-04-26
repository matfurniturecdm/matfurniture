import { Link } from "@tanstack/react-router";
import { optimizeUrl } from "@/lib/cloudinary";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0];
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block bg-card rounded-lg overflow-hidden shadow-card hover:shadow-soft transition-shadow"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {img ? (
          <img
            src={optimizeUrl(img, 800)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover hover-zoom"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
        <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-foreground/80">
          {product.category}
        </div>
      </div>
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-display text-xl text-foreground group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          {product.price != null && (
            <p className="mt-1 text-sm text-muted-foreground">
              ₹ {product.price.toLocaleString("en-IN")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-card">
      <div className="aspect-video bg-muted animate-pulse" />
      <div className="p-5 space-y-2">
        <div className="h-5 w-2/3 bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}
