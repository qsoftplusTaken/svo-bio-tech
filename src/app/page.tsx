"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/firebase/products";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import {
  ArrowRight, Leaf, Award, Truck, Shield, Star,
  CheckCircle2, Users, Package, MapPin, ChevronRight, ChevronDown,
  FlaskConical, Sprout, Droplets, SlidersHorizontal
} from "lucide-react";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "SPR Premium NPK 19:19:19 Water Soluble Fertilizer",
    slug: "spr-premium-npk-19-19-19",
    shortDescription: "100% water-soluble fertilizer for balanced crop growth and maximum yield.",
    description: "Full description...",
    category: "Fertilizers",
    brand: "SPR Biotech",
    images: ["https://images.unsplash.com/photo-1628543105315-977ba2e0964c?w=500&q=80"],
    price: 450, mrp: 600, discountPercent: 25, gstRate: 5,
    sku: "SPR-NPK-191919-1KG", stockQuantity: 50, weight: "1 kg", formType: "Powder",
    rating: { average: 4.8, count: 124 },
    specifications: { npkRatio: "19:19:19", targetCrops: "Vegetables, Fruits, Cash Crops" },
    usageGuide: { dosage: "5g/liter", method: "Foliar spray", precautions: "Avoid direct sunlight" },
    tags: ["npk", "water-soluble"], isFeatured: true, isVisible: true, createdAt: "2026-05-15T00:00:00.000Z"
  },
  {
    id: "p2",
    name: "SPR Organic Neem Cake (Neem Khali)",
    slug: "spr-organic-neem-khali",
    shortDescription: "Natural pest repellent and soil conditioner rich in NPK nutrients.",
    description: "Full description...",
    category: "Organic",
    brand: "SPR Biotech",
    images: ["https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c8c?w=500&q=80"],
    price: 180, mrp: 220, discountPercent: 18, gstRate: 5,
    sku: "SPR-NEEM-1KG", stockQuantity: 120, weight: "1 kg", formType: "Granular",
    rating: { average: 4.5, count: 89 },
    specifications: { targetCrops: "All Crops", origin: "Cold-pressed Neem" },
    usageGuide: { dosage: "50g/plant", method: "Soil application", precautions: "Mix well with soil" },
    tags: ["organic", "neem"], isFeatured: true, isVisible: true, createdAt: "2026-05-20T00:00:00.000Z"
  },
  {
    id: "p3",
    name: "Seaweed Liquid Extract — Plant Growth Promoter",
    slug: "seaweed-liquid-extract",
    shortDescription: "Bio-stimulant for better root development and drought stress tolerance.",
    description: "Full description...",
    category: "Bio-Stimulants",
    brand: "SPR Biotech",
    images: ["https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500&q=80"],
    price: 350, mrp: 400, discountPercent: 12, gstRate: 18,
    sku: "SPR-SEAWEED-500ML", stockQuantity: 5, weight: "500 ml", formType: "Liquid",
    rating: { average: 4.9, count: 210 },
    specifications: { targetCrops: "All Crops", source: "Ascophyllum nodosum" },
    usageGuide: { dosage: "2ml/liter", method: "Foliar spray / Drip", precautions: "Shake well before use" },
    tags: ["seaweed", "growth"], isFeatured: true, isVisible: true, createdAt: "2026-06-01T00:00:00.000Z"
  },
  {
    id: "p4",
    name: "Humic Acid 98% Granules — Soil Conditioner",
    slug: "humic-acid-98-granules",
    shortDescription: "Improves soil structure, nutrient retention and microbial activity.",
    description: "Full description...",
    category: "Organic",
    brand: "SPR Biotech",
    images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80"],
    price: 520, mrp: 650, discountPercent: 20, gstRate: 5,
    sku: "SPR-HUMIC-1KG", stockQuantity: 80, weight: "1 kg", formType: "Granular",
    rating: { average: 4.7, count: 67 },
    specifications: { purity: "98%", targetCrops: "Cotton, Wheat, Vegetables" },
    usageGuide: { dosage: "2-3kg/acre", method: "Soil application", precautions: "Store in cool dry place" },
    tags: ["humic", "soil"], isFeatured: true, isVisible: true, createdAt: "2026-06-05T00:00:00.000Z"
  },
  {
    id: "p5",
    name: "Trichoderma Viride Bio-Fungicide",
    slug: "trichoderma-viride-bio-fungicide",
    shortDescription: "Bio-control agent for soil-borne diseases and fungal pathogens.",
    description: "Full description...",
    category: "Bio-Stimulants",
    brand: "SPR Biotech",
    images: ["https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&q=80"],
    price: 280, mrp: 320, discountPercent: 12, gstRate: 18,
    sku: "SPR-TRICHO-200G", stockQuantity: 40, weight: "200 g", formType: "Powder",
    rating: { average: 4.6, count: 45 },
    specifications: { cfu: "2×10^8 CFU/g", targetCrops: "Vegetables, Paddy, Pulses" },
    usageGuide: { dosage: "5g/liter", method: "Seed treatment / Soil drench", precautions: "Don't mix with fungicides" },
    tags: ["bio-fungicide", "trichoderma"], isFeatured: false, isVisible: true, createdAt: "2026-06-08T00:00:00.000Z"
  },
  {
    id: "p6",
    name: "Potassium Humate Flakes — Crop Booster",
    slug: "potassium-humate-flakes",
    shortDescription: "Enhances potassium availability and strengthens plant cell walls.",
    description: "Full description...",
    category: "Fertilizers",
    brand: "SPR Biotech",
    images: ["https://images.unsplash.com/photo-1628543105315-977ba2e0964c?w=500&q=80"],
    price: 390, mrp: 450, discountPercent: 13, gstRate: 5,
    sku: "SPR-KHUM-500G", stockQuantity: 60, weight: "500 g", formType: "Granular",
    rating: { average: 4.4, count: 32 },
    specifications: { potassium: "12%", targetCrops: "Sugarcane, Banana, Vegetables" },
    usageGuide: { dosage: "1-2kg/acre", method: "Soil application / Drip", precautions: "Avoid contact with eyes" },
    tags: ["potassium", "humate"], isFeatured: false, isVisible: true, createdAt: "2026-06-11T00:00:00.000Z"
  },
];

