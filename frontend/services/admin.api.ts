import api from '@/lib/axios';
import type { Product, Order, User, Coupon, Category, DashboardStats, Banner, PaginationMeta } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SalesDataPoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
}

export interface AnalyticsData {
  monthlySales: SalesDataPoint[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: TopProduct[];
  customerGrowth: { month: string; count: number }[];
}

export interface AdminProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sort?: string;
}

export interface AdminOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  categoryId: string;
  sizes?: string[];
  colors?: string[];
  images?: string[];
  featured?: boolean;
}

export interface CreateCouponData {
  code: string;
  discountPercentage: number;
  expiryDate: string;
  active?: boolean;
}

export interface CreateBannerData {
  title: string;
  subtitle?: string;
  image?: string;
  link?: string;
  order?: number;
  active?: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  phone: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  metaTitle?: string;
  metaDescription?: string;
  logo?: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

/** Returns DashboardStats flat (no wrapper) */
export const getDashboardStats = () =>
  api.get<DashboardStats>('/admin/dashboard');

/** Returns AnalyticsData */
export const getSalesAnalytics = (period?: string) =>
  api.get<AnalyticsData>('/admin/analytics/sales', { params: { period } });

// ─── Products ─────────────────────────────────────────────────────────────────

export const getAllProducts = (params?: AdminProductsParams) =>
  api.get<{ products: Product[]; total: number; page: number; pages: number }>('/products', { params });

export const getProductById = (id: string) =>
  api.get<Product>(`/products/id/${id}`);

export const createProduct = (data: CreateProductData) =>
  api.post<Product>('/products', data);

export const updateProduct = (id: string, data: Partial<CreateProductData>) =>
  api.put<Product>(`/products/${id}`, data);

export const deleteProduct = (id: string) =>
  api.delete(`/products/${id}`);

export const toggleFeatured = (id: string, featured: boolean) =>
  api.put<Product>(`/products/${id}`, { featured });

export const uploadImages = (files: File[]) => {
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  return api.post<{ urls: string[] }>('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const getAllOrders = (params?: AdminOrdersParams) =>
  api.get<{ orders: Order[]; total: number; page: number; pages: number }>('/admin/orders', { params });

export const getOrderById = (id: string) =>
  api.get<Order>(`/orders/${id}`);

export const updateOrderStatus = (id: string, orderStatus: string, paymentStatus?: string) =>
  api.put<Order>(`/orders/${id}/status`, { orderStatus, paymentStatus });

// ─── Users / Customers ────────────────────────────────────────────────────────

export const getAllUsers = () =>
  api.get<User[]>('/admin/users');

export const updateUserRole = (id: string, role: string) =>
  api.put<User>(`/admin/users/${id}/role`, { role });

// ─── Categories ───────────────────────────────────────────────────────────────

export const getAllCategoriesAdmin = () =>
  api.get<Category[]>('/categories');

export const createCategory = (data: { name: string; image?: string }) =>
  api.post<Category>('/categories', data);

export const updateCategory = (id: string, data: Partial<{ name: string; image?: string }>) =>
  api.put<Category>(`/categories/${id}`, data);

export const deleteCategory = (id: string) =>
  api.delete(`/categories/${id}`);

// ─── Coupons ──────────────────────────────────────────────────────────────────

export const getCoupons = () =>
  api.get<Coupon[]>('/coupons');

export const createCoupon = (data: CreateCouponData) =>
  api.post<Coupon>('/coupons', data);

export const deleteCoupon = (id: string) =>
  api.delete(`/coupons/${id}`);

export const toggleCoupon = (id: string) =>
  api.patch<Coupon>(`/coupons/${id}/toggle`);

// ─── Banners ──────────────────────────────────────────────────────────────────

export const getBanners = () =>
  api.get<Banner[]>('/banners/all');

export const createBanner = (data: CreateBannerData) =>
  api.post<Banner>('/banners', data);

export const updateBanner = (id: string, data: Partial<CreateBannerData>) =>
  api.put<Banner>(`/banners/${id}`, data);

export const deleteBanner = (id: string) =>
  api.delete(`/banners/${id}`);

// ─── Settings ─────────────────────────────────────────────────────────────────

export const getSettings = () =>
  api.get<StoreSettings>('/admin/settings');

export const updateSettings = (data: FormData | Partial<StoreSettings>) =>
  api.put<StoreSettings>('/admin/settings', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
