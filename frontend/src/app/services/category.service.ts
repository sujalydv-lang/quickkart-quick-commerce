import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models';
import { MOCK_CATEGORIES } from '../mock-data';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private api: ApiService) {}

  getCategories(): Observable<Category[]> {
    return this.api.getWithFallback<Category[]>('/categories', MOCK_CATEGORIES);
  }

  getCategory(id: number): Observable<Category> {
    const fallback = MOCK_CATEGORIES.find((c) => c.id === id) ?? MOCK_CATEGORIES[0];
    return this.api.getWithFallback<Category>(`/categories/${id}`, fallback);
  }

  createCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return this.api.post<Category>('/categories', category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.api.put<Category>(`/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.api.delete<void>(`/categories/${id}`);
  }
}
