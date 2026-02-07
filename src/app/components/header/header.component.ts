import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    isMenuOpen = false;

    constructor(
        public authService: AuthService,
        public cartService: CartService,
        private router: Router
    ) { }

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }

    logout(): void {
        if (window.confirm('Are you sure you want to log out?')) {
            this.authService.logout();
            this.cartService.resetCart();
            this.isMenuOpen = false;
            this.router.navigate(['/']);
        }
    }
}
