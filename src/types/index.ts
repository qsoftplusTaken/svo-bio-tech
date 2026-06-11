export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string; // Rich text
  category: string;
  brand: string;
  images: string[]; // URLs
  price: number; // Selling price
  mrp: number; // Maximum Retail Price
  discountPercent?: number;
  gstRate: number; // 5, 12, 18
  sku: string;
  stockQuantity: number;
  weight: string; // e.g., "1kg", "500ml"
  formType: "Granular" | "Liquid" | "Powder";
  rating: {
    average: number;
    count: number;
  };
  specifications: {
    npkRatio?: string;
    targetCrops?: string;
    [key: string]: any;
  };
  usageGuide: {
    dosage: string;
    method: string;
    precautions: string;
  };
  tags: string[];
  isFeatured: boolean;
  isVisible: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  pincode: string;
  street: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface Order {
  id: string; // Firestore document ID
  userId: string;
  items: CartItem[];
  shippingAddress: Address;
  paymentDetails: {
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    status: "Pending" | "Paid" | "Failed";
    method: string;
  };
  pricing: {
    subtotal: number;
    discount: number;
    delivery: number;
    total: number;
  };
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  trackingLink?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  images?: string[];
  isApproved: boolean; // For admin moderation
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown or HTML
  excerpt: string;
  coverImage: string;
  author: string;
  category: string; // e.g., "Farming Tips", "Crop Nutrition"
  tags: string[];
  isPublished: boolean;
  createdAt: string;
}
