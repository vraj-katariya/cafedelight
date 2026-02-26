import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Booking {
    _id?: string;
    table: any;
    user?: any;
    date: Date;
    timeSlot: string;
    guests: number;
    status: string;
    notes?: string;
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private apiUrl = `${environment.apiUrl}/bookings`;

    constructor(private http: HttpClient) { }

    createBooking(booking: Booking): Observable<any> {
        return this.http.post(this.apiUrl, booking);
    }

    checkAvailability(date: string, timeSlot: string, guests: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/availability?date=${date}&timeSlot=${timeSlot}&guests=${guests}`);
    }

    getMyBookings(): Observable<any> {
        return this.http.get(`${this.apiUrl}/my-bookings`);
    }

    getAllBookings(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    cancelBooking(id: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/cancel`, {});
    }

    updateStatus(id: string, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/status`, { status });
    }
}
