"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProductById, getProducts } from "@/lib/firebase/products";
import { Product } from "@/types";
import {
  Star, ShieldCheck, Truck, ChevronRight, Minus, Plus,
  ShoppingCart, Heart, Share2, Award, CheckCircle2
} from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";

const MOCK_PRODUCT: Product = {
  id: "p1",
  name: "SPR Premium NPK 19:19:19 Water Soluble Fertilizer",
  slug: "spr-premium-npk-19-19-19",
  shortDescription: "100% water-soluble fertilizer for all crops, promoting balanced growth.",
  description: "SPR Premium NPK 19:19:19 is a 100% water-soluble fertilizer containing all three major plant nutrients (Nitrogen, Phosphorus, and Potassium) in equal proportion. Suitable for both foliar spraying and drip irrigation, it ensures rapid nutrient absorption, improves plant health, and delivers higher yield with better quality produce.",
  category: "Fertilizers",
  brand: "SPR Biotech",
  images: [
    "https://images.unsplash.com/photo-1628543105315-977ba2e0964c?w=800&q=80",
    "https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c8c?w=800&q=80",
    "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&q=80",
  ],
  price: 450, mrp: 600, discountPercent: 25, gstRate: 5,
  sku: "SPR-NPK-191919-1KG", stockQuantity: 50, weight: "1 kg", formType: "Powder",
  rating: { average: 4.8, count: 124 },
  specifications: {
    "NPK Ratio": "19:19:19",
    "Solubility": "100% Water Soluble",
    "Target Crops": "Vegetables, Fruits, Flowers, Cash Crops",
    "pH Range": "6.0 – 7.0",
    "Nitrogen (N)": "19%",
    "Phosphorus (P₂O₅)": "19%",
    "Potassium (K₂O)": "19%",
  },
  usageGuide: {
    dosage: "Foliar Spray: 5–8 g/litre. Drip Irrigation: 2–3 kg/acre.",
    method: "Dissolve thoroughly in water before application. Apply during early morning or late evening for best results.",
    precautions: "Do not mix with calcium or magnesium-based fertilizers. Store in a cool, dry place away from moisture.",
  },
  tags: ["npk", "water-soluble", "fertilizer"],
  isFeatured: true, isVisible: true, createdAt: new Date().toISOString(),
};

const MOCK_REVIEWS = [
  { id: "r1", userName: "Rajesh K.", rating: 5, comment: "Excellent product. Yield increased by 35% within two seasons. Highly recommend!", createdAt: "2026-05-10", avatar: "RK" },
  { id: "r2", userName: "Priya Devi", rating: 5, comment: "Dissolves instantly and leaves no residue. Perfect for drip irrigation.", createdAt: "2026-04-22", avatar: "PD" },
  { id: "r3", userName: "Suresh Patel", rating: 4, comment: "Good quality NPK. Delivery was very fast. Will order again.", createdAt: "2026-03-15", avatar: "SP" },
];

