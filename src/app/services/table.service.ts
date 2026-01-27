import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Table {
    _id?: string;
    tableNumber: number;
    capacity: number;
    isAvailable: boolean;
    location: string;
}

@Injectable({
    providedIn: 'root'
})
export class TableService {
    private apiUrl = `${environment.apiUrl}/tables`;

    constructor(private http: HttpClient) { }

    getTables(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    createTable(table: Table): Observable<any> {
        return this.http.post(this.apiUrl, table);
    }

    updateTable(id: string, table: Table): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, table);
    }

    deleteTable(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
