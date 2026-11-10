import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Order } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  checkoutForm: FormGroup;
  placedOrder: Order | null = null;
  errorMessage = '';
  submitting = false;

  readonly deliverySlots = [
    '8:00 AM – 10:00 AM',
    '10:00 AM – 12:00 PM',
    '12:00 PM – 2:00 PM',
    '4:00 PM – 6:00 PM',
    '6:00 PM – 8:00 PM'
  ];

  constructor(
    public cart: CartService,
    private fb: FormBuilder,
    private orderService: OrderService,
    private auth: AuthService
  ) {
    this.checkoutForm = this.fb.group({
      deliveryAddress: ['', [Validators.required, Validators.minLength(10)]],
      deliverySlot: [this.deliverySlots[1], Validators.required],
      paymentMethod: ['UPI', Validators.required]
    });
  }

  ngOnInit(): void {}

  get deliveryAddress() { return this.checkoutForm.get('deliveryAddress'); }

  increase(productId: number, qty: number): void {
    this.cart.setQuantity(productId, qty + 1);
  }

  decrease(productId: number, qty: number): void {
    if (qty <= 1) { this.cart.remove(productId); return; }
    this.cart.setQuantity(productId, qty - 1);
  }

  placeOrder(): void {
    this.errorMessage = '';
    if (this.cart.items.length === 0) {
      this.errorMessage = 'Your cart is empty.';
      return;
    }
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const user = this.auth.getCurrentUser();
    const form = this.checkoutForm.value;
    const deliveryAddress: string = form.deliveryAddress ?? '';
    const deliverySlot: string = form.deliverySlot ?? this.deliverySlots[1];
    const paymentMethod = (form.paymentMethod ?? 'UPI') as 'UPI' | 'COD' | 'Card';
    this.orderService.createOrder({
      customerId: user?.id ?? 1,
      customerName: user?.name ?? 'Customer',
      totalAmount: this.cart.getTotal(),
      deliveryAddress,
      deliverySlot,
      paymentMethod,
      items: this.cart.items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        price: i.product.price
      }))
    }).subscribe({
      next: (order) => {
        this.submitting = false;
        this.placedOrder = order;
        this.cart.clear();
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'Could not place the order. Please try again.';
      }
    });
  }

  startNewOrder(): void {
    this.placedOrder = null;
    this.checkoutForm.reset({ deliverySlot: this.deliverySlots[1], paymentMethod: 'UPI' });
  }
}