type Tab = "description" | "specifications" | "usage" | "reviews";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("description");

  const addToCart = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    async function load() {
      const [fetched, allProds] = await Promise.all([
        getProductById(id),
        getProducts(),
      ]);
      const p = fetched ?? { ...MOCK_PRODUCT, id };
      setProduct(p);
      setRelated(
        allProds.length > 0
          ? allProds.filter((x) => x.id !== id).slice(0, 4)
          : [MOCK_PRODUCT, MOCK_PRODUCT, MOCK_PRODUCT, MOCK_PRODUCT].map((x, i) => ({ ...x, id: `rel-${i}` }))
      );
      setLoading(false);
    }
    load();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${quantity}× ${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    router.push("/checkout");
  };

  const handleWishlist = () => {
    if (!product) return;
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: product?.name, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <div className="bg-white rounded-2xl p-8 animate-pulse">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="md:w-1/2 space-y-4">
                <div className="h-80 bg-gray-100 rounded-2xl" />
                <div className="flex gap-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-20 w-20 bg-gray-100 rounded-xl" />)}
                </div>
              </div>
              <div className="md:w-1/2 space-y-4">
                <div className="h-6 bg-gray-100 rounded w-1/3" />
                <div className="h-8 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-12 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Product not found.</p>
    </div>
  );

  const savings = product.mrp - product.price;

  return (
    <div className="bg-gray-50 min-h-screen pb-24 md:pb-10">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-primary-600">Products</Link>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium">{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-gray-900 font-semibold truncate max-w-[180px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">

        {/* ── Main Product Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">

            {/* Gallery */}
            <div className="md:w-[45%] p-6 md:p-10 md:border-r border-gray-100">
              <div className="relative aspect-square rounded-2xl bg-gray-50 border border-gray-100 mb-4 overflow-hidden">
                <Image
                  src={product.images?.[activeImage] || "https://images.unsplash.com/photo-1628543105315-977ba2e0964c?w=800"}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 768px) 100vw, 45vw"
                  priority
                />
                {product.discountPercent && product.discountPercent > 0 ? (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    {product.discountPercent}% OFF
                  </div>
                ) : null}
              </div>
              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {product.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-xl bg-gray-50 border-2 overflow-hidden flex-shrink-0 transition-all ${
                      activeImage === idx ? "border-primary-500 shadow-md" : "border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="md:w-[55%] p-6 md:p-10 flex flex-col">

              {/* Category + SKU */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-gray-400 text-xs">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating + Brand */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100 flex-wrap">
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg">
                  <Star className="fill-amber-400 text-amber-400" size={15} />
                  <span className="font-black text-amber-700 text-sm">{product.rating.average}</span>
                </div>
                <span className="text-gray-500 text-sm">{product.rating.count} Reviews</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 text-sm">
                  Brand: <span className="font-semibold text-gray-900">{product.brand}</span>
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-4xl font-black text-gray-900">₹{product.price}</span>
                  {product.mrp > product.price && (
                    <>
                      <span className="text-xl text-gray-400 line-through mb-1">₹{product.mrp}</span>
                      <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md mb-1">
                        {product.discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
                {savings > 0 && (
                  <p className="text-sm text-green-600 font-medium">You save ₹{savings}!</p>
                )}
                <p className="text-xs text-gray-400 mt-1">Inclusive of GST ({product.gstRate}%)</p>
              </div>

              {/* Specs pills */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                  {product.formType}
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                  {product.weight}
                </span>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                  product.stockQuantity === 0
                    ? "bg-red-50 text-red-600"
                    : product.stockQuantity < 10
                    ? "bg-orange-50 text-orange-600"
                    : "bg-green-50 text-green-600"
                }`}>
                  {product.stockQuantity === 0
                    ? "Out of Stock"
                    : product.stockQuantity < 10
                    ? `Only ${product.stockQuantity} left`
                    : "In Stock"}
                </span>
              </div>

              {/* Quantity + Actions */}
              <div className="mt-auto space-y-4">
                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Qty:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-black text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      disabled={quantity >= product.stockQuantity}
                      className="px-4 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition disabled:opacity-40"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0}
                    className="flex-1 bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50 disabled:border-gray-200 disabled:text-gray-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stockQuantity === 0}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 text-white font-bold py-4 rounded-xl flex items-center justify-center transition shadow-lg shadow-primary-500/25"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`p-4 rounded-xl transition border ${
                      inWishlist
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500"
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart size={22} className={inWishlist ? "fill-red-500" : ""} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-4 bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100 rounded-xl transition"
                    aria-label="Share"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100 flex-wrap">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <ShieldCheck className="text-primary-600" size={18} />
                  <span>100% Genuine</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Truck className="text-primary-600" size={18} />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Award className="text-primary-600" size={18} />
                  <span>FCO Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="flex overflow-x-auto no-scrollbar border-b border-gray-100">
            {(["description", "specifications", "usage", "reviews"] as Tab[]).map((tab) => {
              const labels: Record<Tab, string> = {
                description: "Description",
                specifications: "Specifications",
                usage: "Usage Guide",
                reviews: `Reviews (${MOCK_REVIEWS.length})`,
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-7 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                    activeTab === tab
                      ? "border-primary-600 text-primary-700 bg-primary-50/50"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          <div className="p-6 md:p-10">

            {activeTab === "description" && (
              <div className="prose max-w-none text-gray-600 leading-relaxed text-sm space-y-4">
                <p>{product.description}</p>
                <p>Our premium formulation ensures your crops receive balanced nutrition at every critical growth stage. With 100% solubility, it leaves no residue and integrates seamlessly into modern fertigation systems.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 not-prose">
                  {[
                    { icon: CheckCircle2, text: "100% Water Soluble" },
                    { icon: CheckCircle2, text: "No Harmful Additives" },
                    { icon: CheckCircle2, text: "FCO Approved Formula" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 bg-primary-50 rounded-xl p-4">
                      <item.icon size={18} className="text-primary-600 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-800">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-3.5 px-5 border-b border-gray-100 font-semibold text-gray-700 w-1/3">{key}</td>
                        <td className="py-3.5 px-5 border-b border-gray-100 text-gray-600">{String(value)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td className="py-3.5 px-5 border-b border-gray-100 font-semibold text-gray-700">Form</td>
                      <td className="py-3.5 px-5 border-b border-gray-100 text-gray-600">{product.formType}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3.5 px-5 font-semibold text-gray-700">Weight / Volume</td>
                      <td className="py-3.5 px-5 text-gray-600">{product.weight}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "usage" && (
              <div className="space-y-5">
                {[
                  { label: "Dosage", content: product.usageGuide.dosage, bg: "bg-primary-50 border-primary-100", dot: "bg-primary-500", text: "text-primary-900" },
                  { label: "Application Method", content: product.usageGuide.method, bg: "bg-blue-50 border-blue-100", dot: "bg-blue-500", text: "text-blue-900" },
                  { label: "Precautions", content: product.usageGuide.precautions, bg: "bg-orange-50 border-orange-100", dot: "bg-orange-400", text: "text-orange-900" },
                ].map((item) => (
                  <div key={item.label} className={`border rounded-xl p-5 ${item.bg}`}>
                    <h4 className={`font-bold mb-2 flex items-center gap-2 text-sm ${item.text}`}>
                      <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                      {item.label}
                    </h4>
                    <p className="text-gray-700 text-sm ml-4 leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {/* Rating summary */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                  <div className="text-center">
                    <p className="text-5xl font-black text-gray-900">{product.rating.average}</p>
                    <div className="flex gap-0.5 justify-center my-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} className={i < Math.round(product.rating.average) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm">{product.rating.count} reviews</p>
                  </div>
                  <div className="flex-1 hidden sm:block">
                    {[5, 4, 3, 2, 1].map((n) => {
                      const pct = n >= 4 ? (n === 5 ? 68 : 22) : n === 3 ? 7 : 2;
                      return (
                        <div key={n} className="flex items-center gap-3 mb-1.5">
                          <span className="text-xs text-gray-500 w-3">{n}</span>
                          <Star size={11} className="fill-amber-400 text-amber-400 flex-shrink-0" />
                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 w-7 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review cards */}
                <div className="space-y-6 mb-8">
                  {MOCK_REVIEWS.map((r) => (
                    <div key={r.id} className="flex gap-4">
                      <div className="w-10 h-10 bg-primary-100 text-primary-700 font-black rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                        {r.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                          <span className="font-bold text-gray-900 text-sm">{r.userName}</span>
                          <span className="text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={13} className={i < r.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-primary-50 border border-primary-100 rounded-xl p-6 text-center">
                  <p className="text-gray-700 font-semibold mb-3 text-sm">Have you used this product?</p>
                  <Link href="/login" className="bg-primary-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-700 transition text-sm inline-block">
                    Write a Review
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-6">Frequently Bought Together</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-xl z-50 flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0}
          className="flex-1 bg-white border-2 border-primary-600 text-primary-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm disabled:border-gray-200 disabled:text-gray-400"
        >
          <ShoppingCart size={17} /> Cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stockQuantity === 0}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl text-sm disabled:bg-gray-200"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
