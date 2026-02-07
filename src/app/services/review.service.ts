import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Review {
    _id?: string;
    customerName: string;
    rating: number;
    comment: string;
    user?: string;
    date?: Date;
    isApproved?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private apiUrl = `${environment.apiUrl}/reviews`;

    constructor(private http: HttpClient) { }

    getReviews(): Observable<Review[]> {
        return this.http.get<any>(this.apiUrl).pipe(
            map(response => response.data)
        );
    }

    submitReview(review: Review): Observable<Review> {
        return this.http.post<any>(this.apiUrl, review).pipe(
            map(response => response.data)
        );
    }

    updateReview(id: string, review: Partial<Review>): Observable<Review> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, review).pipe(
            map(response => response.data)
        );
    }

    deleteReview(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
