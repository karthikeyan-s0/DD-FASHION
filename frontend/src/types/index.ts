export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  parent_id?: number | null;
}

export interface ProductImage {
  id: number;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  category_id: number;
  category?: Category;
  price: number;
  compare_at_price?: number | null;
  fabric?: string;
  care_instructions?: string;
  colors: string[];
  sizes: string[];
  stock_quantity: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_active: boolean;
  tags: string[];
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  size?: string;
  color?: string;
  quantity: number;
  created_at: string;
  product: Product;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  item_count: number;
}

export interface WishlistItem {
  id: number;
  product_id: number;
  created_at: string;
  product: Product;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  product_image?: string;
  size?: string;
  color?: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  user_id?: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface AdminStats {
  total_orders: number;
  total_products: number;
  pending_orders: number;
  low_stock_products: number;
  total_revenue: number;
  recent_orders: Order[];
}
