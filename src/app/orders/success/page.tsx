"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "Unknown";

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">Thank you for your purchase. Your order has been placed and is currently being processed.</p>
        
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8">
          <p className="text-sm text-gray-500 mb-1">Order ID</p>
          <p className="font-bold text-gray-900">{orderId}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            href="/profile/orders" 
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition"
          >
            Track My Order
          </Link>
          <Link 
            href="/products" 
            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-4 rounded-xl transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
