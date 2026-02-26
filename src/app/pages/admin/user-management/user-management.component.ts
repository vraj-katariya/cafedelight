import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
    users: User[] = [];
    filteredUsers: User[] = [];
    isLoading = true;
    searchTerm = '';

    constructor(
        private adminService: AdminService
    ) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.isLoading = true;
        this.adminService.getUsers().subscribe({
            next: (response) => {
                if (response.success) {
                    this.users = response.users;
                    this.filterUsers();
                }
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    filterUsers(): void {
        if (!this.searchTerm) {
            this.filteredUsers = this.users;
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredUsers = this.users.filter(user =>
                user.name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term)
            );
        }
    }

    deleteUser(user: User): void {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            this.adminService.deleteUser(user._id).subscribe({
                next: () => {
                    this.loadUsers();
                },
                error: (err) => {
                    alert(err.error?.message || 'Failed to delete user');
                }
            });
        }
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
}
