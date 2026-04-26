import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, ImageOff, Star } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { listProducts, deleteProduct, updateProduct, CATEGORIES, type Product } from "@/lib/products";
import { optimizeUrl } from "@/lib/cloudinary";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [items, setItems] = useState<Product[] | null>(null);
  const [filterCat, setFilterCat] = useState("");
  const navigate = useNavigate();

  const filtered = items
    ? filterCat
      ? items.filter((p) => p.category === filterCat)
      : items
    : null;

  const reload = () => {
    listProducts()
      .then(setItems)
      .catch((e) => {
        toast.error(e.message);
        setItems([]);
      });
  };
  useEffect(reload, []);

  const onDelete = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try {
      await deleteProduct(p.id);
      toast.success("Product deleted");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const onToggleFeatured = async (p: Product) => {
    try {
      await updateProduct(p.id, { isFeatured: !p.isFeatured });
      toast.success(p.isFeatured ? "Removed from featured" : "Added to featured");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  return (
    <AdminShell
      title="Products"
      action={
        <Link
          to="/admin/add-product"
          className="inline-flex items-center gap-2 rounded-full bg-gold-grad text-charcoal text-sm font-medium px-5 py-2.5 sm:hidden"
        >
          <Plus size={14} /> Add
        </Link>
      }
    >
      {items === null ? (
        <div className="text-ivory/60">Loading…</div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-ivory/10 p-12 text-center">
          <p className="text-ivory/70">No products yet.</p>
          <Link
            to="/admin/add-product"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-grad text-charcoal font-medium px-6 py-2.5"
          >
            <Plus size={14} /> Add your first product
          </Link>
        </div>
      ) : (
        <>
          {/* Category Filter */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="input w-auto min-w-[180px]"
            >
              <option value="" className="bg-charcoal text-ivory">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-charcoal text-ivory">
                  {c}
                </option>
              ))}
            </select>
            <span className="text-xs text-ivory/50">
              {filtered!.length} of {items.length} products
            </span>
          </div>
          {filtered!.length === 0 ? (
            <div className="rounded-xl border border-ivory/10 p-8 text-center text-ivory/50">
              No products in this category.
            </div>
          ) : (
          <div className="rounded-xl border border-ivory/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ivory/[0.04] text-ivory/60 uppercase tracking-widest text-xs">
              <tr>
                <th className="text-left p-4">Image</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4 hidden md:table-cell">Category</th>
                <th className="text-left p-4 hidden md:table-cell">Price</th>
                <th className="text-center p-4 hidden sm:table-cell">Featured</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered!.map((p) => (
                <tr key={p.id} className="border-t border-ivory/10 hover:bg-ivory/[0.03]">
                  <td className="p-3">
                    <div className="h-14 w-14 rounded-md overflow-hidden bg-ivory/5 flex items-center justify-center">
                      {p.images?.[0] ? (
                        <img
                          src={optimizeUrl(p.images[0], 120)}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageOff size={18} className="text-ivory/40" />
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4 hidden md:table-cell text-ivory/70">{p.category}</td>
                  <td className="p-4 hidden md:table-cell text-ivory/70">
                    {p.price != null ? `₹ ${p.price.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="p-4 hidden sm:table-cell text-center">
                    <button
                      onClick={() => onToggleFeatured(p)}
                      title={p.isFeatured ? "Remove from featured" : "Add to featured"}
                      className={`p-2 rounded-md transition ${
                        p.isFeatured
                          ? "text-accent hover:bg-accent/10"
                          : "text-ivory/30 hover:text-ivory/60 hover:bg-ivory/10"
                      }`}
                    >
                      <Star size={16} fill={p.isFeatured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate({ to: "/admin/add-product", search: { id: p.id } })
                        }
                        className="p-2 rounded-md hover:bg-ivory/10 text-ivory/80"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="p-2 rounded-md hover:bg-destructive/20 text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        </>
      )}
    </AdminShell>
  );
}
