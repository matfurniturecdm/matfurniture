import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ImagePlus,
  Loader2,
  Trash2,
  Star,
  X,
  Images,
} from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import {
  listGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  type GalleryImage,
} from "@/lib/gallery";
import {
  isCloudinaryConfigured,
  optimizeUrl,
  uploadToCloudinary,
} from "@/lib/cloudinary";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGallery,
});

function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");

  const reload = () => {
    listGalleryImages()
      .then(setImages)
      .catch((e) => {
        toast.error(e.message);
        setImages([]);
      });
  };

  useEffect(reload, []);

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!isCloudinaryConfigured) {
      toast.error("Cloudinary not configured. Add VITE_CLOUDINARY_* to .env");
      return;
    }
    setUploading(true);
    try {
      let count = 0;
      for (const file of Array.from(files)) {
        const url = await uploadToCloudinary(file);
        await createGalleryImage({
          url,
          caption: caption.trim(),
          isFeatured: false,
        });
        count++;
      }
      toast.success(`${count} image(s) uploaded`);
      setCaption("");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onToggleFeatured = async (img: GalleryImage) => {
    try {
      await updateGalleryImage(img.id, { isFeatured: !img.isFeatured });
      toast.success(
        img.isFeatured ? "Removed from featured" : "Added to featured",
      );
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  const onDelete = async (img: GalleryImage) => {
    if (!confirm("Delete this image?")) return;
    try {
      await deleteGalleryImage(img.id);
      toast.success("Image deleted");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const onUpdateCaption = async (img: GalleryImage, newCaption: string) => {
    try {
      await updateGalleryImage(img.id, { caption: newCaption.trim() });
      toast.success("Caption updated");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  return (
    <AdminShell
      title="Gallery"
      action={
        <label className="inline-flex items-center gap-2 rounded-full bg-gold-grad text-charcoal text-sm font-medium px-5 py-2.5 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => onUpload(e.target.files)}
          />
          {uploading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Uploading…
            </>
          ) : (
            <>
              <ImagePlus size={14} /> Upload
            </>
          )}
        </label>
      }
    >
      {/* Upload Section */}
      <div className="mb-8 rounded-xl border border-ivory/10 bg-ivory/[0.03] p-6">
        <h2 className="font-display text-xl mb-4">Upload Images</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Optional caption for next upload(s)…"
            className="input flex-1"
          />
          <label className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ivory/20 hover:border-accent transition cursor-pointer px-6 py-3 text-sm text-ivory/80 shrink-0">
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => onUpload(e.target.files)}
            />
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <ImagePlus size={16} /> Choose Files
              </>
            )}
          </label>
        </div>
        <p className="mt-2 text-xs text-ivory/40">
          Multiple images supported. Caption applies to all images in this batch.
        </p>
      </div>

      {/* Gallery Grid */}
      {images === null ? (
        <div className="text-ivory/60">Loading…</div>
      ) : images.length === 0 ? (
        <div className="rounded-xl border border-ivory/10 p-12 text-center">
          <Images size={32} className="mx-auto text-ivory/30 mb-4" />
          <p className="text-ivory/70 mb-4">No gallery images yet.</p>
          <p className="text-ivory/50 text-sm">
            Upload your showroom photos above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className={`relative group rounded-xl overflow-hidden border transition ${
                img.isFeatured
                  ? "border-accent/40 shadow-gold"
                  : "border-ivory/10"
              }`}
            >
              <div className="aspect-square">
                <img
                  src={optimizeUrl(img.url, 400)}
                  alt={img.caption || "Gallery"}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                {/* Top actions */}
                <div className="flex justify-between">
                  <button
                    onClick={() => onToggleFeatured(img)}
                    title={
                      img.isFeatured
                        ? "Remove from featured"
                        : "Add to featured"
                    }
                    className={`p-2 rounded-md transition ${
                      img.isFeatured
                        ? "text-accent bg-charcoal/60"
                        : "text-ivory/80 bg-charcoal/60 hover:text-accent"
                    }`}
                  >
                    <Star
                      size={16}
                      fill={img.isFeatured ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={() => onDelete(img)}
                    className="p-2 rounded-md text-destructive bg-charcoal/60 hover:bg-destructive/20 transition"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Bottom: editable caption */}
                <input
                  type="text"
                  defaultValue={img.caption || ""}
                  placeholder="Add caption…"
                  onBlur={(e) => {
                    const val = e.target.value;
                    if (val !== (img.caption || "")) {
                      onUpdateCaption(img, val);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-charcoal/70 rounded-md px-2 py-1.5 text-xs text-ivory placeholder-ivory/40 border-none outline-none focus:ring-1 focus:ring-accent/40"
                />
              </div>

              {/* Featured badge */}
              {img.isFeatured && (
                <div className="absolute top-2 left-2 bg-accent text-charcoal text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Featured
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
