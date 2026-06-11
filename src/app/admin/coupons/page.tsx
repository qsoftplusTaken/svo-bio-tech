"use client";

import { useState } from "react";
import { Plus, Tag, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([
    { id: "1", code: "WELCOME10", type: "percentage", value: 10, expiry: "2026-12-31", isActive: true, usageCount: 45 },
    { id: "2", code: "FLAT500", type: "flat", value: 500, expiry: "2026-08-15", isActive: true, usageCount: 12 },
    { id: "3", code: "EXPIRED20", type: "percentage", value: 20, expiry: "2025-12-31", isActive: false, usageCount: 150 },
  ]);

  const [isAdding, setIsAdding] = useState(false);

  const toggleStatus = (id: string) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    toast.success("Coupon status updated");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Coupons & Discounts</h1>
          <p className="text-gray-500">Manage promotional codes and special offers.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-xl transition flex items-center gap-2"
        >
          {isAdding ? "Cancel" : <><Plus size={20} /> Create Coupon</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Tag size={20} className="text-primary-600" /> New Coupon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary-500 uppercase" placeholder="e.g. FARMER20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
              <select className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary-500">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary-500" placeholder="e.g. 10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary-500" />
            </div>
          </div>
          <button className="bg-gray-900 hover:bg-black text-white font-bold py-2 px-6 rounded-lg transition">Save Coupon</button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Code</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-sm text-gray-900 tracking-wider font-mono">{coupon.code}</td>
                  <td className="py-4 px-6 text-sm text-green-600 font-bold">
                    {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{coupon.usageCount} times</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{new Date(coupon.expiry).toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => toggleStatus(coupon.id)}
                      className={`text-xs font-bold px-3 py-1 rounded-full transition ${
                        coupon.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-primary-600 rounded-lg transition"><Edit2 size={16} /></button>
                      <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
