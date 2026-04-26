import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, MessageCircle, Send } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { buildWhatsAppUrl } from "@/lib/firebase";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Us — M.A.T.Furniture | Visit Our Showrooms in Chidambaram & Kattumannarkoil" },
      {
        name: "description",
        content:
          "Get in touch with M.A.T.Furniture. Visit our showrooms at 50 S.P Kovil Street, Chidambaram & 83/11 Reddiyar Road, Kattumannarkoil, Tamil Nadu. Call +91 9385877457.",
      },
    ],
  }),
});

function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send an email or save to DB.
    // For now, we'll just redirect to WhatsApp as requested by the overall flow.
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
    window.open(buildWhatsAppUrl(`Hi, I'm ${name}. ${message}`), "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <SiteHeader />
      <main className="flex-1">
        {/* 1. Floating Header */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
          <motion.div
            className="absolute top-10 right-[20%] w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-float"
          />
          <div className="mx-auto max-w-7xl px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-5xl md:text-7xl">Get in Touch</h1>
              <div className="mx-auto my-6 gold-divider" />
              <p className="text-xl text-muted-foreground font-display italic">
                We're here to help you choose the perfect furniture
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2 & 3. Info Cards & Form */}
        <section className="pb-24 relative z-10">
          <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-5 gap-12">

            {/* Contact Info Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Branch Locations */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="mt-1 h-10 w-10 shrink-0 rounded-full bg-gold-grad text-charcoal flex items-center justify-center shadow-gold">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium">Our Showrooms</h3>
                  </div>
                </div>
                <div className="space-y-4 pl-14">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-accent mb-1">Chidambaram Branch</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      50, S.P Kovil Street, Chidambaram, Tamil Nadu
                    </p>
                  </div>
                  <div className="border-t border-border/40 pt-4">
                    <p className="text-xs uppercase tracking-widest text-accent mb-1">Kattumannarkoil Branch</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      83/11, Reddiyar Road, Kattumannarkoil, Tamil Nadu 608301
                    </p>
                  </div>
                </div>
              </motion.div>

              {[
                { icon: Phone, title: "Phone", content: "+91 9385877457" },
                { icon: Clock, title: "Business Hours", content: "10:00 AM – 9:00 PM" },
              ].map((info, i) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  className="glass-panel p-6 rounded-2xl flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="mt-1 h-10 w-10 shrink-0 rounded-full bg-gold-grad text-charcoal flex items-center justify-center shadow-gold">
                    <info.icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium">{info.title}</h3>
                    <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
                      {info.content}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* 4. WhatsApp CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="pt-6"
              >
                <a
                  href={buildWhatsAppUrl("Hello M.A.T.Furniture!")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition shadow-soft hover:-translate-y-1"
                >
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
              </motion.div>
            </div>

            {/* Interactive Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <form
                onSubmit={handleSubmit}
                className="glass-panel p-8 md:p-10 rounded-3xl shadow-card h-full flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <h2 className="font-display text-3xl mb-8">Send us a message</h2>

                  <div className="relative group">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      placeholder=" "
                      className="peer w-full bg-background/50 border border-border/60 text-foreground px-4 py-4 rounded-xl text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-4 top-4 text-sm text-muted-foreground transition-all duration-300 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-accent peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-2 rounded"
                    >
                      Your Name
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      placeholder=" "
                      className="peer w-full bg-background/50 border border-border/60 text-foreground px-4 py-4 rounded-xl text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                    />
                    <label
                      htmlFor="phone"
                      className="absolute left-4 top-4 text-sm text-muted-foreground transition-all duration-300 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-accent peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-2 rounded"
                    >
                      Phone Number
                    </label>
                  </div>

                  <div className="relative group">
                    <textarea
                      name="message"
                      id="message"
                      required
                      rows={4}
                      placeholder=" "
                      className="peer w-full bg-background/50 border border-border/60 text-foreground px-4 py-4 rounded-xl text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 resize-none"
                    ></textarea>
                    <label
                      htmlFor="message"
                      className="absolute left-4 top-4 text-sm text-muted-foreground transition-all duration-300 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-focus:text-accent peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-2 rounded"
                    >
                      Your Message
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-sm font-medium text-charcoal hover:bg-accent/90 transition shadow-gold hover:-translate-y-1"
                >
                  Send Message <Send size={16} />
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* 5. Embedded Google Maps */}
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.3em] text-accent">Locations</span>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">Find Our Showrooms</h2>
              <div className="mx-auto my-6 gold-divider" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Chidambaram Map */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass-panel p-2 rounded-3xl shadow-card"
              >
                <p className="text-center text-xs uppercase tracking-widest text-accent py-2">Chidambaram</p>
                <div className="rounded-[22px] overflow-hidden aspect-video">
                  <iframe
                    title="M.A.T.Furniture Chidambaram"
                    src="https://www.google.com/maps?q=M.A.T+Furniture+50+S.P+Kovil+Street+Chidambaram+Tamil+Nadu&output=embed"
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </motion.div>

              {/* Kattumannarkoil Map */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="glass-panel p-2 rounded-3xl shadow-card"
              >
                <p className="text-center text-xs uppercase tracking-widest text-accent py-2">Kattumannarkoil</p>
                <div className="rounded-[22px] overflow-hidden aspect-video">
                  <iframe
                    title="M.A.T.Furniture Kattumannarkoil"
                    src="https://www.google.com/maps?q=M.A.T+Furniture+83/11+Reddiyar+Road+Kattumannarkoil+Tamil+Nadu+608301&output=embed"
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
