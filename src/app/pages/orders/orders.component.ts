import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { Order } from '../../models/order.model';

@Component({
    selector: 'app-orders',
    standalone: true,

    // 🔴 IMPORTANT FIX: FormsModule ADD કરેલું
    imports: [CommonModule, RouterModule, FormsModule],

    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

    orders: Order[] = [];
    selectedOrder: Order | null = null;

    isLoading = true;
    isProcessingPayment = false;
    showPaymentModal = false;

    paymentMethod: string = '';

    constructor(
        private orderService: OrderService,
        private paymentService: PaymentService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadOrders();

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.loadOrderDetails(params['id']);
            }
        });
    }

    // ================= ORDERS =================

    loadOrders(): void {
        this.isLoading = true;

        this.orderService.getOrders().subscribe({
            next: (response: any) => {
                if (response.success && response.orders) {
                    this.orders = response.orders;
                }
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    loadOrderDetails(id: string): void {
        this.orderService.getOrder(id).subscribe({
            next: (response: any) => {
                if (response.success && response.order) {
                    this.selectedOrder = response.order;
                    this.showPaymentModal = response.order.paymentStatus === 'pending';
                }
            }
        });
    }

    // ================= PAYMENT =================

    openPaymentModal(order: Order): void {
        this.selectedOrder = order;
        this.showPaymentModal = true;
    }

    closePaymentModal(): void {
        this.showPaymentModal = false;
        this.paymentMethod = '';
    }

    processPayment(): void {
        if (!this.selectedOrder || !this.paymentMethod) return;

        this.isProcessingPayment = true;

        this.paymentService
            .createPayment(this.selectedOrder._id, this.paymentMethod)
            .subscribe({
                next: (response: any) => {
                    if (response.success) {
                        this.loadOrders();
                        this.closePaymentModal();
                        alert('Payment successful!');
                    }
                    this.isProcessingPayment = false;
                },
                error: () => {
                    this.isProcessingPayment = false;
                    alert('Payment failed. Please try again.');
                }
            });
    }

    // ================= CANCEL =================

    cancelOrder(orderId: string): void {
        if (confirm('Are you sure you want to cancel this order?')) {
            this.orderService.cancelOrder(orderId).subscribe({
                next: () => {
                    this.loadOrders();
                },
                error: () => {
                    alert('Failed to cancel order');
                }
            });
        }
    }

    // ================= HELPERS =================

    getStatusClass(status: string): string {
        const classes: Record<string, string> = {
            pending: 'status-pending',
            confirmed: 'status-confirmed',
            preparing: 'status-preparing',
            ready: 'status-ready',
            delivered: 'status-delivered',
            cancelled: 'status-cancelled'
        };
        return classes[status] || '';
    }

    formatPrice(price: number): string {
        return '₹' + price.toFixed(2);
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
