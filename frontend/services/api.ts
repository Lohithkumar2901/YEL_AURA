import api from '@/lib/axios';
import type {
  User,
  Product,
  Category,
  Cart,
  WishlistItem,
  Order,
  Coupon,
  Banner,
  ProductsResponse,
  ProductFilters,
  ShippingAddress,
} from '@/types';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  /** Returns { message, user, token } */
  login: (email: string, password: string) =>
    api.post<{ message: string; user: User; token: string }>('/auth/login', { email, password }),

  /** Returns { message, user, token } */
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post<{ message: string; user: User; token: string }>('/auth/register', data),

  /** Returns User */
  getProfile: () => api.get<User>('/auth/profile'),

  /** Returns updated User */
  updateProfile: (data: Partial<Pick<User, 'name' | 'phone'>>) =>
    api.put<User>('/auth/profile', data),

  /** Change password — POST /auth/change-password */
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),

  logout: () => api.post('/auth/logout'),
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  /** Returns { products, total, page, pages } */
  getProducts: (filters?: ProductFilters) =>
    api.get<ProductsResponse>('/products', { params: filters }),

  /** Returns Product */
  getProduct: (slug: string) =>
    api.get<Product>(`/products/${slug}`),

  /** Returns Product[] */
  getFeaturedProducts: () =>
    api.get<Product[]>('/products/featured'),

  /** Returns Product[] */
  getNewArrivals: () =>
    api.get<Product[]>('/products/new-arrivals'),

  searchProducts: (query: string, filters?: Partial<ProductFilters>) =>
    api.get<ProductsResponse>('/products', { params: { search: query, ...filters } }),
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesApi = {
  /** Returns Category[] */
  getCategories: () => api.get<Category[]>('/categories'),

  /** Returns Category */
  getCategory: (slug: string) => api.get<Category>(`/categories/${slug}`),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────

export const cartApi = {
  /** Returns { items, subtotal, count } */
  getCart: () => api.get<Cart>('/cart'),

  /** Add item — body: { productId, quantity, size?, color? } */
  addToCart: (item: { productId: string; quantity: number; size?: string; color?: string }) =>
    api.post<Cart>('/cart', item),

  /** Update item quantity — PUT /cart/:id body: { quantity } */
  updateCartItem: (cartItemId: string, quantity: number) =>
    api.put<Cart>(`/cart/${cartItemId}`, { quantity }),

  /** Remove a single item — DELETE /cart/:id */
  removeFromCart: (cartItemId: string) =>
    api.delete(`/cart/${cartItemId}`),

  /** Clear all items — DELETE /cart/clear */
  clearCart: () => api.delete('/cart/clear'),
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export const wishlistApi = {
  /** Returns WishlistItem[] */
  getWishlist: () => api.get<WishlistItem[]>('/wishlist'),

  /** Returns { message, wishlisted } */
  toggleWishlist: (productId: string) =>
    api.post<{ message: string; wishlisted: boolean }>('/wishlist/toggle', { productId }),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface CreateOrderData {
  shippingAddress: ShippingAddress;
  paymentMethod: 'razorpay' | 'cod';
  couponCode?: string;
}

export const ordersApi = {
  /** Returns created Order */
  createOrder: (data: CreateOrderData) =>
    api.post<Order>('/orders', data),

  /** Returns Order[] */
  getMyOrders: () =>
    api.get<Order[]>('/orders/my-orders'),

  /** Returns Order */
  getOrder: (orderId: string) =>
    api.get<Order>(`/orders/${orderId}`),
};

// ─── Coupons ──────────────────────────────────────────────────────────────────

export const couponsApi = {
  /** Returns Coupon or error */
  validateCoupon: (code: string) =>
    api.post<Coupon>('/coupons/validate', { code }),
};

// ─── Banners ──────────────────────────────────────────────────────────────────

export const bannersApi = {
  /** Returns Banner[] */
  getBanners: () => api.get<Banner[]>('/banners'),
};
