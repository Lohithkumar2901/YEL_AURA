// Generic API helpers
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// User
export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt?: string;
}

// Category
export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  _count?: { products: number };
  createdAt?: string;
}

// Product image (backend stores as string URL, but we support both)
export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

// Product
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  sizes: string[];
  colors: string[];
  images: string[];
  featured: boolean;
  categoryId: string;
  category?: Category;
  createdAt: string;
  avgRating?: number;
  reviews?: Review[];
}

// Review
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// Cart
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  count: number;
  itemCount?: number;
  total?: number;
  discount?: number;
  couponCode?: string | null;
  couponDiscount?: number;
  shippingCost?: number;
  tax?: number;
}

// Wishlist
export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt?: string;
}

// Order
export type OrderStatus = 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'razorpay' | 'cod';

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress: ShippingAddress;
  razorpayOrderId?: string | null;
  createdAt: string;
  items: OrderItem[];
  user?: Pick<User, 'name' | 'email'>;
}

// Coupon
export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  expiryDate: string;
  active: boolean;
}

// Banner
export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  link?: string | null;
  active: boolean;
  order: number;
}

// Products list response
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

// Admin dashboard
export interface DashboardStats {
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
  };
  recentOrders: Order[];
  lowStock: Product[];
}

// Product Filters (kept for API compatibility)
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

// Sort option for shop page
export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popularity' | 'rating' | 'discount';

// UI helpers
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: unknown;
}
