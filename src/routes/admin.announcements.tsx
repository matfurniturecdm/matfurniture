import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Megaphone,
  Plus,
  Trash2,
  Power,
  PowerOff,
  ExternalLink,
} from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import {
  listAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type Announcement,
} from "@/lib/announcements";

export const Route = createFileRoute("/admin/announcements")({
  component: AnnouncementManager,
});

function AnnouncementManager() {
  const [items, setItems] = useState<Announcement[] | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = () => {
    listAnnouncements()
      .then(setItems)
      .catch((e) => {
        toast.error(e.message);
        setItems([]);
      });
  };

  useEffect(reload, []);

  const resetForm = () => {
    setMessage("");
    setLink("");
    setIsActive(true);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (a: Announcement) => {
    setMessage(a.message);
    setLink(a.link || "");
    setIsActive(a.isActive);
    setEditId(a.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Message is required");
      return;
    }
    setSaving(true);
    try {
      const data = {
        message: message.trim(),
        isActive,
        ...(link.trim() ? { link: link.trim() } : {}),
      };
      if (editId) {
        await updateAnnouncement(editId, data);
        toast.success("Announcement updated");
      } else {
        await createAnnouncement(data);
        toast.success("Announcement created");
      }
      resetForm();
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (a: Announcement) => {
    try {
      await updateAnnouncement(a.id, { isActive: !a.isActive });
      toast.success(a.isActive ? "Announcement disabled" : "Announcement enabled");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDelete = async (a: Announcement) => {
    if (!confirm(`Delete this announcement?\n"${a.message}"`)) return;
    try {
      await deleteAnnouncement(a.id);
      toast.success("Announcement deleted");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <AdminShell
      title="Announcements"
      action={
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-gold-grad text-charcoal text-sm font-medium px-5 py-2.5"
        >
          <Plus size={14} /> New
        </button>
      }
    >
      {/* ─── Create / Edit Form ─── */}
      {showForm && (
        <div className="mb-10 rounded-xl border border-ivory/10 bg-ivory/[0.03] p-6 md:p-8">
          <h2 className="font-display text-2xl mb-6">
            {editId ? "Edit Announcement" : "New Announcement"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Message */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-ivory/60 mb-2">
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="🔥 Special Offer: Get up to 20% off on Sofa Collections this week!"
                rows={3}
                className="input resize-none"
                required
              />
            </div>

            {/* Link (optional) */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-ivory/60 mb-2">
                CTA Link (optional)
              </label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/products or https://wa.me/..."
                className="input"
              />
              <p className="mt-1 text-xs text-ivory/40">
                Internal paths start with / (e.g. /products). External links include https://
              </p>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-4">
              <label className="text-xs uppercase tracking-widest text-ivory/60">
                Status
              </label>
              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ${
                  isActive ? "bg-accent" : "bg-ivory/20"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm ${isActive ? "text-accent" : "text-ivory/50"}`}>
                {isActive ? "Active" : "Disabled"}
              </span>
            </div>

            {/* Live Preview */}
            {message.trim() && (
              <div>
                <label className="block text-xs uppercase tracking-widest text-ivory/60 mb-2">
                  Preview
                </label>
                <div className="announcement-glow rounded-2xl px-5 py-3.5 bg-[rgba(255,255,255,0.08)] backdrop-blur-md border border-[color-mix(in_oklab,var(--gold)_40%,transparent)]">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-gold-grad text-charcoal flex items-center justify-center">
                      <Megaphone size={14} />
                    </div>
                    <p className="flex-1 text-sm font-medium text-ivory">
                      {message}
                    </p>
                    {link.trim() && (
                      <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gold-grad px-3 py-1.5 text-xs font-semibold text-charcoal">
                        Explore Now
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-gold-grad text-charcoal font-medium px-6 py-2.5 text-sm disabled:opacity-50"
              >
                {saving ? "Saving…" : editId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-ivory/20 px-6 py-2.5 text-sm text-ivory/70 hover:text-ivory hover:border-ivory/40 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Announcements List ─── */}
      {items === null ? (
        <div className="text-ivory/60">Loading…</div>
      ) : items.length === 0 && !showForm ? (
        <div className="rounded-xl border border-ivory/10 p-12 text-center">
          <Megaphone size={32} className="mx-auto text-ivory/30 mb-4" />
          <p className="text-ivory/70 mb-4">No announcements yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gold-grad text-charcoal font-medium px-6 py-2.5"
          >
            <Plus size={14} /> Create your first announcement
          </button>
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-4">
          {items.map((a) => (
            <div
              key={a.id}
              className={`rounded-xl border p-5 transition ${
                a.isActive
                  ? "border-accent/30 bg-accent/[0.04]"
                  : "border-ivory/10 bg-ivory/[0.02]"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Status indicator */}
                <div
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    a.isActive ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "bg-ivory/30"
                  }`}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ivory leading-snug">{a.message}</p>
                  {a.link && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ivory/50">
                      <ExternalLink size={12} /> {a.link}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1.5">
                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(a)}
                    title={a.isActive ? "Disable" : "Enable"}
                    className={`p-2 rounded-md transition ${
                      a.isActive
                        ? "text-green-400 hover:bg-green-400/10"
                        : "text-ivory/40 hover:bg-ivory/10"
                    }`}
                  >
                    {a.isActive ? <Power size={16} /> : <PowerOff size={16} />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(a)}
                    className="p-2 rounded-md text-ivory/60 hover:text-ivory hover:bg-ivory/10 transition"
                    aria-label="Edit"
                  >
                    <Megaphone size={16} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(a)}
                    className="p-2 rounded-md text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </AdminShell>
  );
}
