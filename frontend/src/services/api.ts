import {
  Category, Product, ProductListResponse, CartSummary,
  WishlistItem, User, Address, Order, AdminStats
} from '../types';
import { BOUTIQUE_CATEGORIES, BOUTIQUE_PRODUCTS } from './catalogData';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

// Generate or fetch guest session ID
export function getSessionId(): string {
  let sessionId = localStorage.getItem('ddfashion_session_id');
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('ddfashion_session_id', sessionId);
  }
  return sessionId;
}

export function getToken(): string | null {
  return localStorage.getItem('ddfashion_token');
}

export function setToken(token: string) {
  localStorage.setItem('ddfashion_token', token);
}

export function removeToken() {
  localStorage.removeItem('ddfashion_token');
}

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'An unexpected error occurred';
    try {
      const err = await response.json();
      errorDetail = err.detail || err.message || errorDetail;
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

// Client-side fallback cart helpers for serverless/static deployments
function getLocalCart(): CartSummary {
  try {
    const raw = localStorage.getItem('ddfashion_client_cart');
    if (raw) return JSON.parse(raw);
  } catch {}
  return { items: [], subtotal: 0, shipping_fee: 0, total: 0, item_count: 0 };
}

function saveLocalCart(cart: CartSummary): CartSummary {
  const subtotal = cart.items.reduce((sum, item) => sum + ((item.product?.price || 0) * item.quantity), 0);
  const shipping_fee = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  const item_count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const updated: CartSummary = {
    items: cart.items,
    subtotal,
    shipping_fee,
    total: subtotal + shipping_fee,
    item_count,
  };
  localStorage.setItem('ddfashion_client_cart', JSON.stringify(updated));
  return updated;
}

// Client-side filtering function for fallback
function filterBoutiqueProducts(params: Record<string, string | number | boolean | undefined>): ProductListResponse {
  let items = [...BOUTIQUE_PRODUCTS];

  if (params.category) {
    const catSlug = String(params.category).toLowerCase();
    items = items.filter(p => 
      p.category?.slug.toLowerCase() === catSlug ||
      (p as any).category_slug?.toLowerCase() === catSlug
    );
  }

  if (params.search) {
    const q = String(params.search).toLowerCase();
    items = items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    );
  }

  if (params.is_new_arrival) {
    items = items.filter(p => p.is_new_arrival);
  }

  if (params.is_featured) {
    items = items.filter(p => p.is_featured);
  }

  if (params.min_price !== undefined && params.min_price !== '') {
    items = items.filter(p => p.price >= Number(params.min_price));
  }

  if (params.max_price !== undefined && params.max_price !== '') {
    items = items.filter(p => p.price <= Number(params.max_price));
  }

  if (params.size) {
    const s = String(params.size);
    items = items.filter(p => p.sizes?.includes(s));
  }

  if (params.color) {
    const c = String(params.color);
    items = items.filter(p => p.colors?.includes(c));
  }

  if (params.fabric) {
    const f = String(params.fabric).toLowerCase();
    items = items.filter(p => p.fabric?.toLowerCase().includes(f));
  }

  // Sorting
  const sortBy = params.sort_by || 'recommended';
  if (sortBy === 'price_asc') {
    items.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    items.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name_asc') {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'newest') {
    items.sort((a, b) => b.id - a.id);
  } else {
    items.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 24;
  const start = (page - 1) * limit;
  const paginated = items.slice(start, start + limit);

  return {
    items: paginated,
    total: items.length,
    page,
    size: limit,
    pages: Math.ceil(items.length / limit) || 1,
  };
}

export const api = {
  // --- Auth ---
  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    const data = await fetchJson<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.access_token);
    return data;
  },

  async register(full_name: string, email: string, password: string, phone?: string): Promise<{ access_token: string; user: User }> {
    const data = await fetchJson<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ full_name, email, password, phone }),
    });
    setToken(data.access_token);
    return data;
  },

  async logout(): Promise<void> {
    removeToken();
  },

  async getMe(): Promise<User> {
    return fetchJson<User>('/auth/me');
  },

  async updateProfile(full_name?: string, phone?: string): Promise<User> {
    return fetchJson<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ full_name, phone }),
    });
  },

  async getAddresses(): Promise<Address[]> {
    return fetchJson<Address[]>('/auth/addresses');
  },

  async addAddress(address: Omit<Address, 'id' | 'user_id' | 'created_at'>): Promise<Address> {
    return fetchJson<Address>('/auth/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    });
  },

  async deleteAddress(addressId: number): Promise<void> {
    await fetchJson(`/auth/addresses/${addressId}`, { method: 'DELETE' });
  },

  // --- Categories (With Instant Fallback) ---
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetchJson<Category[]>('/categories');
      if (res && Array.isArray(res) && res.length > 0) return res;
      return BOUTIQUE_CATEGORIES;
    } catch {
      return BOUTIQUE_CATEGORIES;
    }
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    try {
      return await fetchJson<Category>(`/categories/${slug}`);
    } catch {
      const found = BOUTIQUE_CATEGORIES.find(c => c.slug === slug);
      if (found) return found;
      throw new Error('Category not found');
    }
  },

  // --- Products (With Instant Fallback) ---
  async getProducts(params: Record<string, string | number | boolean | undefined> = {}): Promise<ProductListResponse> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      const res = await fetchJson<ProductListResponse>(`/products${query}`);
      if (res && res.items && res.items.length > 0) return res;
      return filterBoutiqueProducts(params);
    } catch {
      return filterBoutiqueProducts(params);
    }
  },

  async getProductBySlug(slug: string): Promise<Product> {
    try {
      return await fetchJson<Product>(`/products/slug/${slug}`);
    } catch {
      const found = BOUTIQUE_PRODUCTS.find(p => 
        p.slug === slug || 
        p.sku.toLowerCase() === slug.toLowerCase() ||
        slug.startsWith(p.sku.toLowerCase())
      );
      if (found) return found;
      throw new Error('Product not found');
    }
  },

  async getProductById(id: number): Promise<Product> {
    try {
      return await fetchJson<Product>(`/products/${id}`);
    } catch {
      const found = BOUTIQUE_PRODUCTS.find(p => p.id === id);
      if (found) return found;
      throw new Error('Product not found');
    }
  },

  async getRelatedProducts(id: number, limit: number = 4): Promise<Product[]> {
    try {
      return await fetchJson<Product[]>(`/products/${id}/related?limit=${limit}`);
    } catch {
      const current = BOUTIQUE_PRODUCTS.find(p => p.id === id);
      return BOUTIQUE_PRODUCTS
        .filter(p => p.id !== id && (!current || p.category_id === current.category_id))
        .slice(0, limit);
    }
  },

  async getFilterMeta(): Promise<{ colors: string[]; sizes: string[]; fabrics: string[]; min_price: number; max_price: number }> {
    try {
      return await fetchJson('/products/meta/filters');
    } catch {
      const colors = Array.from(new Set(BOUTIQUE_PRODUCTS.flatMap(p => p.colors || [])));
      const sizes = Array.from(new Set(BOUTIQUE_PRODUCTS.flatMap(p => p.sizes || [])));
      const fabrics = Array.from(new Set(BOUTIQUE_PRODUCTS.map(p => p.fabric).filter(Boolean) as string[]));
      return {
        colors,
        sizes,
        fabrics,
        min_price: 599,
        max_price: 2899,
      };
    }
  },

  // --- Cart (With Instant Local Storage Fallback) ---
  async getCart(): Promise<CartSummary> {
    try {
      const sessionId = getSessionId();
      return await fetchJson<CartSummary>(`/cart?session_id=${sessionId}`);
    } catch {
      return getLocalCart();
    }
  },

  async addToCart(productId: number, quantity: number = 1, size?: string, color?: string): Promise<CartSummary> {
    try {
      const sessionId = getSessionId();
      return await fetchJson<CartSummary>('/cart/items', {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId,
          quantity,
          size,
          color,
          session_id: sessionId,
        }),
      });
    } catch {
      const cart = getLocalCart();
      const product = BOUTIQUE_PRODUCTS.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');
      
      const existing = cart.items.find(i => i.product_id === productId && i.size === size && i.color === color);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({
          id: Date.now(),
          product_id: product.id,
          product,
          quantity,
          size,
          color,
          created_at: new Date().toISOString(),
        });
      }
      return saveLocalCart(cart);
    }
  },

  async updateCartItem(itemId: number, quantity: number): Promise<CartSummary> {
    try {
      const sessionId = getSessionId();
      return await fetchJson<CartSummary>(`/cart/items/${itemId}?session_id=${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      });
    } catch {
      const cart = getLocalCart();
      const item = cart.items.find(i => i.id === itemId);
      if (item) {
        item.quantity = quantity;
      }
      return saveLocalCart(cart);
    }
  },

  async removeCartItem(itemId: number): Promise<CartSummary> {
    try {
      const sessionId = getSessionId();
      return await fetchJson<CartSummary>(`/cart/items/${itemId}?session_id=${sessionId}`, {
        method: 'DELETE',
      });
    } catch {
      const cart = getLocalCart();
      cart.items = cart.items.filter(i => i.id !== itemId);
      return saveLocalCart(cart);
    }
  },

  async clearCart(): Promise<void> {
    try {
      const sessionId = getSessionId();
      await fetchJson(`/cart/clear?session_id=${sessionId}`, { method: 'DELETE' });
    } catch {
      localStorage.removeItem('ddfashion_client_cart');
    }
  },

  // --- Wishlist ---
  async getWishlist(): Promise<WishlistItem[]> {
    try {
      return await fetchJson<WishlistItem[]>('/wishlist');
    } catch {
      return [];
    }
  },

  async addToWishlist(productId: number): Promise<WishlistItem> {
    return fetchJson<WishlistItem>('/wishlist/items', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  },

  async removeFromWishlist(productId: number): Promise<void> {
    await fetchJson(`/wishlist/items/${productId}`, { method: 'DELETE' });
  },

  // --- Orders ---
  async createOrder(data: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: any;
    payment_method: string;
    notes?: string;
  }): Promise<Order> {
    const sessionId = getSessionId();
    return fetchJson<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        session_id: sessionId,
      }),
    });
  },

  async getOrders(): Promise<Order[]> {
    return fetchJson<Order[]>('/orders');
  },

  async getOrderByRef(orderRef: string): Promise<Order> {
    return fetchJson<Order>(`/orders/${orderRef}`);
  },

  // --- Admin ---
  async getAdminStats(): Promise<AdminStats> {
    try {
      return await fetchJson<AdminStats>('/admin/dashboard');
    } catch {
      return {
        total_products: 20,
        total_orders: 0,
        total_revenue: 0,
        pending_orders: 0,
        low_stock_products: 0,
        recent_orders: [],
      };
    }
  },

  async getAdminOrders(search?: string, status?: string): Promise<Order[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const q = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<Order[]>(`/admin/orders${q}`);
  },

  async updateAdminOrderStatus(orderId: number, order_status?: string, payment_status?: string): Promise<Order> {
    return fetchJson<Order>(`/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ order_status, payment_status }),
    });
  },

  async createAdminProduct(productData: any): Promise<Product> {
    return fetchJson<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  async updateAdminProduct(productId: number, productData: any): Promise<Product> {
    return fetchJson<Product>(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  async deleteAdminProduct(productId: number): Promise<void> {
    await fetchJson(`/admin/products/${productId}`, { method: 'DELETE' });
  },

  async uploadAdminImage(file: File): Promise<{ url: string; filename: string }> {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Image upload failed');
    }
    return res.json();
  },

  async createCategory(categoryData: any): Promise<Category> {
    return fetchJson<Category>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // --- Newsletter ---
  async subscribeNewsletter(email: string): Promise<{ message: string }> {
    try {
      return await fetchJson<{ message: string }>('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch {
      return { message: 'Thank you for subscribing to DD FASHION updates!' };
    }
  },
};
