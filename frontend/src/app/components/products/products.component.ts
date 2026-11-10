import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, Product } from '../../models';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  allProducts: Product[] = [];
  categories: Category[] = [];
  searchText = '';
  selectedCategoryId = 0;   // 0 = all categories
  page = 1;
  readonly pageSize = PAGE_SIZE;
  loading = true;
  addedMessage = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    public cart: CartService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((cats) => { this.categories = cats; });
    this.productService.getProducts('', 0, 100).subscribe((products) => {
      this.allProducts = products;
      this.loading = false;
    });
  }

  /** Client-side filter (search + category) over the loaded list. */
  get filteredProducts(): Product[] {
    const q = this.searchText.trim().toLowerCase();
    return this.allProducts.filter((p) => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchesCategory = this.selectedCategoryId === 0 || p.categoryId === this.selectedCategoryId;
      return matchesSearch && matchesCategory;
    });
  }

  get pagedProducts(): Product[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  onFilterChange(): void {
    this.page = 1;
  }

  prevPage(): void { if (this.page > 1) { this.page--; } }
  nextPage(): void { if (this.page < this.totalPages) { this.page++; } }

  stockLabel(p: Product): string {
    if (p.stockQuantity <= 0) { return 'Out of stock'; }
    if (p.stockQuantity <= 10) { return 'Low stock'; }
    return 'In stock';
  }

  stockClass(p: Product): string {
    if (p.stockQuantity <= 0) { return 'badge-red'; }
    if (p.stockQuantity <= 10) { return 'badge-yellow'; }
    return 'badge-green';
  }

  categoryName(categoryId: number): string {
    return this.categories.find((c) => c.id === categoryId)?.name ?? '';
  }

  addToCart(p: Product): void {
    this.cart.add(p);
    this.addedMessage = `${p.name} added to cart.`;
    window.setTimeout(() => { this.addedMessage = ''; }, 2500);
  }
}
