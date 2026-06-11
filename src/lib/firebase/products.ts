import { collection, getDocs, doc, getDoc, query, where, orderBy, DocumentData } from "firebase/firestore";
import { db } from "./config";
import { Product } from "@/types";

const COLLECTION_NAME = "products";

export async function getProducts(filters?: any): Promise<Product[]> {
  try {
    let q = query(collection(db, COLLECTION_NAME), where("isVisible", "==", true));

    // We can add logic to dynamically append where() and orderBy() clauses based on filters
    // For now, returning all visible products
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Product;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}
