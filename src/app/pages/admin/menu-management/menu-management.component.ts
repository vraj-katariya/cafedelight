import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuService } from '../../../services/menu.service';
import { MenuItem } from '../../../models/menu.model';

@Component({
    selector: 'app-menu-management',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
    templateUrl: './menu-management.component.html',
    styleUrls: ['./menu-management.component.css']
})
export class MenuManagementComponent implements OnInit {
    menuItems: MenuItem[] = [];
    filteredItems: MenuItem[] = [];
    categories = ['Coffee', 'Beverages', 'Snacks', 'Waffle', 'Cakes'];
    isLoading = true;
    showModal = false;
    editingItem: MenuItem | null = null;
    menuForm: FormGroup;
    searchTerm = '';
    selectedCategory = 'All';
    isSubmitting = false;

    constructor(
        private menuService: MenuService,
        private fb: FormBuilder
    ) {
        this.menuForm = this.fb.group({
            name: ['', [Validators.required]],
            description: ['', [Validators.required]],
            price: ['', [Validators.required, Validators.min(0)]],
            category: ['Coffee', Validators.required],
            image: [''],
            isAvailable: [true],
            isVeg: [true]
        });
    }

    ngOnInit(): void {
        this.loadMenuItems();
    }

    loadMenuItems(): void {
        this.isLoading = true;
        this.menuService.getMenuItems().subscribe({
            next: (response) => {
                if (response.success && response.menuItems) {
                    this.menuItems = response.menuItems;
                    this.filterItems();
                }
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    filterItems(): void {
        let items = this.menuItems;

        if (this.selectedCategory !== 'All') {
            items = items.filter(item => item.category === this.selectedCategory);
        }

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            items = items.filter(item =>
                item.name.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term)
            );
        }

        this.filteredItems = items;
    }

    openAddModal(): void {
        this.editingItem = null;
        this.menuForm.reset({
            category: 'Coffee',
            isAvailable: true,
            isVeg: true
        });
        this.showModal = true;
    }

    openEditModal(item: MenuItem): void {
        this.editingItem = item;
        this.menuForm.patchValue({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            isAvailable: item.isAvailable,
            isVeg: item.isVeg
        });
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.editingItem = null;
    }

    onSubmit(): void {
        if (this.menuForm.invalid) {
            this.menuForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;

        if (this.editingItem) {
            this.menuService.updateMenuItem(this.editingItem._id, this.menuForm.value).subscribe({
                next: () => {
                    this.loadMenuItems();
                    this.closeModal();
                    this.isSubmitting = false;
                },
                error: () => {
                    this.isSubmitting = false;
                    alert('Failed to update item');
                }
            });
        } else {
            this.menuService.createMenuItem(this.menuForm.value).subscribe({
                next: () => {
                    this.loadMenuItems();
                    this.closeModal();
                    this.isSubmitting = false;
                },
                error: () => {
                    this.isSubmitting = false;
                    alert('Failed to create item');
                }
            });
        }
    }

    deleteItem(item: MenuItem): void {
        if (confirm(`Delete "${item.name}"?`)) {
            this.menuService.deleteMenuItem(item._id).subscribe({
                next: () => this.loadMenuItems(),
                error: () => alert('Failed to delete item')
            });
        }
    }

    formatPrice(price: number): string {
        return '₹' + price.toFixed(2);
    }

    get f() {
        return this.menuForm.controls;
    }
}
