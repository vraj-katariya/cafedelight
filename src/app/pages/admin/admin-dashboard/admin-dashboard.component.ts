import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, DashboardStats } from '../../../services/admin.service';
import { ReviewService, Review } from '../../../services/review.service';
import { Order } from '../../../models/order.model';
import { User } from '../../../models/user.model';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
    stats: DashboardStats | null = null;
    recentOrders: Order[] = [];
    recentUsers: User[] = [];
    recentBookings: any[] = [];
    recentReviews: Review[] = [];
    topItems: any[] = [];
    isLoading = true;

    constructor(
        private adminService: AdminService,
        private reviewService: ReviewService
    ) { }

    ngOnInit(): void {
        this.loadDashboard();
    }

    loadDashboard(): void {
        this.isLoading = true;

        // Load main dashboard stats
        this.adminService.getDashboard().subscribe({
            next: (response) => {
                if (response.success) {
                    this.stats = response.dashboard.stats;
                    this.recentOrders = response.dashboard.recentOrders;
                    this.recentUsers = response.dashboard.recentUsers;
                    this.recentBookings = response.dashboard.recentBookings;
                    this.topItems = response.dashboard.topItems;
                }
                this.checkLoadingComplete();
            },
            error: () => this.checkLoadingComplete()
        });

        // Load recent reviews separately
        this.reviewService.getReviews().subscribe({
            next: (reviews) => {
                this.recentReviews = reviews.slice(0, 5);
                this.checkLoadingComplete();
            },
            error: () => this.checkLoadingComplete()
        });
    }

    private loadingCount = 0;
    private checkLoadingComplete(): void {
        this.loadingCount++;
        if (this.loadingCount >= 2) {
            this.isLoading = false;
        }
    }

    formatPrice(price: number): string {
        return '₹' + price.toFixed(2);
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getStatusClass(status: string): string {
        const classes: Record<string, string> = {
            'pending': 'status-pending',
            'confirmed': 'status-confirmed',
            'preparing': 'status-preparing',
            'ready': 'status-ready',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled'
        };
        return classes[status] || '';
    }

    getUserName(user: User | string): string {
        if (!user) return 'N/A';
        if (typeof user === 'string') return 'User #' + user.slice(-4);
        return user.name || 'N/A';
    }
}
