import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import {
  CATEGORIES,
  createProduct,
  getProduct,
  updateProduct,
  type Category,
} from "@/lib/products";
import { isCloudinaryConfigured, optimizeUrl, uploadToCloudinary } from "@/lib/cloudinary";

type Search = { id?: string };

export const Route = createFileRoute("/admin/add-product")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  component: AddProduct,
});

function AddProduct() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [price, setPrice] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then((p) => {
        if (!p) {
          toast.error("Product not found");
          navigate({ to: "/admin/dashboard" });
          return;
        }
        setName(p.name);
        setDescription(p.description);
        setCategory(p.category as Category);
        setPrice(p.price != null ? String(p.price) : "");
        setImages(p.images ?? []);
        setIsFeatured(p.isFeatured ?? false);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!isCloudinaryConfigured) {
      toast.error("Cloudinary not configured. Add VITE_CLOUDINARY_* to .env");
      return;
    }
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadToCloudinary(file);
        urls.push(url);
      }
      setImages((prev) => [...prev, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      toast.error("Name and description are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        category,
        price: price ? Number(price) : null,
        images,
        isFeatured,
      };
      if (isEdit && id) {
        await updateProduct(id, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product added");
      }
      navigate({ to: "/admin/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminShell title={isEdit ? "Edit product" : "Add product"}>
        <div className="text-ivory/60">Loading…</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={isEdit ? "Edit product" : "Add new product"}>
      <form onSubmit={onSave} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Field label="Name">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Description">
            <textarea
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input resize-none"
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-charcoal text-ivory">
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Price (₹) — optional">
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input"
              />
            </Field>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest text-ivory/70">Featured on Homepage</span>
            <button
              type="button"
              role="switch"
              aria-checked={isFeatured}
              onClick={() => setIsFeatured(!isFeatured)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ${
                isFeatured ? "bg-accent" : "bg-ivory/20"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  isFeatured ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${isFeatured ? "text-accent" : "text-ivory/50"}`}>
              {isFeatured ? "Yes" : "No"}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <Field label="Images">
            <label className="block rounded-lg border-2 border-dashed border-ivory/20 hover:border-accent transition cursor-pointer p-6 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => onUpload(e.target.files)}
              />
              {uploading ? (
                <span className="inline-flex items-center gap-2 text-ivory/80">
                  <Loader2 size={16} className="animate-spin" /> Uploading…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-ivory/80">
                  <ImagePlus size={16} /> Click to upload
                </span>
              )}
              <p className="mt-2 text-xs text-ivory/50">Multiple images supported</p>
            </label>
          </Field>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {images.map((src, i) => (
                <div key={src} className="relative aspect-square rounded-md overflow-hidden bg-ivory/5">
                  <img
                    src={optimizeUrl(src, 300)}
                    alt={`Upload ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImages((p) => p.filter((u) => u !== src))}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-charcoal/80 text-ivory flex items-center justify-center hover:bg-destructive"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-gold-grad text-charcoal font-medium py-3 hover:opacity-95 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Update product" : "Add product"}
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/dashboard" })}
            className="w-full rounded-full border border-ivory/20 text-ivory/80 py-3 hover:bg-ivory/5"
          >
            Cancel
          </button>
        </div>
      </form>

    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-ivory/70">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
