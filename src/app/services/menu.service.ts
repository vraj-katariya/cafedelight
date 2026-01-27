import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MenuItem, MenuResponse } from '../models/menu.model';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private apiUrl = `${environment.apiUrl}/menu`;

    constructor(private http: HttpClient) { }

    getMenuItems(category?: string): Observable<MenuResponse> {
        let params = new HttpParams();
        if (category) {
            params = params.set('category', category);
        }
        return this.http.get<MenuResponse>(this.apiUrl, { params });
    }

    getCategories(): Observable<{ success: boolean; categories: string[] }> {
        return this.http.get<{ success: boolean; categories: string[] }>(`${this.apiUrl}/categories`);
    }

    getMenuItem(id: string): Observable<MenuResponse> {
        return this.http.get<MenuResponse>(`${this.apiUrl}/${id}`);
    }

    createMenuItem(item: Partial<MenuItem>): Observable<MenuResponse> {
        return this.http.post<MenuResponse>(this.apiUrl, item);
    }

    updateMenuItem(id: string, item: Partial<MenuItem>): Observable<MenuResponse> {
        return this.http.put<MenuResponse>(`${this.apiUrl}/${id}`, item);
    }

    deleteMenuItem(id: string): Observable<MenuResponse> {
        return this.http.delete<MenuResponse>(`${this.apiUrl}/${id}`);
    }
}
