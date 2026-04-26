import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  getActiveAnnouncement,
  type Announcement,
} from "@/lib/announcements";

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Fetch active announcement on mount (client-only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    getActiveAnnouncement().then(setAnnouncement);
  }, []);

  // Delay visibility for smooth entry
  useEffect(() => {
    if (announcement && !dismissed) {
      const t = setTimeout(() => setVisible(true), 200);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [announcement, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
  };

  // Render nothing when no active announcement or dismissed
  if (!announcement || !announcement.isActive || dismissed) return null;

  // Determine if link is internal (starts with /) or external
  const isInternal = announcement.link?.startsWith("/");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative z-50 w-full bg-gold-grad overflow-hidden"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-8 py-1.5 md:py-2">
            {/* Message */}
            <p className="text-xs md:text-sm font-medium text-charcoal text-center leading-tight truncate">
              {announcement.message}
            </p>

            {/* CTA */}
            {announcement.link && (
              <>
                {isInternal ? (
                  <Link
                    to={announcement.link}
                    className="hidden sm:inline-flex shrink-0 items-center gap-1 text-xs font-bold uppercase tracking-wider text-charcoal/80 hover:text-charcoal underline underline-offset-2 transition"
                  >
                    Explore <ArrowRight size={10} />
                  </Link>
                ) : (
                  <a
                    href={announcement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex shrink-0 items-center gap-1 text-xs font-bold uppercase tracking-wider text-charcoal/80 hover:text-charcoal underline underline-offset-2 transition"
                  >
                    Explore <ArrowRight size={10} />
                  </a>
                )}
              </>
            )}

            {/* Close */}
            <button
              onClick={handleDismiss}
              aria-label="Dismiss announcement"
              className="absolute right-3 shrink-0 rounded-full p-1 text-charcoal/50 hover:text-charcoal transition"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
