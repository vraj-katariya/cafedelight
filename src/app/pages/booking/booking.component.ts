import { Component, OnInit, HostListener } from '@angular/core';
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
    timeSlots: string[] = [
        '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00',
        '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00',
        '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00'
    ];
    availableTimeSlots: string[] = [];
    minDate: string = new Date().toISOString().split('T')[0];
    isDropdownOpen = false;
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
        this.availableTimeSlots = [...this.timeSlots]; // Default all
        this.bookingForm = this.fb.group({
            date: ['', Validators.required],
            timeSlot: ['', Validators.required],
            guests: [2, [Validators.required, Validators.min(1)]],
            notes: ['']
        });

        // Listen to date changes
        this.bookingForm.get('date')?.valueChanges.subscribe(date => {
            this.updateTimeSlots(date);
        });

        this.checkInitialTables();
    }

    updateTimeSlots(dateStr: string) {
        if (!dateStr) return;

        const selectedDate = new Date(dateStr);
        const now = new Date();

        // If today, filter past slots
        if (selectedDate.toDateString() === now.toDateString()) {
            const currentHour = now.getHours();
            this.availableTimeSlots = this.timeSlots.filter(slot => {
                const startHour = parseInt(slot.split(':')[0]);
                return startHour > currentHour;
            });
        } else {
            this.availableTimeSlots = [...this.timeSlots];
        }

        // Reset selected slot if it's no longer available
        const currentSlot = this.bookingForm.get('timeSlot')?.value;
        if (currentSlot && !this.availableTimeSlots.includes(currentSlot)) {
            this.bookingForm.patchValue({ timeSlot: '' });
        }
    }

    selectTimeSlot(slot: string) {
        this.bookingForm.patchValue({ timeSlot: slot });
        this.isDropdownOpen = false;
        this.message = '';
        // After selecting slot, automatically trigger availability check if date and guests are valid
        if (this.bookingForm.get('date')?.valid && this.bookingForm.get('guests')?.valid) {
            this.checkAvailability();
        }
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (!(event.target as HTMLElement).closest('.custom-dropdown')) {
            this.isDropdownOpen = false;
        }
    }

    checkInitialTables() {
        this.tableService.getTables().subscribe(res => {
            this.totalTablesCount = res.data.length;
        });
    }

    checkAvailability() {
        if (this.bookingForm.invalid) {
            const controls = this.bookingForm.controls;
            if (controls['date'].invalid) {
                this.message = 'Please select a date for your reservation.';
            } else if (controls['timeSlot'].invalid) {
                this.message = 'Please select a preferred time slot.';
            } else if (controls['guests'].invalid) {
                this.message = 'Please specify the number of guests.';
            } else {
                this.message = 'Please fill in all required fields.';
            }
            return;
        }

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

        this.bookingService.checkAvailability(date, timeSlot, guests).subscribe({
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
                this.authService.setHasBooking(true);
                this.router.navigate(['/booking-success']);
            },
            error: (err) => {
                this.message = err.error.message || 'Booking Failed';
            }
        });
    }
}
