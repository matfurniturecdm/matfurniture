import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Truck,
  Star,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { ConfigBanner } from "@/components/ConfigBanner";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { CATEGORIES, listFeatured, type Product } from "@/lib/products";
import { listFeaturedGallery, type GalleryImage } from "@/lib/gallery";
import { listFeaturedOffers, type OfferImage } from "@/lib/offers";
import { buildWhatsAppUrl } from "@/lib/firebase";
import { optimizeUrl } from "@/lib/cloudinary";

import hero from "@/assets/hero-living.jpg";
import catCot from "@/assets/cat-cot.jpg";
import catSofa from "@/assets/cat-sofa.jpg";
import catWardrobe from "@/assets/cat-wardrobe.jpg";
import catDining from "@/assets/cat-dining.jpg";
import catDressing from "@/assets/cat-dressing.jpg";
import catTv from "@/assets/cat-tv.jpg";
import catOffice from "@/assets/cat-office.jpg";
import catShoe from "@/assets/cat-shoerack.jpg";
import catPooja from "@/assets/cat-pooja.jpg";
import catMattress from "@/assets/cat-mattress.png";
import catTeapoy from "@/assets/cat-teapoy.png";

const categoryImages: Record<string, string> = {
  "Wooden Cot": catCot,
  "Sofa Collection": catSofa,
  "Wardrobes": catWardrobe,
  "Dining Tables": catDining,
  "Dressing Tables": catDressing,
  "TV Units": catTv,
  "Office Furniture": catOffice,
  "Shoe Racks & Utility": catShoe,
  "Pooja Units": catPooja,
  "Mattresses": catMattress,
  "Teapoys": catTeapoy,
};

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ConfigBanner />
      <AnnouncementBanner />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ShowroomGallery />
        <FeaturedOffers />
        <About />
        <Categories />
        <Featured />
        <WhyUs />
        <Testimonials />
        <Contact />
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={hero}
        alt="Luxury living room interior"
        width={1920}
        height={1080}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal/85 via-charcoal/55 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-32 md:py-44">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="max-w-2xl text-ivory"
        >
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent">
            <span className="h-px w-8 bg-accent" /> Chidambaram, Kattumannarkoil, Tamil Nadu
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-balance">
            M.A.T.<span className="text-accent">Furniture</span>
          </h1>
          <p className="mt-5 text-xl md:text-2xl font-display italic text-ivory/85">
            Crafting Comfort. Delivering Elegance.
          </p>
          <p className="mt-6 text-base text-ivory/75 max-w-xl">
            A curated showroom of premium wooden cots, sofas, wardrobes, dining sets and
            more — built to last, designed to delight.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-charcoal hover:bg-accent/90 transition shadow-gold"
            >
              Explore Collection
              <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
            </Link>
            <a
              href={buildWhatsAppUrl("Hello M.A.T.Furniture, I'd like to enquire.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-medium text-white hover:bg-[#1ebe5b] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ShowroomGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    listFeaturedGallery(6)
      .then(setImages)
      .catch(() => setImages([]));
  }, []);

  if (images.length === 0) return null;

  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent">
              Our Showroom
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Step Inside
            </h2>
          </div>
          <Link
            to="/gallery"
            className="text-sm uppercase tracking-wide text-foreground hover:text-accent flex items-center gap-2"
          >
            View full gallery <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <Link
              key={img.id}
              to="/gallery"
              className="group"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-card">
                <img
                  src={optimizeUrl(img.url, 640)}
                  alt={img.caption || "Showroom"}
                  loading="lazy"
                  className="h-full w-full object-cover hover-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm text-ivory font-medium">{img.caption}</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedOffers() {
  const [offers, setOffers] = useState<OfferImage[]>([]);

  useEffect(() => {
    listFeaturedOffers(4)
      .then(setOffers)
      .catch(() => setOffers([]));
  }, []);

  if (offers.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-secondary/30 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent">
              Special Deals
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Ongoing Offers</h2>
          </div>
          <Link
            to="/offers"
            className="text-sm uppercase tracking-wide text-foreground hover:text-accent flex items-center gap-2"
          >
            View all offers <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {offers.map((offer) => (
            <Link
              key={offer.id}
              to="/offers"
              className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-card border border-border"
            >
              <img
                src={optimizeUrl(offer.url, 400)}
                alt={offer.caption || "Special Offer"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {offer.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm text-ivory font-medium">
                    {offer.caption}
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-accent">About Us</span>
        <h2 className="mt-4 font-display text-4xl md:text-5xl text-foreground text-balance">
          A legacy of comfort, crafted in every detail.
        </h2>
        <div className="mx-auto my-8 gold-divider" />
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10">
          Established in 2010 as a trusted wholesaler and now a premier retail destination, M.A.T.Furniture brings you expertly crafted pieces directly from our own manufacturing units in Kerala. With massive showrooms in Chidambaram and Kattumannarkoil, we provide premium quality wooden cots, sofas, and dining sets — all backed by our standard 1-year warranty.
        </p>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3 text-sm font-medium hover:border-accent hover:text-accent transition shadow-sm"
        >
          Discover Our Story <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="py-20 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent">
              Collections
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Browse by category</h2>
          </div>
          <Link
            to="/products"
            className="text-sm uppercase tracking-wide text-foreground hover:text-accent flex items-center gap-2"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-5">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c}
              to="/products"
              search={{ category: c, q: "" }}
              className="group relative aspect-square overflow-hidden rounded-lg shadow-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <img
                src={categoryImages[c]}
                alt={c}
                loading="lazy"
                className="h-full w-full object-cover hover-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-xl text-ivory">{c}</h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition">
                  Explore <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Featured() {
  const [items, setItems] = useState<Product[] | null>(null);
  useEffect(() => {
    listFeatured(6)
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">
            Recently Added
          </span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Featured pieces</h2>
          <div className="mx-auto my-6 gold-divider" />
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items === null
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : items.length === 0
              ? (
                <div className="col-span-full text-center py-16 text-muted-foreground">
                  No products yet. Add your first product from the{" "}
                  <Link to="/admin/login" className="text-accent underline">
                    admin panel
                  </Link>
                  .
                </div>
              )
              : items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

const reasons = [
  { icon: Sparkles, title: "Premium Quality Materials", text: "Hand-picked woods and finishes that last for generations." },
  { icon: ShieldCheck, title: "Trusted by Locals", text: "Loved by families across Chidambaram and beyond." },
  { icon: Truck, title: "Wide Collection Range", text: "From cots to pooja units — everything for your home." },
  { icon: Star, title: "Affordable Pricing", text: "Luxury you can afford, without compromise." },
];

function WhyUs() {
  return (
    <section className="py-24 bg-luxe text-ivory">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">Why Us</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">The M.A.T. promise</h2>
          <div className="mx-auto my-6 gold-divider" />
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-lg border border-ivory/10 p-7 bg-ivory/[0.03] hover:bg-ivory/[0.06] transition">
              <div className="h-11 w-11 rounded-full bg-gold-grad text-charcoal flex items-center justify-center">
                <r.icon size={20} />
              </div>
              <h3 className="mt-5 font-display text-xl">{r.title}</h3>
              <p className="mt-2 text-sm text-ivory/70 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  { name: "NETHAJI", text: "Good Shop massive collectionsAttractive price I will give 5 out of 5 rating" },
  { name: "SADIQ PASHA", text: "Good quality, affordable price, nice co operation with staff" },
  { name: "V.Balasubiramaniyan Subiramani", text: "They provide best service and quality" },
];

function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">Reviews</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Loved by our customers</h2>
          <div className="mx-auto my-6 gold-divider" />
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-lg bg-card p-8 shadow-card border border-border hover:scale-102 transition-transform duration-200">
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <blockquote className="mt-4 font-display text-xl leading-snug text-foreground">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-5 text-sm text-muted-foreground uppercase tracking-widest">
                — {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="py-24 bg-secondary/40">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-accent">Visit</span>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Come experience the showroom</h2>
        <div className="mx-auto my-6 gold-divider" />
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
          Ready to find the perfect piece for your home? Get in touch with our team or visit us at our showroom in Chidambaram.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition shadow-soft hover:-translate-y-1"
        >
          <MapPin size={16} /> Contact Us
        </Link>
      </div>
    </section>
  );
}
