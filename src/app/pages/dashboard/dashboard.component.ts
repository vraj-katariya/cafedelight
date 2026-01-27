import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

import { BookingService, Booking } from '../../services/booking.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    user: User | null = null;
    myBookings: Booking[] = [];

    constructor(
        private authService: AuthService,
        private bookingService: BookingService
    ) { }

    ngOnInit(): void {
        this.user = this.authService.currentUserValue;
        this.loadMyBookings();
    }

    loadMyBookings() {
        this.bookingService.getMyBookings().subscribe({
            next: (res) => {
                this.myBookings = res.data;
            },
            error: (err) => console.error(err)
        });
    }

    cancelBooking(id: string) {
        if (confirm('Are you sure you want to cancel this booking?')) {
            this.bookingService.cancelBooking(id).subscribe(() => {
                this.loadMyBookings();
                // Check if any active bookings remain
                this.bookingService.getMyBookings().subscribe(res => {
                    const hasActive = res.data.some((b: any) => b.status !== 'Cancelled');
                    this.authService.setHasBooking(hasActive);
                });
            });
        }
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
}
