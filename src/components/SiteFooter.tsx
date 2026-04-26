import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-luxe text-ivory mt-24">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl">M.A.T.</span>
            <span className="font-display text-2xl text-accent">Furniture</span>
          </div>
          <p className="mt-4 text-sm text-ivory/70 max-w-xs">
            Crafting comfort and delivering elegance from Chidambaram, Tamil Nadu.
          </p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest text-accent">Visit Us</h4>
          <p className="mt-4 text-sm leading-relaxed text-ivory/80">
            50, S.P Kovil Street<br />
            Chidambaram, Tamil Nadu<br />
            India
          </p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest text-accent">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li><Link to="/" className="hover:text-accent">Home</Link></li>
            <li><Link to="/products" className="hover:text-accent">Collection</Link></li>
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            <li><Link to="/admin/login" className="hover:text-accent">Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-6 text-center text-xs text-ivory/50">
        © {new Date().getFullYear()} M.A.T.Furniture. All rights reserved.
      </div>
    </footer>
  );
}
