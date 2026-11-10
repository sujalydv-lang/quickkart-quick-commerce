// Shared interfaces — field names match the backend API
// (GET/POST/PUT/DELETE /api/categories, /api/products, /api/customers, /api/orders).

export type Role = 'admin' | 'customer';

export interface User {
  id?: number;
  name: string;
  email: string;
  role: Role;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;          // INR
  stockQuantity: number;
  unit: string;           // e.g. "1 L", "1 kg", "200 g"
  imageUrl: string;
  categoryId: number;
  active: boolean;
}

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PACKED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export const ORDER_STATUSES: OrderStatus[] = [
  'PLACED',
  'CONFIRMED',
  'PACKED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED'
];

export interface OrderItem {
  id?: number;
  productId: number;
  productName?: string;
  quantity: number;
  price: number;          // unit price at order time (INR)
}

export interface Order {
  id: number;
  customerId: number;
  customerName?: string;
  orderDate: string;      // ISO date string
  status: OrderStatus;
  totalAmount: number;    // INR
  deliveryAddress: string;
  deliverySlot?: string;
  paymentMethod?: 'UPI' | 'COD' | 'Card';
  items: OrderItem[];
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;          // 10-digit Indian mobile
  address: string;
}

// Paged list shape returned by the backend for list endpoints.
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;         // current page, 0-based
  size: number;
}
