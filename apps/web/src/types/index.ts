export interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price?: number;
  stock: number;
  images: string[];
  category: string;
  description: string;
  is_active: boolean;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  items: OrderItem[];
  total: number;
  delivery_fee: number;
  payment_method: string;
  order_status: string;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface Stats {
  today_orders: number;
  today_revenue: number;
  month_orders: number;
  month_revenue: number;
  total_products: number;
  pending_orders: number;
}
