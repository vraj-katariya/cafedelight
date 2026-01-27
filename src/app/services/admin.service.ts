import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';

export interface DashboardStats {
    totalUsers: number;
    totalOrders: number;
    totalMenuItems: number;
    totalRevenue: number;
    todaysBookings: number;
    totalTables: number;
    availableTables: number;
}

export interface DashboardResponse {
    success: boolean;
    dashboard: {
        stats: DashboardStats;
        orderStats: any[];
        recentOrders: Order[]; // Changed from any[] to Order[]
        recentUsers: User[];
        recentBookings: any[];
        dailyRevenue: any[];
        topItems: any[];
    };
}

export interface UserListResponse {
    success: boolean;
    count: number;
    users: User[];
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getDashboard(): Observable<DashboardResponse> {
        return this.http.get<DashboardResponse>(`${this.apiUrl}/admin/dashboard`);
    }

    getUsers(): Observable<UserListResponse> {
        return this.http.get<UserListResponse>(`${this.apiUrl}/users`);
    }

    getUser(id: string): Observable<{ success: boolean; user: User }> {
        return this.http.get<{ success: boolean; user: User }>(`${this.apiUrl}/users/${id}`);
    }

    createUser(user: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/users`, user);
    }

    updateUser(id: string, user: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/users/${id}`, user);
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/users/${id}`);
    }
}
