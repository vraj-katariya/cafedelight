import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaymentResponse } from '../models/payment.model';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = `${environment.apiUrl}/payments`;

    constructor(private http: HttpClient) { }

    getPayments(): Observable<PaymentResponse> {
        return this.http.get<PaymentResponse>(this.apiUrl);
    }

    getPayment(id: string): Observable<PaymentResponse> {
        return this.http.get<PaymentResponse>(`${this.apiUrl}/${id}`);
    }

    createPayment(orderId: string, method: string, paymentDetails?: any): Observable<PaymentResponse> {
        return this.http.post<PaymentResponse>(this.apiUrl, { orderId, method, paymentDetails });
    }

    updatePaymentStatus(id: string, status: string): Observable<PaymentResponse> {
        return this.http.put<PaymentResponse>(`${this.apiUrl}/${id}/status`, { status });
    }
}
