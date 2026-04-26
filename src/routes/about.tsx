import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle,
  Package,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";

import hero from "@/assets/hero-living.jpg";
import catCot from "@/assets/cat-cot.jpg";
import catSofa from "@/assets/cat-sofa.jpg";
import catOffice from "@/assets/cat-office.jpg";
import catDining from "@/assets/cat-dining.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us — M.A.T.Furniture | Furniture Showroom in Chidambaram & Kattumannarkoil" },
      {
        name: "description",
        content:
          "Learn about M.A.T.Furniture — your trusted furniture showroom in Chidambaram & Kattumannarkoil, Tamil Nadu. We craft comfort and deliver elegance with premium wooden furniture, sofas, wardrobes, and more.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <SiteHeader />
      <main className="flex-1">
        {/* 1. Floating Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/40 to-background" />
          <motion.div
            className="absolute top-20 left-[10%] w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float"
          />
          <motion.div
            className="absolute bottom-10 right-[10%] w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float-delayed"
          />
          
          <div className="mx-auto max-w-7xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-xs uppercase tracking-[0.3em] text-accent">
                Our Story
              </span>
              <h1 className="mt-4 font-display text-5xl md:text-7xl">
                About M.A.T.Furniture
              </h1>
              <div className="mx-auto my-6 gold-divider" />
              <p className="mt-6 text-xl text-muted-foreground font-display italic">
                Crafting Comfort. Delivering Elegance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. Company Story (Floating Card) */}
        <section className="py-12 relative z-10">
          <div className="mx-auto max-w-4xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="glass-panel p-10 md:p-16 rounded-2xl animate-float relative"
            >
              <p className="text-lg md:text-xl text-foreground leading-relaxed text-center mb-8">
                Established in <strong>2010 as a trusted wholesaler</strong>, M.A.T.Furniture has spent over a decade supplying premium furniture to more than <strong>100+ retail showrooms</strong> across the region. In <strong>2025</strong>, we proudly launched our own retail showrooms to bring our expertly crafted pieces directly to you.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
                <div className="bg-background/50 p-6 rounded-xl border border-ivory/10">
                  <h3 className="text-xl font-display text-accent mb-4">Our Showrooms</h3>
                  <ul className="space-y-3 text-foreground/80">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-accent"><CheckCircle size={14} /></span>
                      <span><strong>Chidambaram:</strong> 8,000 sqft (G+1) massive display area.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-accent"><CheckCircle size={14} /></span>
                      <span><strong>Kattumannarkoil:</strong> 7,000 sqft (G+1) premium showroom.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-background/50 p-6 rounded-xl border border-ivory/10">
                  <h3 className="text-xl font-display text-accent mb-4">Manufacturing Excellence</h3>
                  <ul className="space-y-3 text-foreground/80">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-accent"><CheckCircle size={14} /></span>
                      <span><strong>Own Manufacturing</strong> unit located in Kerala.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-accent"><CheckCircle size={14} /></span>
                      <span>Expertise in premium woods: <strong>Teak, Mahakani, and Acacia</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-accent"><CheckCircle size={14} /></span>
                      <span>All woods are professionally chemically treated before production.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-16 text-center">
                <h3 className="text-2xl font-display mb-8">Our 5-Step Workflow</h3>
                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                  {[
                    "Treating Woods",
                    "Manufacturing",
                    "Polishing",
                    "Quality Checking",
                    "Supplying",
                  ].map((step, i) => (
                    <div key={step} className="flex items-center gap-2 md:gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-accent text-charcoal flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium text-foreground/90">{step}</span>
                      </div>
                      {i < 4 && <ArrowRight size={16} className="hidden md:block text-muted-foreground/50 mx-2" />}
                    </div>
                  ))}
                </div>
                <p className="mt-12 text-sm uppercase tracking-widest text-accent font-medium border border-accent/30 inline-block px-6 py-2 rounded-full bg-accent/5">
                  Standard Company 1-Year Warranty on All Products
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. What We Offer (Grid Cards) */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[0.3em] text-accent">
                Collections
              </span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">What We Offer</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Wooden Furniture", img: catCot },
                { title: "Sofa Collections", img: catSofa },
                { title: "Office Furniture", img: catOffice },
                { title: "Home Essentials", img: catDining },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-soft hover:-translate-y-3 transition-transform duration-500 ease-out"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="font-display text-2xl text-ivory">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Why Choose Us (Premium Highlights) */}
        <section className="py-24 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[0.3em] text-accent">
                Our Values
              </span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">Why Choose Us</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Star, title: "Affordable Pricing", desc: "Premium luxury at honest prices." },
                { icon: ShieldCheck, title: "Quality Materials", desc: "Built to last for generations." },
                { icon: Package, title: "Wide Variety", desc: "Something for every home style." },
                { icon: CheckCircle, title: "Customer Satisfaction", desc: "Your happiness is our priority." },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="h-12 w-12 rounded-full bg-gold-grad text-charcoal flex items-center justify-center mb-6 shadow-gold">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="font-display text-xl mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Call to Action */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img
              src={hero}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm" />
          </div>
          
          <div className="mx-auto max-w-3xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="glass-panel p-12 rounded-3xl animate-float shadow-2xl border-ivory/20"
            >
              <h2 className="font-display text-4xl md:text-5xl text-card-foreground mb-6">
                Ready to transform your home?
              </h2>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-charcoal hover:bg-accent/90 transition shadow-gold hover:-translate-y-1"
              >
                Explore Our Collection <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
