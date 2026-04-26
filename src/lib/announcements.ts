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

export interface Announcement {
  id: string;
  message: string;
  isActive: boolean;
  link?: string;
  createdAt?: number;
}

const COL = "announcements";

/**
 * Fetch the latest active announcement (one-time read).
 * Safe for SSR — returns null on server or when no data.
 */
export async function getActiveAnnouncement(): Promise<Announcement | null> {
  if (typeof window === "undefined") return null;
  if (!isFirebaseConfigured) return null;
  const { db } = getFirebase();
  if (!db) return null;

  try {
    const q = query(
      collection(db, COL),
      orderBy("createdAt", "desc"),
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    // Filter for active announcements in JS to avoid composite index requirement
    const active = snap.docs.find(
      (d) => (d.data() as Omit<Announcement, "id">).isActive === true,
    );
    if (!active) return null;
    return { id: active.id, ...(active.data() as Omit<Announcement, "id">) };
  } catch {
    return null;
  }
}

/** List all announcements (for admin panel). */
export async function listAnnouncements(): Promise<Announcement[]> {
  if (!isFirebaseConfigured) return [];
  const { db } = getFirebase();
  if (!db) return [];
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Announcement, "id">),
  }));
}

/** Create a new announcement. */
export async function createAnnouncement(
  data: Omit<Announcement, "id" | "createdAt">,
) {
  const { db } = getFirebase();
  if (!db) throw new Error("Firebase not configured");
  return addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/** Update an existing announcement (toggle, edit, etc.). */
export async function updateAnnouncement(
  id: string,
  data: Partial<Omit<Announcement, "id">>,
) {
  const { db } = getFirebase();
  if (!db) throw new Error("Firebase not configured");
  return updateDoc(doc(db, COL, id), data);
}

/** Delete an announcement. */
export async function deleteAnnouncement(id: string) {
  const { db } = getFirebase();
  if (!db) throw new Error("Firebase not configured");
  return deleteDoc(doc(db, COL, id));
}
