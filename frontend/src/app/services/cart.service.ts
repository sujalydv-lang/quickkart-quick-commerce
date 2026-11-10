import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models';

export interface CartItem {
  product: Product;
  quantity: number;   // clamped to 1–20
}

const MAX_QTY = 20;

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  readonly items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  add(product: Product, quantity = 1): void {
    if (product.stockQuantity <= 0) { return; }
    const items = [...this.items];
    const existing = items.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity = Math.min(MAX_QTY, existing.quantity + quantity);
    } else {
      items.push({ product, quantity: Math.min(MAX_QTY, Math.max(1, quantity)) });
    }
    this.itemsSubject.next(items);
  }

  remove(productId: number): void {
    this.itemsSubject.next(this.items.filter((i) => i.product.id !== productId));
  }

  setQuantity(productId: number, quantity: number): void {
    const clamped = Math.min(MAX_QTY, Math.max(1, quantity));
    this.itemsSubject.next(
      this.items.map((i) => (i.product.id === productId ? { ...i, quantity: clamped } : i))
    );
  }

  clear(): void {
    this.itemsSubject.next([]);
  }

  getTotal(): number {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  getCount(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }
}
