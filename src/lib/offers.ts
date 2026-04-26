import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebase, isFirebaseConfigured } from "./firebase";

export interface OfferImage {
  id: string;
  url: string;
  caption?: string;
  createdAt?: number;
}

const COL = "offers";

/** List all offer images. */
export async function listOffers(): Promise<OfferImage[]> {
  if (!isFirebaseConfigured) return [];
  const { db } = getFirebase();
  if (!db) return [];
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<OfferImage, "id">),
  }));
}

/** List featured offers for the homepage. */
export async function listFeaturedOffers(n = 3): Promise<OfferImage[]> {
  if (typeof window === "undefined") return [];
  const all = await listOffers();
  return all.slice(0, n);
}

/** Add a new offer image. */
export async function createOffer(
  data: Omit<OfferImage, "id" | "createdAt">,
) {
  const { db } = getFirebase();
  if (!db) throw new Error("Firebase not configured");
  return addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/** Delete an offer image. */
export async function deleteOffer(id: string) {
  const { db } = getFirebase();
  if (!db) throw new Error("Firebase not configured");
  return deleteDoc(doc(db, COL, id));
}
