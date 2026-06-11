"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import { fetchPincodeDetails } from "@/lib/api/pincode";
import { Address } from "@/types";
import { CheckCircle2, ChevronRight, MapPin, Truck, CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotals, clearCart } = useCartStore();
  const { user, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  // New Address Form State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "", phone: "", pincode: "", street: "", city: "", state: ""
  });
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      toast.error("Please login to proceed to checkout");
      router.push("/login?redirect=/checkout");
    }
  }, [user, authLoading, mounted, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, mounted, router]);

  if (!mounted || authLoading || !user || items.length === 0) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>;
  }

  const { subtotal, discount, delivery, total } = getTotals();

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value;
    setNewAddress(prev => ({ ...prev, pincode: pin }));
    
    if (pin.length === 6) {
      setIsFetchingPincode(true);
      const details = await fetchPincodeDetails(pin);
      if (details) {
        setNewAddress(prev => ({ ...prev, city: details.city, state: details.state }));
        toast.success("City and State auto-filled!");
      } else {
        toast.error("Invalid pincode or details not found.");
      }
      setIsFetchingPincode(false);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const address: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: true
    };
    setSelectedAddress(address);
    setIsAddingAddress(false);
    toast.success("Address saved successfully");
  };

  const proceedToReview = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    setCurrentStep(2);
  };

  const proceedToPayment = () => {
    setCurrentStep(3);
  };

  const initiatePayment = () => {
    toast.success("Payment initiated! (Razorpay integration in Phase 5)");
    // Mock successful payment
    setTimeout(() => {
      clearCart();
      router.push("/orders/success"); // We'll create this later, for now it might 404
      toast.success("Order Placed Successfully!");
    }, 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        
        {/* Wizard Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex items-center justify-between relative">
          <div className="absolute top-1/2 left-[10%] right-[10%] h-1 bg-gray-100 -z-10 transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-[10%] h-1 bg-primary-600 -z-10 transform -translate-y-1/2 transition-all duration-500" style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '40%' : '80%' }}></div>
          
          {[
            { step: 1, label: "Address", icon: MapPin },
            { step: 2, label: "Review", icon: Truck },
            { step: 3, label: "Payment", icon: CreditCard }
          ].map((item) => {
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            return (
              <div key={item.step} className="flex flex-col items-center bg-white px-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-colors ${
                  isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 
                  isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {isCompleted ? <CheckCircle2 size={24} /> : <item.icon size={24} />}
                </div>
                <span className={`text-sm font-bold ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="lg:w-2/3">
            
            {/* STEP 1: ADDRESS */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="text-primary-600" /> Delivery Address
                </h2>

                {selectedAddress && !isAddingAddress ? (
                  <div className="border-2 border-primary-500 bg-primary-50 rounded-xl p-5 mb-6 relative">
                    <div className="absolute top-4 right-4 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">Selected</div>
                    <h3 className="font-bold text-lg text-gray-900">{selectedAddress.fullName}</h3>
                    <p className="text-gray-600 mt-1">{selectedAddress.street}, {selectedAddress.city}</p>
                    <p className="text-gray-600">{selectedAddress.state} - {selectedAddress.pincode}</p>
                    <p className="text-gray-600 mt-2 font-medium flex items-center gap-2">
                      <span>Phone:</span> {selectedAddress.phone}
                    </p>
                    <button 
                      onClick={() => setIsAddingAddress(true)}
                      className="mt-4 text-primary-600 font-bold text-sm hover:underline"
                    >
                      Change Address
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input required type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <input required type="tel" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode (Auto-fills City & State)</label>
                      <div className="relative">
                        <input required type="text" maxLength={6} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" value={newAddress.pincode} onChange={handlePincodeChange} />
                        {isFetchingPincode && <div className="absolute right-3 top-3 animate-spin h-5 w-5 border-2 border-primary-600 border-t-transparent rounded-full"></div>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address / Village</label>
                      <textarea required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" rows={2} value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})}></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City / District</label>
                        <input required type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-gray-50" value={newAddress.city} readOnly />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input required type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-gray-50" value={newAddress.state} readOnly />
                      </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                      {selectedAddress && (
                        <button type="button" onClick={() => setIsAddingAddress(false)} className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition">
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition">
                        Deliver to this Address
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={proceedToReview}
                    disabled={!selectedAddress}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition shadow-md flex items-center gap-2"
                  >
                    Continue to Order Review <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: REVIEW */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Truck className="text-primary-600" /> Order Review
                </h2>

                <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="p-4 border-b border-gray-100 last:border-b-0 flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg relative flex-shrink-0 border border-gray-200">
                        <Image src={item.product.images[0] || "/placeholder.png"} alt={item.product.name} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.product.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} × ₹{item.product.price}</p>
                      </div>
                      <div className="font-bold text-gray-900 text-right">
                        ₹{item.product.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 rounded-xl p-4 mb-8 flex gap-3">
                  <ShieldCheck className="text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-800">Your items are ready to be shipped. Delivery will take 3-5 business days.</p>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <button onClick={() => setCurrentStep(1)} className="text-gray-500 font-bold hover:text-gray-900 transition">
                    Back to Address
                  </button>
                  <button 
                    onClick={proceedToPayment}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-md flex items-center gap-2"
                  >
                    Proceed to Payment <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="text-primary-600" /> Payment
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center mb-8">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Secure Checkout via Razorpay</h3>
                  <p className="text-blue-700 text-sm mb-4">Complete your payment securely. You can pay via UPI, Credit/Debit Cards, or Netbanking.</p>
                  <p className="text-xs text-blue-500 uppercase font-bold tracking-widest">Phase 5 Integration</p>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <button onClick={() => setCurrentStep(2)} className="text-gray-500 font-bold hover:text-gray-900 transition">
                    Back to Review
                  </button>
                  <button 
                    onClick={initiatePayment}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-xl transition shadow-lg shadow-green-500/30 flex items-center gap-2 text-lg"
                  >
                    Pay ₹{total.toFixed(2)}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 text-sm mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({items.length})</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  {delivery === 0 ? <span className="text-green-600">Free</span> : <span>₹{delivery.toFixed(2)}</span>}
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">₹{total.toFixed(2)}</span>
              </div>

              {currentStep > 1 && selectedAddress && (
                <div className="bg-gray-50 rounded-xl p-4 mt-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><MapPin size={12}/> Delivery To</p>
                  <p className="text-sm font-bold text-gray-900">{selectedAddress.fullName}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
