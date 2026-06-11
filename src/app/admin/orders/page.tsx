"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Order } from "@/types";
import {
  Search, Package, CheckCircle2, XCircle, Clock,
  ChevronDown, X, MapPin, Phone, Mail, CreditCard,
  ShoppingBag, Loader2, Eye, Filter
} from "lucide-react";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  Processing: { label: "Processing", bg: "bg-orange-50", text: "text-orange-700", icon: Clock },
  Shipped:    { label: "Shipped",    bg: "bg-blue-50",   text: "text-blue-700",   icon: Package },
  Delivered:  { label: "Delivered",  bg: "bg-green-50",  text: "text-green-700",  icon: CheckCircle2 },
  Cancelled:  { label: "Cancelled",  bg: "bg-red-50",    text: "text-red-700",    icon: XCircle },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    try {
      const snap = await getDocs(query(collection(db, "orders")));
      const data = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Order));
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    try {
      await updateDoc(doc(db, "orders", orderId), { orderStatus: newStatus });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, orderStatus: newStatus as Order["orderStatus"] } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, orderStatus: newStatus as Order["orderStatus"] } : prev);
      }
      toast.success(`Order marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.phone?.includes(search);
    const matchStatus = filterStatus === "All" || o.orderStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    All: orders.length,
    Processing: orders.filter((o) => o.orderStatus === "Processing").length,
    Shipped: orders.filter((o) => o.orderStatus === "Shipped").length,
    Delivered: orders.filter((o) => o.orderStatus === "Delivered").length,
    Cancelled: orders.filter((o) => o.orderStatus === "Cancelled").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Orders</h1>
          <p className="text-gray-500 text-sm">{orders.length} total orders received</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {Object.entries(counts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filterStatus === status
                ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                : "bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-700"
            }`}
          >
            {status}
            <span className={`text-xs font-black px-1.5 py-0.5 rounded-md ${
              filterStatus === status ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by order ID, name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Customer</th>
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Loading orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <ShoppingBag size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">
                      {search || filterStatus !== "All" ? "No orders match your filter." : "No orders yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const cfg = STATUS_CONFIG[order.orderStatus] ?? STATUS_CONFIG.Processing;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <div>
                          <p className="font-mono text-xs font-bold text-gray-700">#{order.id.slice(0, 10).toUpperCase()}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{order.items?.length ?? 0} items</p>
                        </div>
                      </td>
                      <td className="py-4 px-5 hidden md:table-cell">
                        <p className="font-semibold text-sm text-gray-900">{order.shippingAddress?.fullName || "—"}</p>
                        <p className="text-xs text-gray-500">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                      </td>
                      <td className="py-4 px-5 text-sm text-gray-600 hidden sm:table-cell">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-black text-gray-900 text-sm">₹{order.pricing?.total?.toFixed(2)}</p>
                        <p className={`text-xs font-semibold ${order.paymentDetails?.status === "Paid" ? "text-green-600" : "text-orange-500"}`}>
                          {order.paymentDetails?.status ?? "Pending"}
                        </p>
                      </td>
                      <td className="py-4 px-5">
                        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                          <StatusIcon size={12} />
                          {cfg.label}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Order Detail Drawer ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-black text-gray-900">Order Details</h2>
                <p className="text-xs font-mono text-gray-500 mt-0.5">#{selectedOrder.id.toUpperCase()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex-1 space-y-6">

              {/* Status Update */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Order Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["Processing", "Shipped", "Delivered", "Cancelled"] as Order["orderStatus"][]).map((status) => {
                    const cfg = STATUS_CONFIG[status];
                    const StatusIcon = cfg.icon;
                    const isActive = selectedOrder.orderStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => updateStatus(selectedOrder.id, status)}
                        disabled={updatingId === selectedOrder.id}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition border-2 ${
                          isActive
                            ? `${cfg.bg} ${cfg.text} border-current`
                            : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {updatingId === selectedOrder.id && isActive
                          ? <Loader2 size={14} className="animate-spin" />
                          : <StatusIcon size={14} />
                        }
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Customer</p>
                <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 text-primary-700 font-black rounded-full flex items-center justify-center text-sm">
                      {selectedOrder.shippingAddress?.fullName?.charAt(0) ?? "?"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{selectedOrder.shippingAddress?.fullName || "Unknown"}</p>
                      <p className="text-xs text-gray-500">User ID: {selectedOrder.userId?.slice(0, 12)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-1 border-t border-gray-50">
                    <Phone size={14} className="text-gray-400" />
                    {selectedOrder.shippingAddress?.phone || "—"}
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Shipping Address</p>
                <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-3">
                  <MapPin size={16} className="text-primary-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700 leading-relaxed">
                    <p className="font-semibold">{selectedOrder.shippingAddress?.fullName}</p>
                    <p>{selectedOrder.shippingAddress?.street}</p>
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                    <p>PIN: {selectedOrder.shippingAddress?.pincode}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Items ({selectedOrder.items?.length ?? 0})
                </p>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 relative flex-shrink-0 overflow-hidden">
                        {item.product?.images?.[0] ? (
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain p-1" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-[10px]">IMG</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 line-clamp-1">{item.product?.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.product?.price}</p>
                      </div>
                      <p className="font-black text-sm text-gray-900 flex-shrink-0">
                        ₹{(item.quantity * (item.product?.price ?? 0)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Pricing</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.pricing?.subtotal?.toFixed(2)}</span>
                  </div>
                  {(selectedOrder.pricing?.discount ?? 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{selectedOrder.pricing?.discount?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>{selectedOrder.pricing?.delivery === 0 ? "Free" : `₹${selectedOrder.pricing?.delivery?.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-gray-900 text-base pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{selectedOrder.pricing?.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Payment</p>
                <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CreditCard size={14} className="text-primary-500" />
                    <span className="font-semibold">Method:</span>
                    <span>{selectedOrder.paymentDetails?.method || "Razorpay"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Payment Status:</span>
                    <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${
                      selectedOrder.paymentDetails?.status === "Paid"
                        ? "bg-green-50 text-green-700"
                        : "bg-orange-50 text-orange-700"
                    }`}>
                      {selectedOrder.paymentDetails?.status ?? "Pending"}
                    </span>
                  </div>
                  {selectedOrder.paymentDetails?.razorpayOrderId && (
                    <p className="text-xs text-gray-400 font-mono break-all">
                      Razorpay ID: {selectedOrder.paymentDetails.razorpayOrderId}
                    </p>
                  )}
                  {selectedOrder.paymentDetails?.razorpayPaymentId && (
                    <p className="text-xs text-gray-400 font-mono break-all">
                      Payment ID: {selectedOrder.paymentDetails.razorpayPaymentId}
                    </p>
                  )}
                </div>
              </div>

              {/* Ordered At */}
              <p className="text-xs text-gray-400 text-center">
                Placed on {new Date(selectedOrder.createdAt).toLocaleString("en-IN", {
                  day: "2-digit", month: "long", year: "numeric",
                  hour: "2-digit", minute: "2-digit"
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
