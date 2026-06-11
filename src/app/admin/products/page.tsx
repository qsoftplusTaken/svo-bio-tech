"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/lib/firebase/products";
import { Product } from "@/types";
import { Plus, Search, Edit2, Trash2, MoreVertical } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Products</h1>
          <p className="text-gray-500">Manage your catalog, pricing, and inventory.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-xl transition flex items-center gap-2">
          <Plus size={20} /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products by name, SKU..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-primary-500">
              <option>All Categories</option>
              <option>Fertilizers</option>
              <option>Organic</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Product</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Price</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    No products found in Firestore. Add your first product.
                  </td>
                </tr>
              ) : (
                products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex-shrink-0"></div>
                      <div>
                        <p className="font-bold text-sm text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{product.sku}</td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">₹{product.price}</td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stockQuantity > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {product.isVisible ? (
                        <span className="text-green-600 font-medium">Published</span>
                      ) : (
                        <span className="text-gray-400 font-medium">Draft</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-primary-600 transition bg-white rounded-lg hover:bg-primary-50"><Edit2 size={16} /></button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition bg-white rounded-lg hover:bg-red-50"><Trash2 size={16} /></button>
                        <button className="p-2 text-gray-400 hover:text-gray-900 transition"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
