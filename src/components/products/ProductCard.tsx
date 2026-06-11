import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stockQuantity === 0;
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };
  
  return (
    <div className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.discountPercent && product.discountPercent > 0 ? (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {product.discountPercent}% OFF
          </span>
        ) : null}
        <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded-md capitalize">
          {product.category}
        </span>
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
        <Heart size={18} />
      </button>

      {/* Image Container with hover zoom */}
      <Link href={`/products/${product.id}`} className="relative h-56 w-full overflow-hidden bg-gray-50 flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="text-gray-300 flex items-center justify-center h-full w-full bg-gray-100">
            No Image
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          <Star className="fill-yellow-400 text-yellow-400" size={14} />
          <span className="text-sm font-medium text-gray-700">{product.rating?.average || 0}</span>
          <span className="text-xs text-gray-400">({product.rating?.count || 0})</span>
        </div>
        
        <Link href={`/products/${product.id}`} className="hover:text-primary-600 transition-colors">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.shortDescription}</p>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
              {product.mrp > product.price && (
                <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>
              )}
            </div>
            <span className={`text-xs font-medium ${isOutOfStock ? 'text-red-500' : product.stockQuantity < 10 ? 'text-orange-500' : 'text-green-600'}`}>
              {isOutOfStock ? 'Out of Stock' : product.stockQuantity < 10 ? 'Low Stock' : 'In Stock'}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-3 rounded-xl flex items-center justify-center transition-colors shadow-sm
              ${isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white'}`}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
