import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { ReviewComponent } from '../../components/review/review.component';
import { MenuItem } from '../../models/menu.model';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, ReviewComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    categories: string[] = [];
    allProducts: MenuItem[] = [];
    filteredProducts: MenuItem[] = [];
    activeCategory: string = '';
    isLoading = false;

    constructor(
        public authService: AuthService,
        private menuService: MenuService,
        private cartService: CartService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCategories();
        this.loadAllProducts();
    }

    loadCategories(): void {
        this.menuService.getCategories().subscribe({
            next: (res) => {
                if (res.success) {
                    this.categories = res.categories;
                    if (this.categories.length > 0 && !this.activeCategory) {
                        this.activeCategory = this.categories[0];
                    }
                }
            }
        });
    }

    loadAllProducts(): void {
        this.isLoading = true;
        this.menuService.getMenuItems().subscribe({
            next: (res) => {
                if (res.success && res.menuItems) {
                    this.allProducts = res.menuItems;
                    this.filterProducts();
                }
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    setActiveCategory(category: string): void {
        this.activeCategory = category;
        this.filterProducts();
    }

    filterProducts(): void {
        const featuredCategories = ['Coffee', 'Beverages', 'Snacks', 'Waffle'];
        this.filteredProducts = [];

        featuredCategories.forEach(cat => {
            const product = this.allProducts.find(p => p.category === cat);
            if (product) {
                this.filteredProducts.push(product);
            }
        });
    }

    addToCart(product: MenuItem): void {
        if (!this.authService.isLoggedIn) {
            alert('Please login to add items to your cart.');
            this.router.navigate(['/login']);
            return;
        }
        this.cartService.addToCart(product._id).subscribe();
    }
}
