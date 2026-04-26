import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Plus, Megaphone, Images, Tags } from "lucide-react";
import { signOut, useAuthUser } from "@/lib/auth";
import { useEffect, type ReactNode } from "react";

export function AdminShell({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  const { user, loading } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/admin/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-charcoal text-ivory flex items-center justify-center">
        <div className="text-ivory/60 text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-ivory">
      <header className="border-b border-ivory/10">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-baseline gap-2">
            <span className="font-display text-xl">M.A.T.</span>
            <span className="font-display text-xl text-accent">Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/announcements"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-ivory/20 text-ivory/80 text-sm font-medium px-4 py-2 hover:border-accent hover:text-accent transition"
            >
              <Megaphone size={14} /> Announcements
            </Link>
            <Link
              to="/admin/gallery"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-ivory/20 text-ivory/80 text-sm font-medium px-4 py-2 hover:border-accent hover:text-accent transition"
            >
              <Images size={14} /> Gallery
            </Link>
            <Link
              to="/admin/offers"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-ivory/20 text-ivory/80 text-sm font-medium px-4 py-2 hover:border-accent hover:text-accent transition"
            >
              <Tags size={14} /> Offers
            </Link>
            <Link
              to="/admin/add-product"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gold-grad text-charcoal text-sm font-medium px-4 py-2"
            >
              <Plus size={14} /> Add product
            </Link>
            <span className="hidden md:inline text-xs text-ivory/60">{user.email}</span>
            <button
              onClick={() => signOut().then(() => navigate({ to: "/admin/login" }))}
              className="inline-flex items-center gap-2 text-sm text-ivory/80 hover:text-accent"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <h1 className="font-display text-3xl md:text-4xl">{title}</h1>
          {action}
        </div>
        {children}
      </main>
    </div>
  );
}
