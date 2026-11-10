import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order, OrderStatus } from '../models';
import { MOCK_ORDERS } from '../mock-data';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private api: ApiService) {}

  getOrders(search = '', page = 0, size = 10): Observable<Order[]> {
    return this.api.getWithFallback<Order[]>(
      '/orders',
      MOCK_ORDERS,
      this.api.buildParams(search, page, size)
    );
  }

  getOrder(id: number): Observable<Order> {
    const fallback = MOCK_ORDERS.find((o) => o.id === id) ?? MOCK_ORDERS[0];
    return this.api.getWithFallback<Order>(`/orders/${id}`, fallback);
  }

  /** Place an order. Falls back to a local mock order (id 9000+) when the backend is down. */
  createOrder(order: Omit<Order, 'id' | 'orderDate' | 'status'>): Observable<Order> {
    const payload = { ...order, orderDate: new Date().toISOString(), status: 'PLACED' as OrderStatus };
    return this.api.post<Order>('/orders', payload).pipe(
      catchError(() => {
        const mock: Order = { ...payload, id: 9000 + Math.floor(Math.random() * 900) };
        MOCK_ORDERS.unshift(mock);
        return of(mock);
      })
    );
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.api.put<Order>(`/orders/${id}/status`, { status }).pipe(
      catchError(() => {
        const order = MOCK_ORDERS.find((o) => o.id === id);
        if (order) { order.status = status; }
        return of(order ?? MOCK_ORDERS[0]);
      })
    );
  }

  deleteOrder(id: number): Observable<void> {
    return this.api.delete<void>(`/orders/${id}`);
  }
}
