import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    private hasBookingSubject = new BehaviorSubject<boolean>(false);
    public hasBooking$ = this.hasBookingSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage(): void {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            this.currentUserSubject.next(JSON.parse(user));
        }
    }

    get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    get isLoggedIn(): boolean {
        return !!this.currentUserSubject.value;
    }

    get isAdmin(): boolean {
        return this.currentUserSubject.value?.role === 'admin';
    }

    get token(): string | null {
        return localStorage.getItem('token');
    }

    setHasBooking(val: boolean) {
        this.hasBookingSubject.next(val);
    }

    get hasBooking(): boolean {
        return this.hasBookingSubject.value;
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
            tap(response => {
                if (response.success && response.token && response.user) {
                    this.setSession(response.token, response.user);
                }
            })
        );
    }

    login(data: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
            tap(response => {
                if (response.success && response.token && response.user) {
                    this.setSession(response.token, response.user);
                }
            })
        );
    }

    getProfile(): Observable<AuthResponse> {
        return this.http.get<AuthResponse>(`${this.apiUrl}/me`);
    }

    private setSession(token: string, user: User): void {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }

    updateCurrentUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }
}
