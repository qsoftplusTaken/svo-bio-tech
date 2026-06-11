"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen"></div>;

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleRemove = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success(`${productName} removed from wishlist`);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-primary-600 fill-primary-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-bold text-sm ml-2">
            {items.length} Items
          </span>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 bg-red-50 text-red-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Save your favorite products here to easily find them later. Start exploring our agricultural inputs.
            </p>
            <Link href="/products" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-10 rounded-xl transition inline-block">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all">
                <div className="relative h-48 w-full bg-gray-100 p-4 flex items-center justify-center">
                  <Image src={product.images[0] || "/placeholder.png"} alt={product.name} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                  <button 
                    onClick={() => handleRemove(product.id, product.name)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-50 text-gray-400 hover:text-red-500 transition z-10"
                  >
                    <Trash2 size={18} />
                  </button>
                  {product.stockQuantity === 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                      Out of Stock
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">{product.category}</p>
                  <Link href={`/products/${product.id}`} className="font-bold text-gray-900 text-lg line-clamp-1 mb-2 hover:text-primary-600 transition">
                    {product.name}
                  </Link>
                  <p className="text-2xl font-black text-gray-900 mb-4 mt-auto">₹{product.price}</p>
                  
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stockQuantity === 0}
                    className="w-full bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white disabled:bg-gray-100 disabled:text-gray-400 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
