import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => {
    subtotal: number;
    discount: number;
    gst: number;
    delivery: number;
    total: number;
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);
          
          if (existingItem) {
            // Check stock limit
            const newQuantity = Math.min(existingItem.quantity + quantity, product.stockQuantity);
            return {
              items: state.items.map((item) =>
                item.product.id === product.id ? { ...item, quantity: newQuantity } : item
              ),
            };
          }

          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId) {
              // Ensure we don't exceed stock
              const newQty = Math.min(Math.max(1, quantity), item.product.stockQuantity);
              return { ...item, quantity: newQty };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotals: () => {
        const { items } = get();
        
        let subtotal = 0; // Total MRP
        let sellingPriceTotal = 0; // Total Selling Price
        let gst = 0; // Total GST included in selling price or calculated separately based on requirement
        // Assuming PRD: "Order summary: subtotal, discount, GST (5%/12%/18% as per product), delivery charge, total"
        // Let's assume `product.price` is inclusive of GST.
        // If inclusive, GST = (Price * gstRate) / (100 + gstRate)
        // If exclusive, GST = (Price * gstRate) / 100

        // Let's calculate based on standard e-com (mrp vs price)
        items.forEach((item) => {
          subtotal += item.product.mrp * item.quantity;
          sellingPriceTotal += item.product.price * item.quantity;
          
          // Assuming product.price is EXCLUSIVE of GST for clearer breakdown, or INCLUSIVE
          // Let's treat product.price as base selling price before GST for clear breakdown, 
          // or if it's inclusive, we calculate the GST portion.
          // The PRD says: Pricing: MRP, selling price, savings amount, GST inclusion note. 
          // So selling price is inclusive of GST. Let's calculate the GST portion:
          const itemTotal = item.product.price * item.quantity;
          const itemGstPortion = itemTotal - (itemTotal / (1 + item.product.gstRate / 100));
          gst += itemGstPortion;
        });

        const discount = subtotal - sellingPriceTotal;
        const delivery = sellingPriceTotal > 1000 ? 0 : 50; // Free delivery over 1000 INR
        const total = sellingPriceTotal + delivery; // Selling price already has GST

        return {
          subtotal,
          discount,
          gst, // Just for display
          delivery,
          total
        };
      },
    }),
    {
      name: "spr-cart-storage", // local storage key
    }
  )
);
