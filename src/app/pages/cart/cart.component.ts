import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../models/cart.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    cart: Cart | null = null;
    isLoading = true;
    isCheckingOut = false;
    private quantityUpdate$ = new Subject<{ menuItemId: string, quantity: number }>();

    constructor(
        private cartService: CartService,
        private orderService: OrderService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cartService.cart$.subscribe(cart => {
            this.cart = cart;
        });

        // Debounce quantity updates to prevent slamming the server
        this.quantityUpdate$.pipe(
            debounceTime(500), // Wait for user to stop clicking
        ).subscribe(({ menuItemId, quantity }) => {
            this.cartService.updateQuantity(menuItemId, quantity).subscribe();
        });

        this.loadCart();
    }

    loadCart(): void {
        if (!this.cart) {
            this.isLoading = true;
        }
        this.cartService.getCart().subscribe({
            next: (response) => {
                if (response.success && response.cart) {
                    this.cart = response.cart;
                }
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    calculateTotals(): void {
        if (!this.cart) return;

        const subtotal = this.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const gstAmount = subtotal * (this.cart.gstRate / 100);
        const total = subtotal + gstAmount;

        this.cart = {
            ...this.cart,
            subtotal,
            gstAmount,
            total
        };
    }

    updateQuantity(menuItemId: string, quantity: number): void {
        if (quantity < 1) {
            this.removeItem(menuItemId);
            return;
        }

        // Snappy local update (Optimistic)
        if (this.cart) {
            const item = this.cart.items.find(i => i.menuItem._id === menuItemId);
            if (item) {
                item.quantity = quantity;
                this.calculateTotals();
            }
        }

        // Trigger debounced server update
        this.quantityUpdate$.next({ menuItemId, quantity });
    }

    removeItem(menuItemId: string): void {
        // Snappy local update (Optimistic)
        if (this.cart) {
            this.cart.items = this.cart.items.filter(i => i.menuItem._id !== menuItemId);
            this.calculateTotals();
        }
        this.cartService.removeFromCart(menuItemId).subscribe();
    }

    clearCart(): void {
        if (confirm('Are you sure you want to clear the cart?')) {
            this.cartService.clearCart().subscribe({
                next: () => {
                    this.cart = null;
                }
            });
        }
    }

    checkout(): void {
        if (!this.cart || this.cart.items.length === 0) return;

        this.isCheckingOut = true;
        this.orderService.createOrder('', '').subscribe({
            next: (response) => {
                if (response.success && response.order) {
                    this.cartService.resetCart();
                    this.router.navigate(['/orders', response.order._id]);
                }
                this.isCheckingOut = false;
            },
            error: () => {
                this.isCheckingOut = false;
                alert('Failed to create order. Please try again.');
            }
        });
    }

    formatPrice(price: number): string {
        return '₹' + price.toFixed(2);
    }
}
