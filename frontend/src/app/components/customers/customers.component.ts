import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Customer } from '../../models';
import { CustomerService } from '../../services/customer.service';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  allCustomers: Customer[] = [];
  searchText = '';
  page = 1;
  readonly pageSize = PAGE_SIZE;
  loading = true;
  message = '';
  errorMessage = '';

  // Add / edit form. editingId === null means "add new".
  showForm = false;
  editingId: number | null = null;
  customerForm: FormGroup;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder
  ) {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getCustomers('', 0, 100).subscribe((customers) => {
      this.allCustomers = customers;
      this.loading = false;
    });
  }

  get name() { return this.customerForm.get('name'); }
  get email() { return this.customerForm.get('email'); }
  get phone() { return this.customerForm.get('phone'); }
  get address() { return this.customerForm.get('address'); }

  get filteredCustomers(): Customer[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) { return this.allCustomers; }
    return this.allCustomers.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  }

  get pagedCustomers(): Customer[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredCustomers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCustomers.length / this.pageSize));
  }

  onSearchChange(): void { this.page = 1; }
  prevPage(): void { if (this.page > 1) { this.page--; } }
  nextPage(): void { if (this.page < this.totalPages) { this.page++; } }

  openAddForm(): void {
    this.editingId = null;
    this.customerForm.reset();
    this.showForm = true;
    this.errorMessage = '';
  }

  openEditForm(customer: Customer): void {
    this.editingId = customer.id;
    this.customerForm.setValue({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
    this.showForm = true;
    this.errorMessage = '';
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.customerForm.reset();
  }

  saveCustomer(): void {
    this.message = '';
    this.errorMessage = '';
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    const value = this.customerForm.value as Omit<Customer, 'id'>;
    if (this.editingId === null) {
      this.customerService.createCustomer(value).subscribe({
        next: (created) => {
          // Backend may not return the new id in mock mode; fall back to a local id.
          const withId: Customer = { ...value, id: created?.id ?? this.nextLocalId() };
          this.allCustomers = [withId, ...this.allCustomers];
          this.message = `${withId.name} added.`;
          this.cancelForm();
        },
        error: () => {
          const withId: Customer = { ...value, id: this.nextLocalId() };
          this.allCustomers = [withId, ...this.allCustomers];
          this.message = `${withId.name} added (saved locally — backend unreachable).`;
          this.cancelForm();
        }
      });
    } else {
      const id = this.editingId;
      this.customerService.updateCustomer(id, { ...value, id }).subscribe({
        next: (updated) => {
          this.allCustomers = this.allCustomers.map((c) => (c.id === id ? updated : c));
          this.message = `${updated.name} updated.`;
          this.cancelForm();
        },
        error: () => {
          this.allCustomers = this.allCustomers.map((c) => (c.id === id ? { ...value, id } : c));
          this.message = `${value.name} updated (saved locally — backend unreachable).`;
          this.cancelForm();
        }
      });
    }
  }

  deleteCustomer(customer: Customer): void {
    if (!window.confirm(`Delete ${customer.name}?`)) { return; }
    this.customerService.deleteCustomer(customer.id).subscribe({
      next: () => {
        this.allCustomers = this.allCustomers.filter((c) => c.id !== customer.id);
        this.message = `${customer.name} deleted.`;
      },
      error: () => {
        this.allCustomers = this.allCustomers.filter((c) => c.id !== customer.id);
        this.message = `${customer.name} deleted (locally — backend unreachable).`;
      }
    });
  }

  private nextLocalId(): number {
    return Math.max(0, ...this.allCustomers.map((c) => c.id)) + 1;
  }
}
