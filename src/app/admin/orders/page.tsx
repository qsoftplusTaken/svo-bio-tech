"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Order } from "@/types";
import { Search, Package, Truck, CheckCircle2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const q = query(collection(db, "orders"));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
      // Sort newest first
      fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(fetched);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        orderStatus: newStatus
      });
      setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus as any } : o));
      toast.success("Order status updated");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Orders</h1>
          <p className="text-gray-500">Manage fulfillment and track customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary-500 text-sm"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-primary-500">
              <option>All Statuses</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="py-3 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="py-10 text-center text-gray-500">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-gray-500">No orders found.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-mono text-gray-600">{order.id.slice(0, 8)}...</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-sm text-gray-900">{order.shippingAddress?.fullName || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{order.shippingAddress?.city}</p>
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">₹{order.pricing?.total?.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-sm font-bold border rounded-lg px-3 py-1 outline-none ${
                          order.orderStatus === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                          order.orderStatus === 'Shipped' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                          'bg-orange-50 border-orange-200 text-orange-700'
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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
