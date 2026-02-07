import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-booking-success',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="success-container fade-in">
      <div class="success-card">
        <div class="icon-circle">
          <span class="checkmark">✔</span>
        </div>
        <h1>Booking Confirmed!</h1>
        <p>Your table has been successfully reserved.</p>
        <p>We are looking forward to serving you.</p>
        
        <div class="actions">
          <a routerLink="/menu" class="btn-primary">View Menu</a>
          <a routerLink="/dashboard" class="btn-secondary">My Bookings</a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .success-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 1rem;
    }
    .success-card {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      padding: 3rem;
      border-radius: 20px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 100%;
    }
    .icon-circle {
      width: 80px;
      height: 80px;
      background: #27ae60;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
    }
    .checkmark {
      font-size: 40px;
      color: white;
    }
    h1 {
      color: #fff;
      margin-bottom: 1rem;
    }
    p {
      color: #aaa;
      margin-bottom: 2rem;
    }
    .actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .btn-primary, .btn-secondary {
      padding: 0.8rem 1.5rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.2s;
    }
    .btn-primary {
      background: linear-gradient(135deg, #f39c12, #e74c3c);
      color: white;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .btn-primary:hover, .btn-secondary:hover {
      transform: translateY(-2px);
    }
  `]
})
export class BookingSuccessComponent { }
