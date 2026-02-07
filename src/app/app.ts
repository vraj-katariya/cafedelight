import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { BookingService } from './services/booking.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
        <div class="app-container">
            @if (!isAdminPage) {
                <app-header></app-header>
            }
            <main class="main-content">
                <router-outlet></router-outlet>
            </main>
            @if (!isAdminPage) {
                <app-footer></app-footer>
            }
        </div>
    `,
  styles: [`
        .app-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .main-content {
            flex: 1;
        }
    `]
})
export class AppComponent implements OnInit {
  isAdminPage = false;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private bookingService: BookingService,
    private router: Router
  ) {
    // Listen to route changes to hide/show header/footer
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminPage = event.urlAfterRedirects.startsWith('/admin');
    });
  }

  ngOnInit(): void {
    // Initialize once in case of initial load
    this.isAdminPage = this.router.url.startsWith('/admin');
    if (this.authService.isLoggedIn) {
      this.cartService.getCart().subscribe();
      this.checkUserBookings();
    }

    // Also check when user logs in/out
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.checkUserBookings();
      } else {
        this.authService.setHasBooking(false);
      }
    });
  }

  checkUserBookings() {
    if (this.authService.isAdmin) {
      this.authService.setHasBooking(true);
      return;
    }
    this.bookingService.getMyBookings().subscribe({
      next: (res) => {
        const hasActive = res.data.some((b: any) => b.status !== 'Cancelled');
        this.authService.setHasBooking(hasActive);
      }
    });
  }
}