const REVIEWS = [
  {
    name: "Rajesh Kumar",
    role: "Paddy Farmer, Tamil Nadu",
    rating: 5,
    text: "SPR NPK 19:19:19 has transformed my paddy fields. Yield increased by nearly 40% in two seasons. The water-soluble formula mixes instantly and the results are visible within days.",
    crop: "Paddy",
    initials: "RK",
    color: "bg-green-600"
  },
  {
    name: "Priya Devi",
    role: "Vegetable Grower, Karnataka",
    rating: 5,
    text: "The neem cake is genuinely organic and works wonders. No more aphid or whitefly problems. My tomato and brinjal crops are completely pest-free and the soil feels healthier.",
    crop: "Vegetables",
    initials: "PD",
    color: "bg-amber-600"
  },
  {
    name: "Suresh Patel",
    role: "Cotton Farmer, Gujarat",
    rating: 5,
    text: "Fast delivery and authentic products — that's what I love about SPR Biotech. The seaweed extract gave my cotton plants amazing vigour and the boll setting improved significantly.",
    crop: "Cotton",
    initials: "SP",
    color: "bg-blue-600"
  },
];

const CATEGORIES = [
  { name: "Fertilizers", icon: FlaskConical, desc: "NPK, Micronutrients & more", href: "/products?category=Fertilizers", color: "bg-green-50 text-green-700 border-green-100" },
  { name: "Organic", icon: Leaf, desc: "Neem, Compost & natural inputs", href: "/products?category=Organic", color: "bg-amber-50 text-amber-700 border-amber-100" },
  { name: "Bio-Stimulants", icon: Sprout, desc: "Seaweed, Trichoderma & more", href: "/products?category=Bio-Stimulants", color: "bg-teal-50 text-teal-700 border-teal-100" },
  { name: "Liquid Inputs", icon: Droplets, desc: "Foliar sprays & drip solutions", href: "/products?formType=Liquid", color: "bg-blue-50 text-blue-700 border-blue-100" },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < count ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
      ))}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-56 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="flex justify-between items-center mt-2">
          <div className="h-6 bg-gray-100 rounded w-20" />
          <div className="h-10 w-10 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((fetched) => {
      if (fetched.length > 0) setProducts(fetched);
      setLoading(false);
    });
  }, []);

  const topProducts = [...products]
    .sort((a, b) => b.rating.average - a.rating.average)
    .slice(0, 4);

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="bg-white">

      {/* ─── HERO (3-Column Editorial · Desktop) ──────────────────── */}
      <section
        className="relative overflow-hidden bg-[#f4ecd8] hidden md:flex"
        style={{ height: 'calc(100vh - 80px)', minHeight: '600px' }}
      >
        {/* Right dark-green panel extending to viewport edge */}
        <div className="absolute right-0 top-0 bottom-0 w-[35%] bg-[#126b3a]" />

        {/* Thin vertical dividers */}
        <div className="absolute top-0 bottom-0 left-[27%] w-px bg-[#052c22]/10 z-10 hidden xl:block" />
        <div className="absolute top-0 bottom-0 left-[65%] w-px bg-[#052c22]/10 z-10 hidden xl:block" />

        <div className="relative z-10 flex w-full h-full">

          {/* ── LEFT: Brand + Filters ── */}
          <div className="w-[26%] h-full flex flex-col py-14 pl-8 xl:pl-12 pr-6 border-r border-[#052c22]/10 overflow-hidden">

            {/* Brand logo */}
            <div className="mb-10 relative select-none">
              <p className="text-[#f89c3a] text-[10px] font-black uppercase tracking-[0.18em] mb-0.5 pl-0.5">
                India&apos;s Premium
              </p>
              <h1
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', lineHeight: 0.85 }}
                className="text-[#052c22] font-black italic tracking-tighter"
              >
                <span className="text-[clamp(2.8rem,4vw,4.8rem)]">SPR</span><br />
                <span className="text-[clamp(2.8rem,4vw,4.8rem)]">Bio</span>
              </h1>
              <span
                style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive", lineHeight: 1 }}
                className="text-[#f89c3a] text-[clamp(2rem,3vw,3.4rem)] block pl-3 -mt-1 -rotate-3 transform"
              >
                tech
              </span>
              <div className="mt-4 flex items-center gap-1 opacity-25">
                <div className="h-px w-8 bg-[#052c22]" />
                <div className="h-px w-5 bg-[#052c22]" />
                <div className="h-px w-2 bg-[#052c22]" />
              </div>
            </div>

            {/* Filter button */}
            <Link
              href="/products"
              className="flex items-center gap-2 text-[#052c22] font-black text-xs mb-7 hover:text-[#f89c3a] transition-colors w-fit uppercase tracking-widest"
            >
              <SlidersHorizontal size={14} strokeWidth={3} />
              Filter Products
              <ChevronRight size={12} className="opacity-40" />
            </Link>

            {/* Shop By heading */}
            <div className="mb-5">
              <h2 className="text-[#052c22] font-black text-xs uppercase tracking-[0.18em] border-b-2 border-[#052c22] pb-1.5 inline-block pr-6">
                Shop By
              </h2>
            </div>

            {/* Filter list */}
            <ul className="space-y-4 flex-1 overflow-hidden">
              {[
                { label: 'Fertilizers',    href: '/products?category=Fertilizers' },
                { label: 'Organic',        href: '/products?category=Organic' },
                { label: 'Bio-Stimulants', href: '/products?category=Bio-Stimulants' },
                { label: 'Pesticides',     href: '/products?category=Pesticides' },
                { label: 'Seeds & Inputs', href: '/products' },
                { label: 'Special Offers', href: '/products' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#f89c3a] shrink-0 group-hover:scale-125 transition-transform" />
                      <span
                        style={{ fontFamily: 'Georgia, serif' }}
                        className="text-[#052c22] font-bold italic text-[clamp(0.9rem,1.3vw,1.2rem)] group-hover:text-[#f89c3a] transition-colors"
                      >
                        {label}
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-[#052c22]/35 flex items-center justify-center group-hover:bg-[#052c22] group-hover:border-[#052c22] transition-all shrink-0">
                      <ChevronRight size={11} className="text-[#052c22]/50 group-hover:text-white transition-colors" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── MIDDLE: 2×2 Product Grid ── */}
          <div className="w-[39%] h-full py-14 px-5 border-r border-[#052c22]/10">
            <div className="grid grid-cols-2 gap-4 h-full">

              {/* Card 1 — NPK 19:19:19 */}
              <Link href="/products/spr-premium-npk-19-19-19" className="bg-white shadow hover:shadow-lg transition-shadow relative group flex flex-col overflow-hidden">
                <span className="absolute top-3 left-3 z-10 bg-[#f89c3a] text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-wide">
                  Newest
                </span>
                <div className="flex-1 overflow-hidden min-h-0 bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1628543105315-977ba2e0964c?w=600&q=80"
                    alt="NPK Fertilizer granules"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 shrink-0 flex items-end justify-between">
                  <div>
                    <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-[#052c22] font-black text-sm italic">NPK 19:19:19</h3>
                    <p className="text-[#052c22]/50 text-[11px] mt-0.5">Water Soluble Fertilizer</p>
                  </div>
                  <div className="w-7 h-7 bg-[#052c22] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#f89c3a] transition-colors">
                    <ArrowRight size={12} className="text-white" />
                  </div>
                </div>
              </Link>

              {/* Card 2 — Neem Cake */}
              <Link href="/products/spr-organic-neem-khali" className="bg-white shadow hover:shadow-lg transition-shadow relative group flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden min-h-0 bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c8c?w=600&q=80"
                    alt="Neem Cake organic fertilizer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 shrink-0 flex items-end justify-between">
                  <div>
                    <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-[#052c22] font-black text-sm italic">Neem Cake</h3>
                    <p className="text-[#052c22]/50 text-[11px] mt-0.5">Organic Pest Repellent</p>
                  </div>
                  <div className="w-7 h-7 bg-[#052c22] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#f89c3a] transition-colors">
                    <ArrowRight size={12} className="text-white" />
                  </div>
                </div>
              </Link>

              {/* Card 3 — Seaweed Extract */}
              <Link href="/products/seaweed-liquid-extract" className="bg-white shadow hover:shadow-lg transition-shadow relative group flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden min-h-0 bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&q=80"
                    alt="Seaweed liquid extract"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 shrink-0 flex items-end justify-between">
                  <div>
                    <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-[#052c22] font-black text-sm italic">Seaweed Extract</h3>
                    <p className="text-[#052c22]/50 text-[11px] mt-0.5">Bio-Stimulant Liquid</p>
                  </div>
                  <div className="w-7 h-7 bg-[#052c22] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#f89c3a] transition-colors">
                    <ArrowRight size={12} className="text-white" />
                  </div>
                </div>
              </Link>

              {/* Card 4 — Humic Acid */}
              <Link href="/products/humic-acid-98-granules" className="bg-white shadow hover:shadow-lg transition-shadow relative group flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden min-h-0 bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80"
                    alt="Humic acid soil conditioner"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 shrink-0 flex items-end justify-between relative">
                  <div>
                    <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-[#052c22] font-black text-sm italic">Humic Acid 98%</h3>
                    <p className="text-[#052c22]/50 text-[11px] mt-0.5">Soil Conditioner</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#f89c3a] text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-wide">Newest</span>
                    <div className="w-7 h-7 bg-[#052c22] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#f89c3a] transition-colors">
                      <ArrowRight size={12} className="text-white" />
                    </div>
                  </div>
                </div>
              </Link>

            </div>
          </div>

          {/* ── RIGHT: Featured Product Card ── */}
          <div className="w-[35%] h-full py-14 pl-6 pr-8 flex flex-col relative">
            <div className="bg-white shadow-2xl flex flex-col flex-1 overflow-hidden relative">

              {/* Product image */}
              <div className="relative overflow-visible shrink-0" style={{ height: '45%' }}>
                <img
                  src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=80"
                  alt="Featured product — lush farm field"
                  className="w-full h-full object-cover"
                />
                {/* Circular off-badge */}
                <div className="absolute -bottom-9 right-6 w-[4.5rem] h-[4.5rem] bg-[#f89c3a] rounded-full flex flex-col items-center justify-center shadow-lg z-20">
                  <span
                    style={{ fontFamily: 'Georgia, serif' }}
                    className="text-white text-xl font-black italic leading-none"
                  >25%</span>
                  <span className="text-white text-[9px] font-black uppercase tracking-widest">OFF</span>
                </div>
              </div>

              {/* Card content */}
              <div className="px-7 pt-10 pb-7 flex flex-col flex-1 overflow-hidden">
                <p className="text-[#f89c3a] text-[9px] font-black uppercase tracking-[0.18em] mb-1.5">★ Top Seller</p>
                <h2
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  className="text-[#052c22] text-xl font-black italic leading-tight mb-2"
                >
                  NPK 19:19:19<br />Water Soluble
                </h2>
                <p className="text-[#052c22]/55 text-xs leading-relaxed mb-4 line-clamp-2">
                  India&apos;s most trusted balanced fertilizer. Perfect for drip irrigation &amp; foliar spray across all crops.
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-[#f89c3a] text-sm font-black line-through">₹600</span>
                  <span
                    style={{ fontFamily: 'Georgia, serif' }}
                    className="text-[#052c22] text-[1.8rem] font-black italic leading-none"
                  >₹450</span>
                </div>

                {/* Weight selector */}
                <div className="mb-5">
                  <p className="text-[#f89c3a] text-[9px] font-black uppercase tracking-[0.18em] mb-2">Weight</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {['500g', '1 kg', '5 kg', '25 kg'].map((w, i) => (
                      <span
                        key={w}
                        className={`px-2.5 py-1 text-[10px] font-black rounded-full border transition-colors cursor-pointer ${
                          i === 1
                            ? 'bg-[#052c22] text-white border-[#052c22]'
                            : 'bg-transparent border-[#052c22]/25 text-[#052c22] hover:bg-[#052c22] hover:text-white hover:border-[#052c22]'
                        }`}
                      >{w}</span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/products/spr-premium-npk-19-19-19"
                  className="mt-auto bg-[#f89c3a] hover:bg-[#d97b1c] text-white font-black text-xs py-3 flex items-center justify-center gap-2 transition-colors uppercase tracking-widest"
                >
                  Shop Now <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Scroll down hint */}
            <button
              className="absolute bottom-5 right-5 w-9 h-9 rounded-full border-2 border-[#f4ecd8]/35 flex items-center justify-center hover:border-[#f4ecd8]/70 transition-colors"
              aria-label="Scroll down"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <ChevronDown size={16} className="text-[#f4ecd8]/60" />
            </button>
          </div>

        </div>
      </section>

      {/* ─── HERO (Mobile fallback) ────────────────────────────────── */}
      <section className="md:hidden bg-[#052c22] py-16 px-5 text-center overflow-hidden relative">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#f89c3a]/10 rounded-full" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <p className="text-[#f89c3a] text-[10px] font-black uppercase tracking-[0.18em] mb-4">India&apos;s Premium Bio-Fertilizers</p>
          <h1
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            className="text-white text-6xl font-black italic leading-none mb-0"
          >SPR</h1>
          <span
            style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
            className="text-[#f89c3a] text-5xl block mb-6"
          >Biotech</span>
          <p className="text-green-200 max-w-xs mx-auto mb-8 text-sm leading-relaxed">
            Premium bio-fertilizers &amp; organic inputs trusted by 10,000+ farmers across India.
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link href="/products" className="bg-[#f89c3a] text-white font-bold py-4 flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
              Shop Products <ArrowRight size={16} />
            </Link>
            <Link href="/about" className="border-2 border-white/25 text-white font-bold py-4 text-sm">
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─────────────────────────────────────── */}
      <section className="bg-primary-800 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Package, value: "500+", label: "Products" },
              { icon: Users, value: "10,000+", label: "Happy Farmers" },
              { icon: MapPin, value: "28", label: "States Covered" },
              { icon: Award, value: "15 Yrs", label: "Experience" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <stat.icon size={22} className="text-green-300 mb-1" />
                <span className="text-2xl font-black">{stat.value}</span>
                <span className="text-green-200 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHOP BY CATEGORY ──────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Browse</p>
              <h2 className="text-3xl font-black text-gray-900">Shop by Category</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-primary-600 font-semibold hover:text-primary-800 transition text-sm">
              All Products <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className={`border rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-all group ${cat.color}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <cat.icon size={26} />
                </div>
                <h3 className="font-bold text-base mb-1">{cat.name}</h3>
                <p className="text-xs opacity-75">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TOP SELLING PRODUCTS ──────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Best Picks</p>
              <h2 className="text-3xl font-black text-gray-900">Top Selling Products</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-primary-600 font-semibold hover:text-primary-800 transition text-sm">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
              : topProducts.map((product) => <ProductCard key={product.id} product={product} />)
            }
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/products" className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-700 transition">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PROMOTIONAL BANNER ────────────────────────────── */}
      <section className="bg-gradient-to-r from-amber-500 to-amber-600 py-12">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="text-white">
            <p className="text-amber-100 font-semibold text-sm uppercase tracking-widest mb-2">Limited Time</p>
            <h2 className="text-3xl font-black">Free Shipping on Orders Above ₹1000</h2>
            <p className="text-amber-100 mt-2">Valid on all products. No coupon code required.</p>
          </div>
          <Link href="/products" className="flex-shrink-0 bg-white text-amber-700 font-bold px-8 py-4 rounded-xl hover:bg-amber-50 transition shadow-lg flex items-center gap-2">
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ─── RECENTLY ADDED ────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Fresh Stock</p>
              <h2 className="text-3xl font-black text-gray-900">Recently Added</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-primary-600 font-semibold hover:text-primary-800 transition text-sm">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
              : recentProducts.map((product) => <ProductCard key={product.id} product={product} />)
            }
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/products" className="inline-flex items-center gap-2 border-2 border-primary-600 text-primary-700 font-bold px-8 py-3 rounded-xl hover:bg-primary-50 transition">
              See All New Arrivals <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ABOUT BRIEF ───────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left — Visual */}
            <div className="lg:w-5/12 w-full">
              <div className="relative bg-gradient-to-br from-primary-800 to-primary-900 rounded-3xl p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-green-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <Leaf size={40} className="text-green-300 mb-4" />
                <h3 className="text-2xl font-black mb-3">SPR Biotech</h3>
                <p className="text-green-100 text-sm leading-relaxed mb-6">
                  Founded in 2010, SPR Biotech is a leading manufacturer of bio-fertilizers and organic agricultural inputs based in Tamil Nadu.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "500+", label: "SKUs" },
                    { value: "ISO 9001", label: "Certified" },
                    { value: "FCO", label: "Approved" },
                    { value: "Direct", label: "to Farmer" },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-lg font-black text-green-200">{item.value}</p>
                      <p className="text-xs text-green-300 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Text */}
            <div className="lg:w-7/12">
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">Who We Are</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5 leading-tight">
                Empowering Farmers with Science-Backed Nutrition
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We formulate, test, and deliver premium agricultural inputs directly to farmers, bypassing middlemen. Every product undergoes rigorous quality control before reaching your hands.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: Award, title: "Government Certified", desc: "All products approved under the Fertiliser Control Order (FCO) and organic certification norms." },
                  { icon: Shield, title: "Quality Tested", desc: "Lab-tested for nutrient accuracy, purity, and safety before every batch dispatch." },
                  { icon: Truck, title: "Pan-India Delivery", desc: "Fast, reliable delivery across all 28 states with real-time order tracking." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-700 transition shadow-md shadow-primary-500/20"
              >
                Learn Our Story <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CUSTOMER REVIEWS ──────────────────────────────── */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-3xl font-black text-gray-900">What Our Farmers Say</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Real results from real farmers across India who trust SPR Biotech for their crop nutrition needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((review) => (
              <div key={review.name} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 flex flex-col">
                <StarRating count={review.rating} />
                <blockquote className="text-gray-700 leading-relaxed my-5 flex-grow text-sm">
                  &ldquo;{review.text}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                  <div className={`w-10 h-10 ${review.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {review.initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                    <p className="text-gray-500 text-xs">{review.role}</p>
                  </div>
                  <span className="ml-auto text-xs font-semibold bg-primary-50 text-primary-700 px-2 py-1 rounded-full border border-primary-100">
                    {review.crop}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST BADGES ──────────────────────────────────── */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Shield, title: "100% Genuine", desc: "Sourced directly from manufacturers" },
              { icon: Truck, title: "Fast Delivery", desc: "Ships within 24 hours of order" },
              { icon: Award, title: "FCO Certified", desc: "All products government approved" },
              { icon: CheckCircle2, title: "Easy Returns", desc: "Hassle-free 7-day return policy" },
            ].map((badge) => (
              <div key={badge.title} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
                  <badge.icon size={24} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{badge.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#052e16] to-[#14532d] py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center text-white">
          <Leaf size={48} className="text-green-300 mx-auto mb-6" />
          <h2 className="text-4xl font-black mb-4">Ready to Transform Your Farm?</h2>
          <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
            Browse our complete range of bio-fertilizers and organic inputs. Trusted by farmers, tested by scientists.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-primary-900 font-bold px-10 py-4 rounded-xl hover:bg-green-50 transition shadow-xl flex items-center gap-2 text-lg"
            >
              Shop Now <ArrowRight size={20} />
            </Link>
            <Link
              href="/about"
              className="border-2 border-white/40 text-white font-bold px-10 py-4 rounded-xl hover:bg-white/10 transition text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
