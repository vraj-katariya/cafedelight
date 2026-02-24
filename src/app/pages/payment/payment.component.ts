import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { OrderService } from '../../services/order.service';

@Component({
    selector: 'app-payment',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './payment.component.html',
    styles: [`
    .container { max-width: 600px; margin: 4rem auto; padding: 3rem; border: 1px solid #000000; border-radius: 0; background: #fff; box-shadow: 10px 10px 0 #000; }
    .method-card { border: 1px solid #eee; padding: 1.5rem; margin: 1rem 0; cursor: pointer; border-radius: 0; font-weight: 700; transition: all 0.2s; }
    .selected { background-color: #000000; border-color: #000000; color: #fff; }
    .order-summary { background: #f9f9f9; padding: 1.5rem; margin-bottom: 2rem; border: 1px solid #eee; }
  `]
})
export class PaymentComponent implements OnInit {
    orderId: string = '';
    order: any = null;
    paymentForm: FormGroup;
    selectedMethod: string = 'card';
    message = '';
    isLoading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private paymentService: PaymentService, // Ensure this service exists and has createPayment
        private orderService: OrderService,
        private fb: FormBuilder
    ) {
        this.paymentForm = this.fb.group({
            paymentDetails: ['Test Payment Details']
        });
    }

    ngOnInit() {
        this.orderId = this.route.snapshot.paramMap.get('id') || '';
        if (this.orderId) {
            this.loadOrder();
        }
    }

    loadOrder() {
        this.orderService.getOrder(this.orderId).subscribe({
            next: (res) => {
                // Handle different response structures gracefully
                this.order = (res as any).data || (res as any).order || res;
                if (!this.order) {
                    this.message = 'Order not found';
                }
            },
            error: (err) => this.message = 'Error loading order'
        });
    }

    selectMethod(method: string) {
        this.selectedMethod = method;
    }

    processPayment() {
        if (!this.orderId) return;
        this.isLoading = true;

        const paymentData = {
            orderId: this.orderId,
            method: this.selectedMethod,
            paymentDetails: {
                ...this.paymentForm.value,
                simulation: true
            }
        };

        // Correct signature: createPayment(orderId, method, paymentDetails)
        this.paymentService.createPayment(
            this.orderId,
            this.selectedMethod,
            { ...this.paymentForm.value, simulation: true }
        ).subscribe({
            next: (res) => {
                alert('Payment Successful!');
                this.router.navigate(['/orders']);
            },
            error: (err) => {
                this.message = 'Payment Failed: ' + (err.error?.message || err.message);
                this.isLoading = false;
            }
        });
    }
}
