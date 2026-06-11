"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductById, getProducts } from "@/lib/firebase/products";
import { Product } from "@/types";
import { Star, ShieldCheck, Truck, ChevronRight, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

// Mock Data fallback
const MOCK_PRODUCT: Product = {
  id: "1",
  name: "SPR Premium NPK 19:19:19 Water Soluble Fertilizer",
  slug: "spr-premium-npk-19-19-19",
  shortDescription: "100% water-soluble fertilizer for all crops, promoting balanced growth.",
  description: "SPR Premium NPK 19:19:19 is a 100% water-soluble fertilizer containing all three major plant nutrients (Nitrogen, Phosphorus, and Potassium) in equal proportion. It is suitable for both foliar spraying and drip irrigation. It ensures rapid nutrient absorption by the plant and improves overall plant health, resulting in higher yield and better quality produce.",
  category: "Fertilizers",
  brand: "SPR Biotech",
  images: [
    "https://images.unsplash.com/photo-1628543105315-977ba2e0964c?w=800&q=80",
    "https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c8c?w=800&q=80",
    "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&q=80"
  ],
  price: 450,
  mrp: 600,
  discountPercent: 25,
  gstRate: 5,
  sku: "SPR-NPK-191919-1KG",
  stockQuantity: 50,
  weight: "1 kg",
  formType: "Powder",
  rating: { average: 4.8, count: 124 },
  specifications: {
    npkRatio: "19:19:19",
    targetCrops: "Vegetables, Fruits, Flowers, Cash Crops",
    solubility: "100% Water Soluble",
    ph: "6.0 - 7.0"
  },
  usageGuide: { 
    dosage: "Foliar Spray: 5-8g per liter of water. Drip Irrigation: 2-3kg per acre.", 
    method: "Mix thoroughly in water before application. Best applied during early morning or late evening.", 
    precautions: "Do not mix with calcium or magnesium-based fertilizers. Store in a cool, dry place." 
  },
  tags: ["npk", "water soluble"],
  isFeatured: true,
  isVisible: true,
  createdAt: new Date().toISOString()
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "usage" | "reviews">("description");

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${quantity} x ${product.name} added to cart`);
    }
  };

  useEffect(() => {
    async function loadData() {
      // Try fetching from Firestore first
      const fetchedProduct = await getProductById(resolvedParams.id);
      
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        // Fallback to mock data if not found (for dev/demo purposes)
        setProduct({ ...MOCK_PRODUCT, id: resolvedParams.id });
      }

      // Fetch related products (mocking it by just grabbing all products for now)
      const allProds = await getProducts();
      setRelatedProducts(allProds.length > 0 ? allProds.slice(0, 4) : [MOCK_PRODUCT, MOCK_PRODUCT, MOCK_PRODUCT]);
      
      setLoading(false);
    }
    loadData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-20 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) return <div className="container mx-auto py-20 px-4 text-center">Product not found.</div>;

  const savings = product.mrp - product.price;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="container mx-auto max-w-7xl flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-primary-600">Products</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium capitalize">{product.category}</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate w-32 sm:w-auto">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="flex flex-col md:flex-row">
            {/* Image Gallery */}
            <div className="md:w-1/2 p-6 md:p-10 md:border-r border-gray-100">
              <div className="relative aspect-square rounded-2xl bg-gray-50 mb-4 overflow-hidden border border-gray-100">
                <Image 
                  src={product.images?.[activeImage] || "/placeholder.png"} 
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {product.images?.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-xl bg-gray-50 border-2 overflow-hidden flex-shrink-0 transition-all ${activeImage === idx ? 'border-primary-500 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-6 md:p-10 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full capitalize">
                  {product.category}
                </span>
                <span className="text-gray-400 text-sm">SKU: {product.sku}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                  <Star className="fill-yellow-400 text-yellow-400" size={16} />
                  <span className="font-bold text-yellow-700">{product.rating.average}</span>
                </div>
                <span className="text-gray-500 text-sm hover:underline cursor-pointer">{product.rating.count} Reviews</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 text-sm">Brand: <span className="font-semibold text-gray-900">{product.brand}</span></span>
              </div>

              {/* Pricing */}
              <div className="mb-8">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                  {product.mrp > product.price && (
                    <>
                      <span className="text-xl text-gray-400 line-through mb-1">₹{product.mrp}</span>
                      <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md mb-1">
                        {product.discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-green-600 font-medium">You save ₹{savings} on this product!</p>
                <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes (GST {product.gstRate}%)</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-24">Form:</span>
                  <span className="text-sm text-gray-900 font-medium bg-gray-100 px-3 py-1 rounded-md">{product.formType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-24">Weight/Vol:</span>
                  <span className="text-sm text-gray-900 font-medium bg-gray-100 px-3 py-1 rounded-md">{product.weight}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto">
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-gray-500 hover:text-primary-600 transition"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="p-3 text-gray-500 hover:text-primary-600 transition"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <span className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
                  </span>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <ShoppingCart size={20} /> Add to Cart
                  </button>
                  <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl flex items-center justify-center transition shadow-md shadow-primary-500/30">
                    Buy Now
                  </button>
                  <button className="p-4 bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                    <Heart size={24} />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheck className="text-primary-600" size={20} />
                  <span>100% Genuine</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="text-primary-600" size={20} />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="flex overflow-x-auto border-b border-gray-200 no-scrollbar">
            {[
              { id: "description", label: "Description" },
              { id: "specifications", label: "Specifications" },
              { id: "usage", label: "Usage Guide" },
              { id: "reviews", label: "Reviews (124)" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? "border-primary-600 text-primary-700 bg-primary-50/50" 
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-6 md:p-10">
            {activeTab === "description" && (
              <div className="prose max-w-none text-gray-600 leading-relaxed">
                <p>{product.description}</p>
                <p className="mt-4">Our premium formulation ensures that your crops get the exact nutrition they need at critical growth stages. With 100% solubility, it leaves no residue and is perfect for modern fertigation systems.</p>
              </div>
            )}
            
            {activeTab === "specifications" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-4 px-6 border-b border-gray-100 font-medium text-gray-700 capitalize w-1/3">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </td>
                        <td className="py-4 px-6 border-b border-gray-100 text-gray-600">
                          {value as string}
                        </td>
                      </tr>
                    ))}
                    <tr className={Object.keys(product.specifications).length % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-4 px-6 border-b border-gray-100 font-medium text-gray-700 w-1/3">Form</td>
                      <td className="py-4 px-6 border-b border-gray-100 text-gray-600">{product.formType}</td>
                    </tr>
                    <tr className={Object.keys(product.specifications).length % 2 !== 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-4 px-6 font-medium text-gray-700 w-1/3">Weight/Volume</td>
                      <td className="py-4 px-6 text-gray-600">{product.weight}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "usage" && (
              <div className="space-y-6">
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-6">
                  <h4 className="font-bold text-primary-900 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div> Dosage
                  </h4>
                  <p className="text-gray-700 ml-4">{product.usageGuide.dosage}</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Application Method
                  </h4>
                  <p className="text-gray-700 ml-4">{product.usageGuide.method}</p>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
                  <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div> Precautions
                  </h4>
                  <p className="text-gray-700 ml-4">{product.usageGuide.precautions}</p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-center py-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h3>
                <p className="text-gray-500 mb-6">Review system will be fully integrated in Phase 7.</p>
                <div className="flex items-center justify-center gap-2 mb-8">
                  <Star className="fill-yellow-400 text-yellow-400" size={32} />
                  <span className="text-4xl font-bold text-gray-900">{product.rating.average}</span>
                  <span className="text-gray-400 ml-2">out of 5 based on {product.rating.count} reviews</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Bought Together</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rp, idx) => (
              <ProductCard key={`${rp.id}-${idx}`} product={rp} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile Sticky Add to Cart (as per PRD) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex gap-3">
        <button className="flex-1 bg-white border border-primary-600 text-primary-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
          <ShoppingCart size={18} /> Cart
        </button>
        <button className="flex-1 bg-primary-600 text-white font-bold py-3 rounded-xl">
          Buy Now
        </button>
      </div>
    </div>
  );
}
