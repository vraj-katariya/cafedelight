import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../models/cart.model';

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

    constructor(
        private cartService: CartService,
        private orderService: OrderService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCart();
    }

    loadCart(): void {
        this.isLoading = true;
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

    updateQuantity(menuItemId: string, quantity: number): void {
        if (quantity < 1) {
            this.removeItem(menuItemId);
            return;
        }
        this.cartService.updateQuantity(menuItemId, quantity).subscribe({
            next: () => this.loadCart()
        });
    }

    removeItem(menuItemId: string): void {
        this.cartService.removeFromCart(menuItemId).subscribe({
            next: () => this.loadCart()
        });
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
