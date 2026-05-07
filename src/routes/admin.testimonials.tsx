import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Star, Pencil, X, Check } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type Testimonial,
} from "@/lib/testimonials";

export const Route = createFileRoute("/admin/testimonials")({
  component: TestimonialsAdmin,
});

function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[] | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);

  const reload = () => {
    listTestimonials()
      .then(setItems)
      .catch((e) => {
        toast.error(e.message);
        setItems([]);
      });
  };

  useEffect(reload, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) {
      toast.error("Name and content are required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateTestimonial(editing.id, { name, content, rating });
        toast.success("Testimonial updated");
      } else {
        await createTestimonial({ name, content, rating });
        toast.success("Testimonial added");
      }
      resetForm();
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial deleted");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const resetForm = () => {
    setEditing(null);
    setIsAdding(false);
    setName("");
    setContent("");
    setRating(5);
  };

  const startEdit = (t: Testimonial) => {
    setEditing(t);
    setIsAdding(true);
    setName(t.name);
    setContent(t.content);
    setRating(t.rating);
  };

  return (
    <AdminShell
      title="Testimonials"
      action={
        !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gold-grad text-charcoal text-sm font-medium px-5 py-2.5"
          >
            <Plus size={14} /> Add Testimonial
          </button>
        )
      }
    >
      {isAdding && (
        <div className="mb-10 rounded-xl border border-ivory/10 bg-ivory/[0.02] p-6">
          <h2 className="text-xl font-display mb-6">
            {editing ? "Edit Testimonial" : "Add New Testimonial"}
          </h2>
          <form onSubmit={onSave} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-ivory/70">Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input mt-2"
                  placeholder="Customer Name"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-ivory/70">Rating</label>
                <div className="flex items-center gap-2 mt-2 h-[46px]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`p-1 transition ${rating >= s ? "text-accent" : "text-ivory/20"}`}
                    >
                      <Star size={20} fill={rating >= s ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-ivory/70">Content</label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input mt-2 resize-none"
                placeholder="What did they say?"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-gold-grad text-charcoal text-sm font-medium px-6 py-2.5 disabled:opacity-50"
              >
                {saving ? "Saving…" : editing ? <><Check size={14} /> Update</> : <><Plus size={14} /> Save</>}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-full border border-ivory/20 text-ivory/80 text-sm font-medium px-6 py-2.5 hover:bg-ivory/5"
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {items === null ? (
        <div className="text-ivory/60 text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-ivory/10 p-12 text-center text-ivory/50">
          No testimonials yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((t) => (
            <div
              key={t.id}
              className="group flex items-start justify-between gap-6 rounded-xl border border-ivory/10 bg-ivory/[0.02] p-6 hover:bg-ivory/[0.04] transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display text-lg">{t.name}</h3>
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < t.rating ? "currentColor" : "none"}
                        className={i < t.rating ? "" : "text-ivory/20"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-ivory/70 italic text-sm leading-relaxed">"{t.content}"</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => startEdit(t)}
                  className="p-2 rounded-md hover:bg-ivory/10 text-ivory/80"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="p-2 rounded-md hover:bg-destructive/20 text-destructive"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
