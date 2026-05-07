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
  limit as fbLimit,
} from "firebase/firestore";
import { getFirebase, isFirebaseConfigured } from "./firebase";

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  createdAt?: number;
}

const COL = "testimonials";

export const DEFAULT_TESTIMONIALS: Omit<Testimonial, "id">[] = [
  { name: "NETHAJI", content: "Good Shop massive collectionsAttractive price I will give 5 out of 5 rating", rating: 5 },
  { name: "SADIQ PASHA", content: "Good quality, affordable price, nice co operation with staff", rating: 5 },
  { name: "V.Balasubiramaniyan Subiramani", content: "They provide best service and quality", rating: 5 },
];

export async function listTestimonials(): Promise<Testimonial[]> {
  if (!isFirebaseConfigured) return [];
  const { db } = getFirebase();
  if (!db) return [];
  const q = query(collection(db, COL), orderBy("createdAt", "desc"), fbLimit(10));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Testimonial, "id">),
  }));
}

export async function createTestimonial(data: Omit<Testimonial, "id" | "createdAt">) {
  const { db } = getFirebase();
  if (!db) throw new Error("Firebase not configured");
  return addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateTestimonial(id: string, data: Partial<Omit<Testimonial, "id">>) {
  const { db } = getFirebase();
  if (!db) throw new Error("Firebase not configured");
  return updateDoc(doc(db, COL, id), data);
}

export async function deleteTestimonial(id: string) {
  const { db } = getFirebase();
  if (!db) throw new Error("Firebase not configured");
  return deleteDoc(doc(db, COL, id));
}
