import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
    users: User[] = [];
    filteredUsers: User[] = [];
    isLoading = true;
    showModal = false;
    userForm: FormGroup;
    searchTerm = '';
    isSubmitting = false;
    showPassword = false;
    showConfirmPassword = false;

    constructor(
        private adminService: AdminService,
        private fb: FormBuilder
    ) {
        this.userForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            role: ['user', Validators.required],
            phone: [''],
            address: ['']
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

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

    openAddModal(): void {
        this.userForm.reset({ role: 'user' });
        this.showPassword = false;
        this.showConfirmPassword = false;
        this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
        this.userForm.get('password')?.updateValueAndValidity();
        this.userForm.get('confirmPassword')?.updateValueAndValidity();
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.userForm.reset();
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    onSubmit(): void {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        const formData = { ...this.userForm.value };
        delete formData.confirmPassword;

        this.adminService.createUser(formData).subscribe({
            next: () => {
                this.loadUsers();
                this.closeModal();
                this.isSubmitting = false;
            },
            error: (err) => {
                this.isSubmitting = false;
                alert(err.error?.message || 'Failed to create user');
            }
        });
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

    get f() {
        return this.userForm.controls;
    }
}
