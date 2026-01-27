import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart, CartResponse } from '../models/cart.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private apiUrl = `${environment.apiUrl}/cart`;
    private cartSubject = new BehaviorSubject<Cart | null>(null);
    public cart$ = this.cartSubject.asObservable();

    constructor(private http: HttpClient) { }

    get cartValue(): Cart | null {
        return this.cartSubject.value;
    }

    get itemCount(): number {
        if (!this.cartSubject.value) return 0;
        return this.cartSubject.value.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    getCart(): Observable<CartResponse> {
        return this.http.get<CartResponse>(this.apiUrl).pipe(
            tap(response => {
                if (response.success && response.cart) {
                    this.cartSubject.next(response.cart);
                }
            })
        );
    }

    addToCart(menuItemId: string, quantity: number = 1): Observable<CartResponse> {
        return this.http.post<CartResponse>(`${this.apiUrl}/add`, { menuItemId, quantity }).pipe(
            tap(() => this.getCart().subscribe())
        );
    }

    updateQuantity(menuItemId: string, quantity: number): Observable<CartResponse> {
        return this.http.put<CartResponse>(`${this.apiUrl}/update`, { menuItemId, quantity }).pipe(
            tap(() => this.getCart().subscribe())
        );
    }

    removeFromCart(menuItemId: string): Observable<CartResponse> {
        return this.http.delete<CartResponse>(`${this.apiUrl}/remove/${menuItemId}`).pipe(
            tap(() => this.getCart().subscribe())
        );
    }

    clearCart(): Observable<CartResponse> {
        return this.http.delete<CartResponse>(`${this.apiUrl}/clear`).pipe(
            tap(() => this.cartSubject.next(null))
        );
    }

    resetCart(): void {
        this.cartSubject.next(null);
    }
}
