import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { listGalleryImages, type GalleryImage } from "@/lib/gallery";
import { optimizeUrl } from "@/lib/cloudinary";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Showroom Gallery — M.A.T.Furniture | Chidambaram & Kattumannarkoil" },
      {
        name: "description",
        content:
          "Take a virtual tour of the M.A.T.Furniture showrooms. See our premium collection of wooden furniture, sofas, and dining sets in person at Chidambaram & Kattumannarkoil.",
      },
    ],
  }),
});

function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[] | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    listGalleryImages()
      .then(setImages)
      .catch(() => setImages([]));
  }, []);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prev = () =>
    setLightbox((i) =>
      i !== null && images ? (i - 1 + images.length) % images.length : null,
    );
  const next = () =>
    setLightbox((i) =>
      i !== null && images ? (i + 1) % images.length : null,
    );

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
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
            <span className="text-xs uppercase tracking-[0.3em] text-accent">
              Our Space
            </span>
            <h1 className="mt-3 font-display text-5xl md:text-6xl">
              Showroom Gallery
            </h1>
            <div className="mx-auto my-6 gold-divider" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Step inside our showroom and explore our curated collection of
              premium furniture pieces.
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="pb-24">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            {images === null ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">Gallery photos coming soon.</p>
                <p className="mt-2 text-sm">
                  Check back later to see our showroom!
                </p>
              </div>
            ) : (
              <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                {images.map((img, i) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                    className="break-inside-avoid group cursor-pointer"
                    onClick={() => openLightbox(i)}
                  >
                    <div className="relative overflow-hidden rounded-xl shadow-card">
                      <img
                        src={optimizeUrl(img.url, 600)}
                        alt={img.caption || "Showroom photo"}
                        loading="lazy"
                        className="w-full object-cover hover-zoom"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-sm text-ivory font-medium">
                            {img.caption}
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
        {lightbox !== null && images && images[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/95 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 rounded-full bg-ivory/10 p-2 text-ivory hover:bg-ivory/20 transition"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 z-10 rounded-full bg-ivory/10 p-3 text-ivory hover:bg-ivory/20 transition"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Image */}
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={optimizeUrl(images[lightbox]!.url, 1200)}
              alt={images[lightbox]!.caption || "Gallery image"}
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 z-10 rounded-full bg-ivory/10 p-3 text-ivory hover:bg-ivory/20 transition"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Caption + Counter */}
            <div className="absolute bottom-6 text-center text-ivory">
              {images[lightbox]!.caption && (
                <p className="text-sm font-medium mb-1">
                  {images[lightbox]!.caption}
                </p>
              )}
              <p className="text-xs text-ivory/60">
                {lightbox + 1} / {images.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
