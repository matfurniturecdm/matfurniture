import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { signIn } from "@/lib/auth";
import { useAuthUser } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { user, loading } = useAuthUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/admin/dashboard" });
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
      toast.error("Firebase is not configured. Add VITE_FIREBASE_* to .env");
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back");
      navigate({ to: "/admin/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxe text-ivory flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-baseline gap-2 justify-center">
          <span className="font-display text-2xl">M.A.T.</span>
          <span className="font-display text-2xl text-accent">Furniture</span>
        </Link>
        <div className="mt-10 rounded-2xl bg-ivory/[0.04] backdrop-blur-md border border-ivory/10 p-8 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gold-grad text-charcoal flex items-center justify-center">
              <Lock size={18} />
            </div>
            <div>
              <h1 className="font-display text-2xl">Admin Sign In</h1>
              <p className="text-sm text-ivory/60">Manage your catalog</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-ivory/70">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-md bg-ivory/5 border border-ivory/15 px-4 py-3 text-ivory focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-ivory/70">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md bg-ivory/5 border border-ivory/15 px-4 py-3 text-ivory focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full rounded-full bg-gold-grad text-charcoal font-medium py-3 hover:opacity-95 transition disabled:opacity-50"
            >
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {!isFirebaseConfigured && (
            <p className="mt-6 text-xs text-accent/90 text-center">
              Firebase env vars missing. See <code>src/lib/firebase.ts</code>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
