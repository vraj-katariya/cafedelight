import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService, Booking } from '../../../services/booking.service';

@Component({
    selector: 'app-admin-booking',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './booking-management.component.html',
    styleUrls: ['./booking-management.component.css']
})
export class BookingManagementComponent implements OnInit {
    bookings: Booking[] = [];
    isLoading = false;

    constructor(private bookingService: BookingService) { }

    ngOnInit() {
        this.loadBookings();
    }

    loadBookings() {
        this.isLoading = true;
        this.bookingService.getAllBookings().subscribe({
            next: (res) => {
                this.bookings = res.data;
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    cancelBooking(id: string) {
        if (confirm('Are you sure you want to cancel this booking?')) {
            this.isLoading = true;
            this.bookingService.cancelBooking(id).subscribe({
                next: () => this.loadBookings(),
                error: () => this.isLoading = false
            });
        }
    }

    confirmBooking(id: string) {
        this.isLoading = true;
        this.bookingService.updateStatus(id, 'Confirmed').subscribe({
            next: () => this.loadBookings(),
            error: () => this.isLoading = false
        });
    }
}
