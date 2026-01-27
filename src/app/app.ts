import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { BookingService } from './services/booking.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
        <div class="app-container">
            <app-header></app-header>
            <main class="main-content">
                <router-outlet></router-outlet>
            </main>
            <app-footer></app-footer>
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
  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
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
