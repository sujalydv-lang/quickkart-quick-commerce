import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models';
import { MOCK_PRODUCTS } from '../mock-data';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private api: ApiService) {}

  /** search + pagination params are forwarded to the backend; mock fallback ignores paging. */
  getProducts(search = '', page = 0, size = 10): Observable<Product[]> {
    return this.api.getWithFallback<Product[]>(
      '/products',
      MOCK_PRODUCTS,
      this.api.buildParams(search, page, size)
    );
  }

  getProduct(id: number): Observable<Product> {
    const fallback = MOCK_PRODUCTS.find((p) => p.id === id) ?? MOCK_PRODUCTS[0];
    return this.api.getWithFallback<Product>(`/products/${id}`, fallback);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.api.getWithFallback<Product[]>(
      `/products?categoryId=${categoryId}`,
      MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId)
    );
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.api.post<Product>('/products', product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.api.put<Product>(`/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.api.delete<void>(`/products/${id}`);
  }
}
