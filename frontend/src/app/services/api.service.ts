import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Thin HttpClient wrapper. baseUrl points at the Spring Boot backend.
 * Every GET falls back to caller-supplied mock data when the backend
 * is unreachable, so the UI works standalone for the demo.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  /** Build ?search=&page=&size= params; skips empty values. */
  buildParams(search?: string, page?: number, size?: number): HttpParams {
    let params = new HttpParams();
    if (search) { params = params.set('search', search); }
    if (page !== undefined) { params = params.set('page', String(page)); }
    if (size !== undefined) { params = params.set('size', String(size)); }
    return params;
  }

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params });
  }

  /** GET with mock fallback on any error (backend down / CORS / network). */
  getWithFallback<T>(path: string, fallback: T, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params }).pipe(
      catchError((err) => {
        console.warn(`Backend unreachable (${path}), using mock data.`, err?.message ?? err);
        return of(fallback);
      })
    );
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }
}
