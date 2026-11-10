// Mock fallback data — used ONLY when the backend at
// http://localhost:8080 is unreachable, so the UI works standalone
// for the demo. Same products / prices as the backend seed data.
import { Category, Customer, Order, Product } from './models';

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Dairy & Eggs', description: 'Milk, curd, paneer, eggs' },
  { id: 2, name: 'Atta, Rice & Dals', description: 'Flour, rice, pulses' },
  { id: 3, name: 'Vegetables & Fruits', description: 'Fresh vegetables and fruits' },
  { id: 4, name: 'Snacks & Beverages', description: 'Chips, biscuits, cold drinks' },
  { id: 5, name: 'Personal Care', description: 'Soaps, shampoo, skincare' }
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Amul Toned Milk', description: 'Fresh toned milk, pasteurised', price: 56, stockQuantity: 120, unit: '1 L', imageUrl: 'assets/images/milk.jpg', categoryId: 1, active: true },
  { id: 2, name: 'Amul Butter', description: 'Salted butter', price: 58, stockQuantity: 80, unit: '100 g', imageUrl: 'assets/images/butter.jpg', categoryId: 1, active: true },
  { id: 3, name: 'Aashirvaad Atta', description: 'Whole wheat atta', price: 289, stockQuantity: 60, unit: '5 kg', imageUrl: 'assets/images/atta.jpg', categoryId: 2, active: true },
  { id: 4, name: 'India Gate Basmati Rice', description: 'Premium basmati rice', price: 349, stockQuantity: 45, unit: '5 kg', imageUrl: 'assets/images/rice.jpg', categoryId: 2, active: true },
  { id: 5, name: 'Toor Dal', description: 'Unpolished toor dal', price: 165, stockQuantity: 70, unit: '1 kg', imageUrl: 'assets/images/dal.jpg', categoryId: 2, active: true },
  { id: 6, name: 'Onion', description: 'Fresh red onion', price: 38, stockQuantity: 200, unit: '1 kg', imageUrl: 'assets/images/onion.jpg', categoryId: 3, active: true },
  { id: 7, name: 'Tomato', description: 'Fresh desi tomato', price: 32, stockQuantity: 150, unit: '1 kg', imageUrl: 'assets/images/tomato.jpg', categoryId: 3, active: true },
  { id: 8, name: 'Banana', description: 'Robusta banana', price: 48, stockQuantity: 90, unit: '1 dozen', imageUrl: 'assets/images/banana.jpg', categoryId: 3, active: true },
  { id: 9, name: 'Potato', description: 'Fresh potato', price: 28, stockQuantity: 5, unit: '1 kg', imageUrl: 'assets/images/potato.jpg', categoryId: 3, active: true },
  { id: 10, name: "Lays Magic Masala Chips", description: 'Potato chips, magic masala', price: 20, stockQuantity: 300, unit: '52 g', imageUrl: 'assets/images/lays.jpg', categoryId: 4, active: true },
  { id: 11, name: 'Coca-Cola', description: 'Chilled soft drink', price: 40, stockQuantity: 180, unit: '750 ml', imageUrl: 'assets/images/coke.jpg', categoryId: 4, active: true },
  { id: 12, name: 'Parle-G Biscuits', description: 'Glucose biscuits', price: 10, stockQuantity: 0, unit: '200 g', imageUrl: 'assets/images/parleg.jpg', categoryId: 4, active: true },
  { id: 13, name: 'Dove Soap', description: 'Moisturising soap bar', price: 42, stockQuantity: 110, unit: '100 g', imageUrl: 'assets/images/dove.jpg', categoryId: 5, active: true },
  { id: 14, name: 'Colgate MaxFresh Toothpaste', description: 'Toothpaste, 150 g', price: 145, stockQuantity: 65, unit: '150 g', imageUrl: 'assets/images/colgate.jpg', categoryId: 5, active: true }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210', address: 'Koramangala, Bengaluru' },
  { id: 2, name: 'Rahul Verma', email: 'rahul@example.com', phone: '9123456780', address: 'HSR Layout, Bengaluru' },
  { id: 3, name: 'Ananya Iyer', email: 'ananya@example.com', phone: '9988776655', address: 'Indiranagar, Bengaluru' },
  { id: 4, name: 'Arjun Patel', email: 'arjun@example.com', phone: '9001122334', address: 'Whitefield, Bengaluru' }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 1001, customerId: 1, customerName: 'Priya Sharma', orderDate: '2026-11-09T10:15:00',
    status: 'DELIVERED', totalAmount: 384, deliveryAddress: 'Koramangala, Bengaluru',
    deliverySlot: '10:00 AM – 12:00 PM', paymentMethod: 'UPI',
    items: [
      { productId: 1, productName: 'Amul Toned Milk', quantity: 2, price: 56 },
      { productId: 3, productName: 'Aashirvaad Atta', quantity: 1, price: 289 }
    ]
  },
  {
    id: 1002, customerId: 2, customerName: 'Rahul Verma', orderDate: '2026-11-10T08:40:00',
    status: 'OUT_FOR_DELIVERY', totalAmount: 178, deliveryAddress: 'HSR Layout, Bengaluru',
    deliverySlot: '8:00 AM – 10:00 AM', paymentMethod: 'COD',
    items: [
      { productId: 6, productName: 'Onion', quantity: 2, price: 38 },
      { productId: 10, productName: "Lays Magic Masala Chips", quantity: 3, price: 20 },
      { productId: 11, productName: 'Coca-Cola', quantity: 1, price: 40 }
    ]
  },
  {
    id: 1003, customerId: 3, customerName: 'Ananya Iyer', orderDate: '2026-11-10T09:05:00',
    status: 'PACKED', totalAmount: 246, deliveryAddress: 'Indiranagar, Bengaluru',
    deliverySlot: '10:00 AM – 12:00 PM', paymentMethod: 'UPI',
    items: [
      { productId: 8, productName: 'Banana', quantity: 2, price: 48 },
      { productId: 5, productName: 'Toor Dal', quantity: 1, price: 165 }
    ]
  },
  {
    id: 1004, customerId: 4, customerName: 'Arjun Patel', orderDate: '2026-11-08T18:20:00',
    status: 'CONFIRMED', totalAmount: 96, deliveryAddress: 'Whitefield, Bengaluru',
    deliverySlot: '6:00 PM – 8:00 PM', paymentMethod: 'Card',
    items: [
      { productId: 7, productName: 'Tomato', quantity: 1, price: 32 },
      { productId: 9, productName: 'Potato', quantity: 1, price: 28 },
      { productId: 6, productName: 'Onion', quantity: 1, price: 38 }
    ]
  }
];
