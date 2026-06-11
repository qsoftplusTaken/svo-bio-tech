"use client";

import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight } from "lucide-react";

export default function AdminDashboardPage() {
  const metrics = [
    { label: "Total Revenue", value: "₹4,25,000", increase: "+12.5%", icon: DollarSign, color: "bg-green-100 text-green-600" },
    { label: "Total Orders", value: "342", increase: "+8.2%", icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
    { label: "Active Customers", value: "1,204", increase: "+18.1%", icon: Users, color: "bg-orange-100 text-orange-600" },
    { label: "Conversion Rate", value: "3.2%", increase: "+1.2%", icon: TrendingUp, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 shadow-sm">
          Last 30 Days
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.color}`}>
                <metric.icon size={24} />
              </div>
              <span className="flex items-center text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                <ArrowUpRight size={16} className="mr-1" />
                {metric.increase}
              </span>
            </div>
            <h3 className="text-gray-500 font-medium mb-1">{metric.label}</h3>
            <p className="text-3xl font-black text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Main Charts Area (Mocked for UI) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend</h2>
          <div className="h-64 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400">
            [Chart Integration Placeholder]
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div>
                  <p className="font-bold text-sm text-gray-900">#ORD-{9000 + i}</p>
                  <p className="text-xs text-gray-500">2 mins ago</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-900">₹{1200 + i * 150}</p>
                  <p className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded inline-block">Paid</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
