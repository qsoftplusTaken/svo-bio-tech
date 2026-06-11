"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Package, Truck, CheckCircle2 } from "lucide-react";

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
        // Sort manually since we might not have a composite index set up yet
        fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div></div>;

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <Package size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
        <p className="text-gray-500 mb-6">You haven't placed any orders with us. Start exploring our premium agricultural inputs.</p>
        <Link href="/products" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition inline-block">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Order Header */}
          <div className="bg-gray-50 border-b border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Order Placed</p>
                <p className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total</p>
                <p className="text-sm font-bold text-gray-900">₹{order.pricing?.total?.toFixed(2)}</p>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Order #</p>
              <p className="text-sm text-gray-900 font-mono">{order.id}</p>
            </div>
          </div>

          {/* Order Status */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              {order.orderStatus === "Delivered" ? (
                <CheckCircle2 className="text-green-500" size={24} />
              ) : order.orderStatus === "Shipped" ? (
                <Truck className="text-blue-500" size={24} />
              ) : (
                <Package className="text-orange-500" size={24} />
              )}
              <h3 className="text-lg font-bold text-gray-900">
                {order.orderStatus === "Delivered" ? "Delivered" : order.orderStatus === "Shipped" ? "On the way" : "Processing"}
              </h3>
            </div>

            {/* Items */}
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl relative flex-shrink-0 border border-gray-200">
                    <Image src={item.product.images[0] || "/placeholder.png"} alt={item.product.name} fill className="object-contain p-2" />
                  </div>
                  <div>
                    <Link href={`/products/${item.product.id}`} className="font-bold text-gray-900 hover:text-primary-600 transition line-clamp-1">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{item.product.weight} • Qty: {item.quantity}</p>
                    <button className="text-primary-600 text-sm font-bold mt-2 hover:underline">Write a Review</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
