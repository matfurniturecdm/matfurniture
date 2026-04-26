import { isFirebaseConfigured } from "@/lib/firebase";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { AlertTriangle } from "lucide-react";

export function ConfigBanner() {
  // Only show in development — never expose setup warnings to end users
  if (import.meta.env.PROD) return null;
  if (isFirebaseConfigured && isCloudinaryConfigured) return null;
  return (
    <div className="bg-accent/15 border-b border-accent/30 text-foreground/90 text-sm">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-start gap-3">
        <AlertTriangle size={16} className="mt-0.5 text-accent" />
        <div>
          <strong className="font-medium">Setup required:</strong>{" "}
          Add your Firebase &amp; Cloudinary keys to <code className="px-1 rounded bg-background/60">.env</code> to enable the catalog and admin panel.
          {!isFirebaseConfigured && <> Missing Firebase config.</>}
          {!isCloudinaryConfigured && <> Missing Cloudinary config.</>}
        </div>
      </div>
    </div>
  );
}
