import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ImagePlus,
  Loader2,
  Trash2,
  X,
  Tags,
} from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import {
  listOffers,
  createOffer,
  deleteOffer,
  type OfferImage,
} from "@/lib/offers";
import {
  isCloudinaryConfigured,
  optimizeUrl,
  uploadToCloudinary,
} from "@/lib/cloudinary";

export const Route = createFileRoute("/admin/offers")({
  component: AdminOffers,
});

function AdminOffers() {
  const [offers, setOffers] = useState<OfferImage[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");

  const reload = () => {
    listOffers()
      .then(setOffers)
      .catch((e) => {
        toast.error(e.message);
        setOffers([]);
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
        await createOffer({
          url,
          caption: caption.trim() || "",
        });
        count++;
      }
      toast.success(`${count} offer(s) uploaded`);
      setCaption("");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (offer: OfferImage) => {
    if (!confirm("Delete this offer?")) return;
    try {
      await deleteOffer(offer.id);
      toast.success("Offer deleted");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <AdminShell title="Manage Offers">
      {/* Upload Section */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-soft mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <ImagePlus size={18} className="text-accent" /> Add New Offers
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Offer Title / Details (Optional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g., Diwali 50% Off Special"
              className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
              disabled={uploading}
            />
          </div>
          <div className="relative shrink-0">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => onUpload(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={uploading}
              title="Select images to upload"
            />
            <button
              disabled={uploading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <ImagePlus size={16} /> Select & Upload
                </>
              )}
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Tip: You can select multiple images at once. Set the title first, then select images.
        </p>
      </div>

      {/* Offers Grid */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
          <Tags size={18} className="text-accent" /> Active Offers
        </h2>
        <div className="text-sm text-muted-foreground">
          {offers ? `${offers.length} offer(s)` : "Loading..."}
        </div>
      </div>

      {!offers ? (
        <div className="flex h-64 items-center justify-center bg-card rounded-lg border border-border">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg border border-border text-muted-foreground">
          <Tags size={48} className="mb-4 opacity-20" />
          <p>No active offers found</p>
          <p className="text-sm mt-1">Upload images above to create offers</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden shadow-card border border-border bg-muted"
            >
              <img
                src={optimizeUrl(offer.url, 400)}
                alt={offer.caption || "Offer image"}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => onDelete(offer)}
                    className="p-2 rounded-full bg-destructive/90 text-destructive-foreground hover:bg-destructive transition shadow-sm"
                    title="Delete offer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {offer.caption && (
                  <div>
                    <p className="text-sm text-white font-medium line-clamp-3 bg-black/40 p-2 rounded backdrop-blur-sm">
                      {offer.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
