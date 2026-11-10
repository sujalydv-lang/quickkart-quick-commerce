import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Customer, Order, Product } from '../../models';
import { CustomerService } from '../../services/customer.service';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';

interface MonthBar { label: string; count: number; heightPct: number; }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  readonly Math = Math;
  totalProducts = 0;
  totalCustomers = 0;
  totalOrders = 0;
  monthlyRevenue = 0;
  recentOrders: Order[] = [];
  topProducts: Product[] = [];
  monthBars: MonthBar[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts('', 0, 100).subscribe((products) => {
      this.totalProducts = products.length;
      // Top 5 by stock (proxy for best-stocked / best-selling in the demo).
      this.topProducts = [...products]
        .sort((a, b) => b.stockQuantity - a.stockQuantity)
        .slice(0, 5);
      this.checkLoaded();
    });
    this.customerService.getCustomers('', 0, 100).subscribe((customers: Customer[]) => {
      this.totalCustomers = customers.length;
      this.checkLoaded();
    });
    this.orderService.getOrders('', 0, 100).subscribe((orders: Order[]) => {
      this.totalOrders = orders.length;
      this.recentOrders = [...orders]
        .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        .slice(0, 5);
      // Monthly revenue: orders in the current calendar month, excluding cancelled.
      const now = new Date();
      this.monthlyRevenue = orders
        .filter((o) => {
          const d = new Date(o.orderDate);
          return o.status !== 'CANCELLED' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, o) => sum + o.totalAmount, 0);
      this.monthBars = this.buildMonthBars(orders);
      this.checkLoaded();
    });
  }

  private loadedCount = 0;
  private checkLoaded(): void {
    this.loadedCount++;
    if (this.loadedCount >= 3) { this.loading = false; }
  }

  private buildMonthBars(orders: Order[]): MonthBar[] {
    // Last 6 calendar months, oldest first.
    const months: MonthBar[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('en-IN', { month: 'short' });
      const count = orders.filter((o) => {
        const od = new Date(o.orderDate);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      }).length;
      months.push({ label, count, heightPct: 0 });
    }
    const max = Math.max(1, ...months.map((m) => m.count));
    months.forEach((m) => { m.heightPct = Math.round((m.count / max) * 100); });
    return months;
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
