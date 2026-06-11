import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Truck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Premium Quality Fertilizer for Maximum Yield
            </h1>
            <p className="text-primary-100 text-lg mb-8 max-w-lg">
              Empowering farmers with scientifically proven agricultural inputs. Boost your crop production today.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/products" 
                className="bg-primary-500 hover:bg-primary-400 text-white px-6 py-3 rounded-md font-medium transition flex items-center gap-2"
              >
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link 
                href="/blog" 
                className="bg-transparent border border-primary-400 text-primary-100 hover:bg-primary-800 px-6 py-3 rounded-md font-medium transition"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 bg-primary-800 rounded-full flex items-center justify-center border-4 border-primary-500/30">
              <Leaf size={100} className="text-primary-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-primary-50">
            <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4">
              <Leaf size={32} />
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">100% Organic Options</h3>
            <p className="text-foreground/80">Sustainable solutions for environmentally conscious farming.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-primary-50">
            <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">Quality Guaranteed</h3>
            <p className="text-foreground/80">Lab-tested products meeting the highest agricultural standards.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-primary-50">
            <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4">
              <Truck size={32} />
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">Fast Pan-India Delivery</h3>
            <p className="text-foreground/80">Reliable logistics network ensuring your inputs arrive on time.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
