import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Tags } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { listOffers, type OfferImage } from "@/lib/offers";
import { optimizeUrl } from "@/lib/cloudinary";

export const Route = createFileRoute("/offers")({
  component: OffersPage,
  head: () => ({
    meta: [
      { title: "Special Offers — M.A.T.Furniture | Chidambaram & Kattumannarkoil" },
      {
        name: "description",
        content:
          "Discover the latest deals, discounts, and special offers on premium furniture at M.A.T.Furniture showrooms in Chidambaram & Kattumannarkoil.",
      },
    ],
  }),
});

function OffersPage() {
  const [offers, setOffers] = useState<OfferImage[] | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    listOffers()
      .then(setOffers)
      .catch(() => setOffers([]));
  }, []);

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);

  const prevImage = () => {
    if (!offers) return;
    setLightbox((prev) => (prev === null ? null : (prev - 1 + offers.length) % offers.length));
  };

  const nextImage = () => {
    if (!offers) return;
    setLightbox((prev) => (prev === null ? null : (prev + 1) % offers.length));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Header */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-accent flex items-center justify-center gap-2">
              <Tags size={14} /> Deals & Discounts
            </span>
            <h1 className="mt-3 font-display text-5xl md:text-6xl">
              Special Offers
            </h1>
            <div className="mx-auto my-6 gold-divider" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our currently active special deals and festive offers.
              Contact us to claim these discounts before they expire!
            </p>
          </div>
        </section>

        {/* Offers Grid */}
        <section className="pb-24">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            {offers === null ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] rounded-xl bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">No active offers at the moment.</p>
                <p className="mt-2 text-sm">
                  Please check back later for upcoming festive sales!
                </p>
              </div>
            ) : (
              <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                {offers.map((offer, i) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                    className="break-inside-avoid group cursor-pointer"
                    onClick={() => openLightbox(i)}
                  >
                    <div className="relative overflow-hidden rounded-xl shadow-card bg-muted">
                      <img
                        src={optimizeUrl(offer.url, 600)}
                        alt={offer.caption || "Special Offer"}
                        loading="lazy"
                        className="w-full h-auto hover-zoom"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {offer.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-sm text-ivory font-medium">
                            {offer.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFab />

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && offers && offers[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/95 backdrop-blur-sm p-4"
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition z-10"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition z-10 hidden md:block"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition z-10 hidden md:block"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()} // Prevent click from closing
            >
              <img
                src={optimizeUrl(offers[lightbox].url, 1200)}
                alt={offers[lightbox].caption || "Offer details"}
                className="max-w-full max-h-[80vh] object-contain rounded-md shadow-2xl"
              />
              {offers[lightbox].caption && (
                <div className="mt-4 text-center w-full max-w-2xl px-4">
                  <p className="text-white/90 text-lg font-medium">
                    {offers[lightbox].caption}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
