"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/firebase/products";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { Filter, LayoutGrid, List, SlidersHorizontal, ChevronDown, X, Leaf } from "lucide-react";

// Mock Data for UI demonstration before Firebase is populated
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "SPR Premium NPK 19:19:19 Water Soluble Fertilizer",
    slug: "spr-premium-npk-19-19-19",
    shortDescription: "100% water-soluble fertilizer for all crops, promoting balanced growth.",
    description: "Full description here...",
    category: "Fertilizers",
    brand: "SPR Biotech",
    images: ["https://images.unsplash.com/photo-1628543105315-977ba2e0964c?w=500&q=80"],
    price: 450,
    mrp: 600,
    discountPercent: 25,
    gstRate: 5,
    sku: "SPR-NPK-191919-1KG",
    stockQuantity: 50,
    weight: "1 kg",
    formType: "Powder",
    rating: { average: 4.8, count: 124 },
    specifications: {},
    usageGuide: { dosage: "5g/liter", method: "Foliar spray", precautions: "Avoid direct sunlight" },
    tags: ["npk", "water soluble"],
    isFeatured: true,
    isVisible: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "SPR Organic Neem Khali (Neem Cake)",
    slug: "spr-organic-neem-khali",
    shortDescription: "Natural pest repellent and soil conditioner rich in NPK.",
    description: "Full description here...",
    category: "Organic",
    brand: "SPR Biotech",
    images: ["https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c8c?w=500&q=80"],
    price: 180,
    mrp: 220,
    discountPercent: 18,
    gstRate: 5,
    sku: "SPR-NEEM-1KG",
    stockQuantity: 120,
    weight: "1 kg",
    formType: "Granular",
    rating: { average: 4.5, count: 89 },
    specifications: {},
    usageGuide: { dosage: "50g/plant", method: "Soil application", precautions: "Mix well with soil" },
    tags: ["organic", "neem"],
    isFeatured: false,
    isVisible: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Seaweed Liquid Extract - Plant Growth Promoter",
    slug: "seaweed-liquid-extract",
    shortDescription: "Bio-stimulant for better root development and stress tolerance.",
    description: "Full description here...",
    category: "Bio-Stimulants",
    brand: "SPR Biotech",
    images: ["https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500&q=80"],
    price: 350,
    mrp: 400,
    discountPercent: 12,
    gstRate: 18,
    sku: "SPR-SEAWEED-500ML",
    stockQuantity: 5,
    weight: "500 ml",
    formType: "Liquid",
    rating: { average: 4.9, count: 210 },
    specifications: {},
    usageGuide: { dosage: "2ml/liter", method: "Foliar spray / Drip", precautions: "Shake well before use" },
    tags: ["seaweed", "growth"],
    isFeatured: true,
    isVisible: true,
    createdAt: new Date().toISOString()
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const fetched = await getProducts();
      // Use mock data if Firestore is empty for demonstration purposes
      if (fetched.length === 0) {
        setProducts(MOCK_PRODUCTS);
      } else {
        setProducts(fetched);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Page Header */}
      <div className="bg-primary-900 text-white py-12 px-4 mb-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-sm text-primary-200 mb-4 flex gap-2">
            <span>Home</span> <span>/</span> <span className="text-white font-medium">Products</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Agricultural Inputs</h1>
          <p className="text-primary-100 max-w-2xl">
            Browse our comprehensive catalog of premium fertilizers, organic manure, and bio-stimulants designed for Indian agriculture.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <button 
          className="md:hidden flex items-center justify-center gap-2 bg-white border border-gray-200 p-3 rounded-xl font-medium shadow-sm"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <Filter size={20} />
          Filters & Sorting
        </button>

        {/* Sidebar Filters */}
        <aside className={`
          ${isMobileFiltersOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'} 
          md:block md:w-1/4 md:sticky md:top-24 md:h-[calc(100vh-100px)] md:overflow-y-auto no-scrollbar
        `}>
          <div className="flex items-center justify-between md:hidden mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
            <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                Categories <ChevronDown size={16} />
              </h3>
              <div className="space-y-3">
                {['Fertilizers', 'Organic', 'Bio-Stimulants', 'Pesticides', 'Seeds'].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center group-hover:border-primary-500 transition-colors">
                      {/* Checkbox custom style can go here */}
                    </div>
                    <span className="text-gray-700 group-hover:text-primary-600 transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                Price Range <ChevronDown size={16} />
              </h3>
              <div className="space-y-4">
                <input type="range" className="w-full accent-primary-600" min="0" max="5000" />
                <div className="flex items-center gap-4">
                  <input type="number" placeholder="Min" className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none focus:border-primary-500" />
                  <span className="text-gray-400">-</span>
                  <input type="number" placeholder="Max" className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none focus:border-primary-500" />
                </div>
              </div>
            </div>

            {/* Form Type */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                Form Type <ChevronDown size={16} />
              </h3>
              <div className="space-y-3">
                {['Granular', 'Liquid', 'Powder'].map((form) => (
                  <label key={form} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-gray-700">{form}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full bg-primary-100 text-primary-700 font-bold py-3 rounded-xl hover:bg-primary-200 transition-colors">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="md:w-3/4 flex flex-col">
          {/* Top Bar (Results count, Sorting, View toggles) */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <p className="text-gray-600 font-medium">
              Showing <span className="text-gray-900 font-bold">{products.length}</span> Results
            </p>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-auto">
                <SlidersHorizontal size={18} className="text-gray-400" />
                <select className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 w-full cursor-pointer">
                  <option>Best Selling</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                  <option>Highest Rated</option>
                </select>
              </div>
              
              <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "list" ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-primary-50 text-primary-700 border border-primary-100 text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-2">
              In Stock <X size={14} className="cursor-pointer hover:text-primary-900" />
            </span>
            <button className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-2 ml-2 font-medium">
              Clear All
            </button>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white h-[400px] rounded-2xl animate-pulse flex flex-col p-4 border border-gray-100">
                  <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                  <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-full rounded mb-1"></div>
                  <div className="bg-gray-200 h-4 w-5/6 rounded mb-4"></div>
                  <div className="mt-auto flex justify-between">
                    <div className="bg-gray-200 h-8 w-24 rounded"></div>
                    <div className="bg-gray-200 h-10 w-10 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Leaf size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">We couldn't find any products matching your current filters. Try adjusting them or clearing all filters.</p>
              <button className="mt-6 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
