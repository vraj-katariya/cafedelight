import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, OrderResponse } from '../models/order.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    getOrders(): Observable<OrderResponse> {
        return this.http.get<OrderResponse>(this.apiUrl);
    }

    getOrder(id: string): Observable<OrderResponse> {
        return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`);
    }

    createOrder(deliveryAddress?: string, notes?: string): Observable<OrderResponse> {
        return this.http.post<OrderResponse>(this.apiUrl, { deliveryAddress, notes });
    }

    updateOrderStatus(id: string, status: string): Observable<OrderResponse> {
        return this.http.put<OrderResponse>(`${this.apiUrl}/${id}/status`, { status });
    }

    cancelOrder(id: string): Observable<OrderResponse> {
        return this.http.delete<OrderResponse>(`${this.apiUrl}/${id}`);
    }
}
