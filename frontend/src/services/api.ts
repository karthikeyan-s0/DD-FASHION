import {
  Category, Product, ProductListResponse, CartSummary,
  WishlistItem, User, Address, Order, AdminStats
} from '../types';

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

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    return fetchJson<Category[]>('/categories');
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    return fetchJson<Category>(`/categories/${slug}`);
  },

  // --- Products ---
  async getProducts(params: Record<string, string | number | boolean | undefined> = {}): Promise<ProductListResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return fetchJson<ProductListResponse>(`/products${query}`);
  },

  async getProductBySlug(slug: string): Promise<Product> {
    return fetchJson<Product>(`/products/slug/${slug}`);
  },

  async getProductById(id: number): Promise<Product> {
    return fetchJson<Product>(`/products/${id}`);
  },

  async getRelatedProducts(id: number, limit: number = 4): Promise<Product[]> {
    return fetchJson<Product[]>(`/products/${id}/related?limit=${limit}`);
  },

  async getFilterMeta(): Promise<{ colors: string[]; sizes: string[]; fabrics: string[]; min_price: number; max_price: number }> {
    return fetchJson('/products/meta/filters');
  },

  // --- Cart ---
  async getCart(): Promise<CartSummary> {
    const sessionId = getSessionId();
    return fetchJson<CartSummary>(`/cart?session_id=${sessionId}`);
  },

  async addToCart(productId: number, quantity: number = 1, size?: string, color?: string): Promise<CartSummary> {
    const sessionId = getSessionId();
    return fetchJson<CartSummary>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity,
        size,
        color,
        session_id: sessionId,
      }),
    });
  },

  async updateCartItem(itemId: number, quantity: number): Promise<CartSummary> {
    const sessionId = getSessionId();
    return fetchJson<CartSummary>(`/cart/items/${itemId}?session_id=${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  },

  async removeCartItem(itemId: number): Promise<CartSummary> {
    const sessionId = getSessionId();
    return fetchJson<CartSummary>(`/cart/items/${itemId}?session_id=${sessionId}`, {
      method: 'DELETE',
    });
  },

  async clearCart(): Promise<void> {
    const sessionId = getSessionId();
    await fetchJson(`/cart/clear?session_id=${sessionId}`, { method: 'DELETE' });
  },

  // --- Wishlist ---
  async getWishlist(): Promise<WishlistItem[]> {
    return fetchJson<WishlistItem[]>('/wishlist');
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
    return fetchJson<AdminStats>('/admin/dashboard');
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
    return fetchJson<{ message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};
