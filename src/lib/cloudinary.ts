const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export async function uploadToCloudinary(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.",
    );
  }
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }
  const data = (await res.json()) as { secure_url: string; public_id: string };
  // Apply auto-format & auto-quality via URL transformation
  return data.secure_url.replace("/upload/", "/upload/f_auto,q_auto/");
}

export function optimizeUrl(url: string, w?: number) {
  if (!url.includes("/upload/")) return url;
  const t = ["f_auto", "q_auto", w ? `w_${w}` : null].filter(Boolean).join(",");
  return url.replace("/upload/", `/upload/${t}/`);
}
