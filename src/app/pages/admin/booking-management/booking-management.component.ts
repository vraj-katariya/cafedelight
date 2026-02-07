import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService, Booking } from '../../../services/booking.service';

@Component({
    selector: 'app-admin-booking',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './booking-management.component.html',
    styleUrls: ['./booking-management.component.css']
})
export class BookingManagementComponent implements OnInit, OnDestroy {
    bookings: Booking[] = [];
    filteredBookings: Booking[] = [];
    isLoading = false;
    filterDate = '';
    filterStatus = '';
    private pollInterval: any;

    stats = {
        total: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0
    };

    constructor(private bookingService: BookingService) { }

    ngOnInit() {
        this.loadBookings();
        // Start polling every 30 seconds
        this.pollInterval = setInterval(() => {
            this.bookingService.getAllBookings().subscribe(res => {
                this.bookings = res.data;
                this.applyFilters();
            });
        }, 30000);
    }

    ngOnDestroy() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
    }

    loadBookings() {
        this.isLoading = true;
        this.bookingService.getAllBookings().subscribe({
            next: (res) => {
                this.bookings = res.data;
                this.applyFilters();
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    applyFilters() {
        this.filteredBookings = this.bookings.filter(booking => {
            let matchesDate = true;
            let matchesStatus = true;

            if (this.filterDate) {
                // Compare date strings (YYYY-MM-DD)
                const bookingDate = new Date(booking.date).toISOString().split('T')[0];
                matchesDate = bookingDate === this.filterDate;
            }

            if (this.filterStatus) {
                matchesStatus = booking.status === this.filterStatus;
            }

            return matchesDate && matchesStatus;
        });

        this.calculateStats();
    }

    calculateStats() {
        this.stats = {
            total: this.bookings.length,
            pending: this.bookings.filter(b => b.status === 'Pending').length,
            confirmed: this.bookings.filter(b => b.status === 'Confirmed').length,
            cancelled: this.bookings.filter(b => b.status === 'Cancelled').length
        };
    }

    clearFilters() {
        this.filterDate = '';
        this.filterStatus = '';
        this.applyFilters();
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
