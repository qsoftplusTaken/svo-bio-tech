"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Heart, Search, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't render header on admin routes
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black text-primary-900 tracking-tight flex items-center gap-2">
            SPR<span className="text-primary-600">Biotech</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm font-bold text-gray-600 hover:text-primary-600 transition">Products</Link>
            <Link href="/blog" className="text-sm font-bold text-gray-600 hover:text-primary-600 transition">Knowledge Base</Link>
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center relative w-full max-w-sm">
            <input 
              type="text" 
              placeholder="Search for fertilizers, crops..." 
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-full py-2.5 pl-5 pr-10 outline-none focus:border-primary-500 focus:bg-white transition"
              suppressHydrationWarning
            />
            <Search className="absolute right-3 text-gray-400" size={18} />
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/profile" className="text-gray-600 hover:text-primary-600 transition">
              <User size={22} />
            </Link>
            <Link href="/wishlist" className="text-gray-600 hover:text-primary-600 transition">
              <Heart size={22} />
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-primary-600 transition relative">
              <ShoppingCart size={22} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {items.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-6 flex flex-col gap-4 shadow-xl absolute w-full left-0 top-20">
          <div className="relative w-full mb-2">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-full py-3 pl-5 pr-10 outline-none focus:border-primary-500 focus:bg-white transition"
              suppressHydrationWarning
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Link href="/products" className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2" onClick={() => setMobileMenuOpen(false)}>Products</Link>
          <Link href="/blog" className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2" onClick={() => setMobileMenuOpen(false)}>Knowledge Base</Link>
          <Link href="/profile" className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}><User size={20}/> My Profile</Link>
          <Link href="/wishlist" className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}><Heart size={20}/> Wishlist</Link>
          <Link href="/cart" className="text-lg font-bold text-gray-900 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <ShoppingCart size={20}/> Cart ({items.length})
          </Link>
        </div>
      )}
    </header>
  );
}
