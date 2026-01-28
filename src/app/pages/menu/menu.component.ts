import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from '../../models/menu.model';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    menuItems: MenuItem[] = [];
    filteredItems: MenuItem[] = [];
    categories = ['All', 'Coffee', 'Beverages', 'Snacks', 'Waffle', 'Cakes'];
    selectedCategory = 'All';
    isLoading = true;
    addingToCart: string | null = null;
    failedImages = new Set<string>();

    constructor(
        private menuService: MenuService,
        private cartService: CartService,
        public authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadMenu();
        this.route.queryParams.subscribe(params => {
            if (params['category']) {
                this.selectedCategory = params['category'];
                this.filterItems();
            }
        });
    }

    loadMenu(): void {
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
        if (this.selectedCategory === 'All') {
            this.filteredItems = this.menuItems;
        } else {
            this.filteredItems = this.menuItems.filter(item => item.category === this.selectedCategory);
        }
    }

    selectCategory(category: string): void {
        this.selectedCategory = category;
        this.filterItems();
    }

    addToCart(item: MenuItem): void {
        if (!this.authService.isLoggedIn) {
            alert('Please login to add items to cart');
            this.router.navigate(['/login']);
            return;
        }

        this.addingToCart = item._id;
        this.cartService.addToCart(item._id).subscribe({
            next: () => {
                this.addingToCart = null;
            },
            error: () => {
                this.addingToCart = null;
                alert('Failed to add item to cart');
            }
        });
    }

    handleImageError(itemId: string): void {
        this.failedImages.add(itemId);
    }

    formatPrice(price: number): string {
        return '₹' + price.toFixed(2);
    }
}
