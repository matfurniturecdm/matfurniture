import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebase, isFirebaseConfigured } from "./firebase";

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  isFeatured?: boolean;
  createdAt?: number;
}

const COL = "gallery";

/** List all gallery images (for gallery page). */
export async function listGalleryImages(): Promise<GalleryImage[]> {
  if (!isFirebaseConfigured) return [];
  const { db } = getFirebase();
  if (!db) return [];
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<GalleryImage, "id">),
  }));
}

/** List featured gallery images (for homepage strip). */
export async function listFeaturedGallery(n = 6): Promise<GalleryImage[]> {
  if (typeof window === "undefined") return [];
  if (!isFirebaseConfigured) return [];
  const { db } = getFirebase();
  if (!db) return [];
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const all = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<GalleryImage, "id">),
  }));
  const featured = all.filter((g) => g.isFeatured);
  return featured.length > 0 ? featured.slice(0, n) : all.slice(0, n);
}

/** Add a new gallery image. */
export async function createGalleryImage(
  data: Omit<GalleryImage, "id" | "createdAt">,
) {
  const { db } = getFirebase();
  if (!db) throw new Error("Firebase not configured");
  return addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/** Update a gallery image (toggle featured, edit caption). */
export async function updateGalleryImage(
  id: string,
  data: Partial<Omit<GalleryImage, "id">>,
) {
  const { db } = getFirebase();
  if (!db) throw new Error("Firebase not configured");
  return updateDoc(doc(db, COL, id), data);
}

/** Delete a gallery image. */
export async function deleteGalleryImage(id: string) {
  const { db } = getFirebase();
  if (!db) throw new Error("Firebase not configured");
  return deleteDoc(doc(db, COL, id));
}
