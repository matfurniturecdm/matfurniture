import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,

  limit as fbLimit,
} from "firebase/firestore";
import { getFirebase, isFirebaseConfigured } from "./firebase";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number | null;
  images: string[];
  isFeatured?: boolean;
  isSoldOut?: boolean;

  createdAt?: number;
}

export const CATEGORIES = [
  "Wooden Cot",
  "Sofa Collection",
  "Wardrobes",
  "Dining Tables",
  "Dressing Tables",
  "TV Units",
  "Office Furniture",
  "Shoe Racks & Utility",
  "Pooja Units",
  "Mattresses",
  "Teapoys",
] as const;

export type Category = (typeof CATEGORIES)[number];

const COL = "products";

export async function listProducts(): Promise<Product[]> {
  if (!isFirebaseConfigured) return [];
  const { db } = getFirebase();
  if (!db) return [];
  // Add a limit to prevent excessive reads if the catalog grows huge
  const q = query(collection(db, COL), orderBy("createdAt", "desc"), fbLimit(100));

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) }));
}

export async function listFeatured(n = 6): Promise<Product[]> {
  if (!isFirebaseConfigured) return [];
  const { db } = getFirebase();
  if (!db) return [];
  
  // Try fetching specifically featured products first
  const qFeatured = query(
    collection(db, COL), 
    where("isFeatured", "==", true),
    orderBy("createdAt", "desc"),
    fbLimit(n)
  );
  
  try {
    const snap = await getDocs(qFeatured);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) }));
    }
  } catch (e) {
    console.warn("Featured query failed (might need index):", e);
  }

  // Fallback to latest products if none are featured or query fails
  return listProducts().then(all => all.slice(0, n));

}

export async function listRelated(category: string, excludeId: string, n = 3): Promise<Product[]> {
  if (!isFirebaseConfigured) return [];
  const { db } = getFirebase();
  if (!db) return [];
  
  // Filter by category on server side
  const q = query(
    collection(db, COL), 
    where("category", "==", category),
    orderBy("createdAt", "desc"), 
    fbLimit(n + 1)
  );
  
  try {
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) }))
      .filter((p) => p.id !== excludeId)
      .slice(0, n);
  } catch (e) {
    console.warn("Related query failed (might need index):", e);
    // Fallback to just latest
    return listProducts().then(all => 
      all.filter(p => p.id !== excludeId && p.category === category).slice(0, n)
    );
  }

}

export async function getProduct(id: string): Promise<Product | null> {
  if (!isFirebaseConfigured) return null;
  const { db } = getFirebase();
  if (!db) return null;
  const ref = doc(db, COL, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Product, "id">) };
}

export async function createProduct(data: Omit<Product, "id" | "createdAt">) {
  const { db } = getFirebase();
  if (!db) throw new Error("Firebase not configured");
  return addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp() });
}

export async function updateProduct(id: string, data: Partial<Omit<Product, "id">>) {
  const { db } = getFirebase();
  if (!db) throw new Error("Firebase not configured");
  return updateDoc(doc(db, COL, id), data);
}

export async function deleteProduct(id: string) {
  const { db } = getFirebase();
  if (!db) throw new Error("Firebase not configured");
  return deleteDoc(doc(db, COL, id));
}
