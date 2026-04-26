import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { ConfigBanner } from "@/components/ConfigBanner";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { getProduct, listRelated, type Product } from "@/lib/products";
import { optimizeUrl } from "@/lib/cloudinary";
import { buildWhatsAppUrl } from "@/lib/firebase";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetail,
  head: ({ params }) => ({
    meta: [
      { title: `Product Details — M.A.T.Furniture | Chidambaram & Kattumannarkoil` },
      {
        name: "description",
        content:
          "Discover premium furniture details at M.A.T.Furniture. Available at our showrooms in Chidambaram and Kattumannarkoil, Tamil Nadu.",
      },
    ],
  }),
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-display text-3xl">Something went wrong</h1>
          <p className="mt-3 text-muted-foreground">{error.message}</p>
          <button
            onClick={() => router.invalidate()}
            className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
          >
            Retry
          </button>
        </div>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="font-display text-3xl">Product not found</h1>
        <Link to="/products" className="mt-6 inline-block text-accent underline">
          Back to collection
        </Link>
      </div>
    </div>
  ),
});

function ProductDetail() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [related, setRelated] = useState<Product[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
    getProduct(id).then(setProduct).catch(() => setProduct(null));
  }, [id]);

  useEffect(() => {
    if (product) {
      listRelated(product.category, product.id, 3).then(setRelated);
    }
  }, [product]);

  if (product === undefined) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <div className="flex-1 mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-muted animate-pulse rounded-lg" />
          <div className="space-y-4">
            <div className="h-10 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-5 w-1/2 bg-muted animate-pulse rounded" />
            <div className="h-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center text-center px-6">
          <div>
            <h1 className="font-display text-3xl">Product not found</h1>
            <Link to="/products" className="mt-6 inline-block text-accent underline">
              Back to collection
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const images = product.images?.length ? product.images : [];
  const mainImg = images[active];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ConfigBanner />
      <SiteHeader />
      <main className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li><ChevronRight size={14} className="text-muted-foreground/50" /></li>
              <li>
                <Link
                  to="/products"
                  search={{ category: product.category, q: "" }}
                  className="hover:text-accent transition-colors"
                >
                  {product.category}
                </Link>
              </li>
              <li><ChevronRight size={14} className="text-muted-foreground/50" /></li>
              <li className="text-foreground font-medium truncate max-w-[200px]">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="overflow-hidden rounded-lg bg-muted shadow-card flex items-center justify-center">
                {mainImg ? (
                  <img
                    src={optimizeUrl(mainImg, 1200)}
                    alt={product.name}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setActive(i)}
                      className={`aspect-square overflow-hidden rounded-md border-2 transition ${
                        active === i ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={optimizeUrl(img, 200)}
                        alt={`${product.name} ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-accent">
                {product.category}
              </span>
              <h1 className="mt-3 font-display text-4xl md:text-5xl">{product.name}</h1>
              {product.price != null && (
                <p className="mt-4 text-2xl text-foreground/80">
                  ₹ {product.price.toLocaleString("en-IN")}
                </p>
              )}
              <div className="my-6 gold-divider" />
              <p className="text-base leading-relaxed text-foreground/80 whitespace-pre-line">
                {product.description}
              </p>

              <a
                href={buildWhatsAppUrl(`Hi! I want to get a quote for ${product.name}.\n\nURL: https://matfurniture.in/product/${product.id}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition shadow-soft"
              >
                <MessageCircle size={16} /> Get Quote
              </a>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <section className="mt-20">
              <div className="text-center mb-10">
                <span className="text-xs uppercase tracking-[0.3em] text-accent">
                  You may also like
                </span>
                <h2 className="mt-3 font-display text-3xl md:text-4xl">Related pieces</h2>
                <div className="mx-auto my-6 gold-divider" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
      <WhatsAppFab message={`I am interested in ${product.name}.\n\nURL: https://matfurniture.in/product/${product.id}`} />
    </div>
  );
}
