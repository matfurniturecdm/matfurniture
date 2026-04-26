import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const links = [
  { to: "/" as const, label: "Home" },
  { to: "/products" as const, label: "Collection" },
  { to: "/gallery" as const, label: "Gallery" },
  { to: "/offers" as const, label: "Offers" },
  { to: "/about" as const, label: "About" },
  { to: "/contact" as const, label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2 group">
          <span className="font-display text-2xl tracking-tight text-foreground">
            M.A.T.
          </span>
          <span className="font-display text-2xl text-accent">Furniture</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to as any}
              className="text-sm tracking-wide uppercase text-foreground/80 hover:text-accent transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className="p-2 rounded-full text-foreground/80 hover:text-accent hover:bg-accent/10 transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/products"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition shadow-soft"
          >
            Explore Collection
          </Link>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 text-foreground"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="flex flex-col px-6 py-4 gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to as any}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-wide text-foreground/80 hover:text-accent transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-3">
              <button
                aria-label="Toggle dark mode"
                onClick={toggleTheme}
                className="p-2 rounded-full text-foreground/80 hover:text-accent hover:bg-accent/10 transition"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link
                to="/products"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground text-center"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
