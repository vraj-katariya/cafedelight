import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { TableService, Table } from '../../services/table.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-booking',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.css']
})
export class BookingComponent {
    bookingForm: FormGroup;
    availableTables: Table[] = [];
    selectedTable: Table | null = null;
    timeSlots: string[] = ['10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '18:00-19:00', '19:00-20:00', '20:00-21:00'];
    minDate: string = new Date().toISOString().split('T')[0];
    loading = false;
    searched = false;
    totalTablesCount = 0;
    message = '';

    constructor(
        private fb: FormBuilder,
        private bookingService: BookingService,
        private authService: AuthService,
        private tableService: TableService,
        private router: Router
    ) {
        this.bookingForm = this.fb.group({
            date: ['', Validators.required],
            timeSlot: ['', Validators.required],
            guests: [2, [Validators.required, Validators.min(1)]],
            notes: ['']
        });
        this.checkInitialTables();
    }

    checkInitialTables() {
        this.tableService.getTables().subscribe(res => {
            this.totalTablesCount = res.data.length;
        });
    }

    checkAvailability() {
        if (this.bookingForm.invalid) return;

        const { date, timeSlot, guests } = this.bookingForm.value;
        const now = new Date();
        const selectedDate = new Date(date);

        // Simple past-time check for today
        if (selectedDate.toDateString() === now.toDateString()) {
            const startHour = parseInt(timeSlot.split(':')[0]);
            if (now.getHours() >= startHour) {
                this.message = 'Selected time slot has already passed for today.';
                return;
            }
        }

        this.loading = true;
        this.searched = true;
        this.message = '';

        this.bookingService.checkAvailability(date, timeSlot).subscribe({
            next: (res) => {
                this.availableTables = res.data;
                this.loading = false;
                this.selectedTable = null; // Reset selection
                if (this.availableTables.length === 0) {
                    this.message = 'No tables available for ' + guests + ' guests at this time.';
                }
            },
            error: (err) => {
                this.message = err.error.message || 'Error checking availability';
                this.loading = false;
            }
        });
    }

    selectTable(table: Table) {
        this.selectedTable = table;
    }

    confirmBooking() {
        if (!this.selectedTable) return;

        const bookingData = {
            ...this.bookingForm.value,
            table: this.selectedTable._id
        };

        this.bookingService.createBooking(bookingData).subscribe({
            next: (res) => {
                alert('Booking Confirmed!');
                this.authService.setHasBooking(true);
                this.router.navigate(['/menu']);
            },
            error: (err) => {
                this.message = err.error.message || 'Booking Failed';
            }
        });
    }
}
