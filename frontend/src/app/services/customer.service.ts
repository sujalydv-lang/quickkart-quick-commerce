import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models';
import { MOCK_CUSTOMERS } from '../mock-data';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private api: ApiService) {}

  getCustomers(search = '', page = 0, size = 10): Observable<Customer[]> {
    return this.api.getWithFallback<Customer[]>(
      '/customers',
      MOCK_CUSTOMERS,
      this.api.buildParams(search, page, size)
    );
  }

  getCustomer(id: number): Observable<Customer> {
    const fallback = MOCK_CUSTOMERS.find((c) => c.id === id) ?? MOCK_CUSTOMERS[0];
    return this.api.getWithFallback<Customer>(`/customers/${id}`, fallback);
  }

  createCustomer(customer: Omit<Customer, 'id'>): Observable<Customer> {
    return this.api.post<Customer>('/customers', customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.api.put<Customer>(`/customers/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.api.delete<void>(`/customers/${id}`);
  }
}
