import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ORDER_STATUSES, Order, OrderStatus } from '../../models';
import { OrderService } from '../../services/order.service';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  allOrders: Order[] = [];
  searchText = '';
  selectedStatus = '';   // '' = all statuses
  page = 1;
  readonly pageSize = PAGE_SIZE;
  readonly statuses = ORDER_STATUSES;
  loading = true;
  updateMessage = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders('', 0, 100).subscribe((orders) => {
      this.allOrders = [...orders].sort(
        (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );
      this.loading = false;
    });
  }

  /** Search by order id, customer name, or date (YYYY-MM-DD / dd MMM yyyy). */
  get filteredOrders(): Order[] {
    const q = this.searchText.trim().toLowerCase();
    return this.allOrders.filter((o) => {
      const matchesStatus = !this.selectedStatus || o.status === this.selectedStatus;
      if (!q) { return matchesStatus; }
      const dateText = new Date(o.orderDate).toISOString().slice(0, 10);
      const dateLabel = new Date(o.orderDate).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      }).toLowerCase();
      const matchesSearch =
        String(o.id).includes(q) ||
        (o.customerName ?? '').toLowerCase().includes(q) ||
        dateText.includes(q) ||
        dateLabel.includes(q);
      return matchesStatus && matchesSearch;
    });
  }

  get pagedOrders(): Order[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredOrders.length / this.pageSize));
  }

  onFilterChange(): void { this.page = 1; }
  prevPage(): void { if (this.page > 1) { this.page--; } }
  nextPage(): void { if (this.page < this.totalPages) { this.page++; } }

  onStatusChange(order: Order, newStatus: string): void {
    const status = newStatus as OrderStatus;
    this.orderService.updateOrderStatus(order.id, status).subscribe((updated) => {
      order.status = updated.status;
      this.updateMessage = `Order #${order.id} updated to ${status}.`;
      window.setTimeout(() => { this.updateMessage = ''; }, 2500);
    });
  }

  statusClass(status: string): string {
    switch (status) {
      case 'DELIVERED': return 'badge-green';
      case 'CANCELLED': return 'badge-red';
      case 'OUT_FOR_DELIVERY': return 'badge-yellow';
      default: return 'badge-grey';
    }
  }
}
