import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { Order } from '../../models/order.model';
import { ReviewComponent } from '../../components/review/review.component';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReviewComponent],
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
    orders: Order[] = [];
    selectedOrder: Order | null = null;

    isLoading = true;
    isProcessingPayment = false;
    showPaymentModal = false;

    paymentMethod: string = '';
    paymentData = {
        upiId: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    };
    paymentErrors = {
        upiId: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    };
    showReviewModal = false;

    constructor(
        private orderService: OrderService,
        private paymentService: PaymentService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadOrders();

        this.route.params.subscribe((params) => {
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
            },
        });
    }

    loadOrderDetails(id: string): void {
        this.orderService.getOrder(id).subscribe({
            next: (response: any) => {
                if (response.success && response.order) {
                    this.selectedOrder = response.order;
                    this.showPaymentModal = response.order.paymentStatus === 'pending';
                }
            },
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
        this.paymentData = {
            upiId: '',
            cardNumber: '',
            expiry: '',
            cvv: ''
        };
        this.paymentErrors = { upiId: '', cardNumber: '', expiry: '', cvv: '' };
    }

    validatePayment(): boolean {
        let isValid = true;
        this.paymentErrors = { upiId: '', cardNumber: '', expiry: '', cvv: '' };

        if (!this.paymentMethod) return false;

        if (this.paymentMethod === 'upi') {
            const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
            if (!this.paymentData.upiId) {
                this.paymentErrors.upiId = 'UPI ID is required';
                isValid = false;
            } else if (!upiRegex.test(this.paymentData.upiId)) {
                this.paymentErrors.upiId = 'Please enter a valid UPI ID (e.g. name@bank)';
                isValid = false;
            }
        }

        if (this.paymentMethod === 'card') {
            // Card Number Validation (16 digits)
            const cardSanitized = this.paymentData.cardNumber.replace(/\s+/g, '');
            const cardRegex = /^\d{16}$/;
            if (!this.paymentData.cardNumber) {
                this.paymentErrors.cardNumber = 'Card number is required';
                isValid = false;
            } else if (!cardRegex.test(cardSanitized)) {
                this.paymentErrors.cardNumber = 'Please enter a valid 16-digit card number';
                isValid = false;
            }

            // Expiry Validation (MM/YY format and future date)
            const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!this.paymentData.expiry) {
                this.paymentErrors.expiry = 'Expiry date is required';
                isValid = false;
            } else if (!expiryRegex.test(this.paymentData.expiry)) {
                this.paymentErrors.expiry = 'Format must be MM/YY';
                isValid = false;
            } else {
                const parts = this.paymentData.expiry.split('/');
                const month = parseInt(parts[0], 10);
                const year = parseInt(parts[1], 10);
                const expiryDate = new Date(2000 + year, month - 1);
                const today = new Date();
                today.setDate(1); // Compare only month/year
                today.setHours(0, 0, 0, 0);
                if (expiryDate < today) {
                    this.paymentErrors.expiry = 'Card has expired';
                    isValid = false;
                }
            }

            // CVV Validation (3 or 4 digits)
            const cvvRegex = /^\d{3,4}$/;
            if (!this.paymentData.cvv) {
                this.paymentErrors.cvv = 'CVV is required';
                isValid = false;
            } else if (!cvvRegex.test(this.paymentData.cvv)) {
                this.paymentErrors.cvv = 'Invalid CVV';
                isValid = false;
            }
        }

        return isValid;
    }

    processPayment(): void {
        if (!this.selectedOrder || !this.paymentMethod) return;

        if (!this.validatePayment()) {
            return;
        }

        const orderId = this.selectedOrder._id;
        const method = this.paymentMethod;

        this.isProcessingPayment = true;

        this.paymentService.createPayment(orderId, method).subscribe({
            next: (response: any) => {
                if (response.success) {
                    const currentOrder = this.selectedOrder;
                    this.loadOrders();
                    this.closePaymentModal();
                    alert('Payment successful!');
                    if (currentOrder) {
                        this.openReviewModal(currentOrder);
                    }
                }
                this.isProcessingPayment = false;
            },
            error: () => {
                this.isProcessingPayment = false;
                alert('Payment failed. Please try again.');
            },
        });
    }

    // ================= REVIEWS =================

    openReviewModal(order: Order): void {
        this.selectedOrder = order;
        this.showReviewModal = true;
    }

    closeReviewModal(): void {
        this.showReviewModal = false;
        this.selectedOrder = null;
    }

    onReviewSubmitted(): void {
        this.closeReviewModal();
        this.loadOrders(); // Reload to get updated isReviewed flag
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
                },
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
            cancelled: 'status-cancelled',
        };
        return classes[status] || '';
    }

    formatPrice(price: number): string {
        return '₹' + price.toFixed(2);
    }

    formatDate(date: any): string {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
}
