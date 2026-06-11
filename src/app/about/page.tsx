import Link from "next/link";
import {
  Leaf, Award, Shield, Truck, Users, Package, MapPin,
  CheckCircle2, Phone, Mail, ArrowRight, FlaskConical, Star
} from "lucide-react";

export const metadata = {
  title: "About Us | SPR Biotech",
  description: "Learn about SPR Biotech — India's trusted bio-fertilizer manufacturer empowering farmers with science-backed crop nutrition.",
};

const TEAM = [
  { name: "Dr. S. Prabhakar", role: "Founder & CEO", initials: "SP", color: "bg-green-700", bio: "Ph.D in Agricultural Science with 20+ years in crop nutrition research and fertilizer manufacturing." },
  { name: "R. Kavitha", role: "Head of R&D", initials: "RK", color: "bg-teal-600", bio: "M.Sc. Microbiology. Leads formulation of bio-stimulant and bio-control products." },
  { name: "Arun Selvaraj", role: "Operations Director", initials: "AS", color: "bg-amber-600", bio: "Manages end-to-end supply chain, quality control, and pan-India distribution network." },
];

const MILESTONES = [
  { year: "2010", title: "Company Founded", desc: "SPR Biotech established in Coimbatore with a focus on eco-friendly fertilizer production." },
  { year: "2013", title: "FCO Certification", desc: "Received Fertiliser Control Order approval for all core product lines." },
  { year: "2016", title: "ISO 9001:2015", desc: "Achieved ISO certification for quality management systems." },
  { year: "2019", title: "Pan-India Launch", desc: "Expanded distribution to all 28 states through direct farmer outreach." },
  { year: "2022", title: "10,000 Farmers", desc: "Crossed the milestone of 10,000 active farmer customers across India." },
  { year: "2026", title: "E-Commerce Launch", desc: "Launched direct-to-farmer online store for doorstep delivery across India." },
];

const VALUES = [
  { icon: Leaf, title: "Sustainability", desc: "Every product is designed to improve soil health over the long term, not just deliver short-term yield boosts." },
  { icon: FlaskConical, title: "Science-First", desc: "Our R&D team rigorously tests every formulation before it reaches a single field." },
  { icon: Users, title: "Farmer-Centric", desc: "Prices, packaging, and dosing are designed around what works best for the Indian farmer." },
  { icon: Shield, title: "Integrity", desc: "We never compromise on ingredient purity, labelling accuracy, or certifications." },
];

export default function AboutPage() {
  return (
    <div className="bg-white">

      {/* ─── HERO ─── */}
      <section className="relative bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#166534] py-20 md:py-28 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl text-center text-white relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-green-200 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Leaf size={15} /> Est. 2010 · Coimbatore, Tamil Nadu
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5">
            Growing India,<br /><span className="text-green-300">One Farm at a Time</span>
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto mb-8">
            SPR Biotech is a science-driven manufacturer of bio-fertilizers, organic inputs, and crop nutrition solutions committed to sustainable Indian agriculture.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products" className="bg-white text-primary-900 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition shadow-lg flex items-center gap-2">
              Our Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-primary-800 text-white py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "500+", label: "Products", icon: Package },
              { value: "10,000+", label: "Farmers", icon: Users },
              { value: "28", label: "States", icon: MapPin },
              { value: "15 Yrs", label: "Experience", icon: Award },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <s.icon size={22} className="text-green-300 mb-1" />
                <span className="text-2xl font-black">{s.value}</span>
                <span className="text-green-200 text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STORY ─── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">Our Story</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5 leading-tight">
                From a Small Lab to a Farmer's Best Friend
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                SPR Biotech was founded in 2010 by Dr. S. Prabhakar with a single goal: make high-quality, affordable bio-fertilizers accessible to every Indian farmer — not just the large landowners.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Starting with two products in a small Coimbatore facility, we grew steadily by listening to farmers, iterating on formulations, and never cutting corners on quality. Today we manufacture over 500 SKUs and supply directly to farmers across India through our network of agronomists and our online store.
              </p>
              <div className="space-y-3">
                {[
                  "Government-approved under the Fertiliser Control Order",
                  "ISO 9001:2015 certified quality management",
                  "Third-party lab tested for every batch",
                  "Zero harmful chemicals in organic product range",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FlaskConical, title: "Own R&D Lab", desc: "In-house formulation and testing facility in Coimbatore.", color: "bg-green-50 text-green-700" },
                { icon: Award, title: "Certified", desc: "FCO approved, ISO 9001:2015 certified.", color: "bg-amber-50 text-amber-700" },
                { icon: Truck, title: "Direct Supply", desc: "No middlemen. Products go straight from us to you.", color: "bg-blue-50 text-blue-700" },
                { icon: Users, title: "Farmer Support", desc: "Dedicated agronomy helpline & field support team.", color: "bg-teal-50 text-teal-700" },
              ].map((card) => (
                <div key={card.title} className={`rounded-2xl border p-6 ${card.color.includes("green") ? "border-green-100" : card.color.includes("amber") ? "border-amber-100" : card.color.includes("blue") ? "border-blue-100" : "border-teal-100"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                    <card.icon size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{card.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── OUR VALUES ─── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">What We Stand For</p>
            <h2 className="text-3xl font-black text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <v.icon size={26} className="text-primary-600" />
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MILESTONES ─── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">Our Journey</p>
            <h2 className="text-3xl font-black text-gray-900">Key Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-100 -translate-x-1/2 hidden md:block" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className={`flex gap-6 items-start ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm ${i % 2 !== 0 ? "md:text-right" : ""}`}>
                    <span className="text-xs font-black text-primary-600 uppercase tracking-widest">{m.year}</span>
                    <h3 className="font-black text-gray-900 mt-1 mb-2">{m.title}</h3>
                    <p className="text-gray-500 text-sm">{m.desc}</p>
                  </div>
                  <div className="hidden md:flex flex-shrink-0 w-10 h-10 bg-primary-600 rounded-full items-center justify-center shadow-md relative z-10">
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">The People</p>
            <h2 className="text-3xl font-black text-gray-900">Leadership Team</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">A team of agronomists, scientists and farmers dedicated to transforming Indian agriculture.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
                <div className={`w-16 h-16 ${member.color} rounded-2xl flex items-center justify-center text-white font-black text-xl mx-auto mb-4`}>
                  {member.initials}
                </div>
                <h3 className="font-black text-gray-900">{member.name}</h3>
                <p className="text-primary-600 text-sm font-semibold mb-3">{member.role}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT INFO ─── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
              <h2 className="text-3xl font-black text-gray-900 mb-5">We&apos;re Here to Help</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Have a question about our products, need agronomic advice, or want to become a distributor? Our team is ready to assist you.
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Head Office</p>
                    <p className="text-gray-500 text-sm mt-0.5">123 Agri-Tech Park, Phase II,<br />Coimbatore, Tamil Nadu — 641004</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Phone</p>
                    <p className="text-gray-500 text-sm mt-0.5">+91 98765 43210 (Mon–Sat, 9am–6pm)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Email</p>
                    <p className="text-gray-500 text-sm mt-0.5">support@sprbiotech.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-3xl p-10 text-white text-center">
              <Star size={36} className="text-green-300 mx-auto mb-4" />
              <h3 className="text-2xl font-black mb-3">Start Growing Today</h3>
              <p className="text-green-100 mb-8 text-sm leading-relaxed">
                Join 10,000+ farmers who have transformed their yields with SPR Biotech products.
              </p>
              <Link href="/products" className="inline-flex items-center gap-2 bg-white text-primary-900 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition shadow-lg">
                Shop Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
