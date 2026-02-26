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
      min-height: 70vh;
      padding: 2rem;
      background: #ffffff;
    }
    .success-card {
      background: #ffffff;
      padding: 4rem;
      border-radius: 0;
      text-align: center;
      border: 1px solid #1a1a1a;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
      max-width: 550px;
      width: 100%;
      position: relative;
    }
    .success-card::before {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border: 1px solid #eeeeee;
      z-index: -1;
    }
    .icon-circle {
      width: 100px;
      height: 100px;
      background: #1a1a1a;
      border-radius: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2.5rem;
    }
    .checkmark {
      font-size: 50px;
      color: #ffffff;
    }
    h1 {
      color: #1a1a1a;
      margin-bottom: 1.5rem;
      font-size: 2.2rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    p {
      color: #666;
      margin-bottom: 1rem;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    .actions {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 3rem;
      flex-wrap: wrap;
    }
    .btn-primary, .btn-secondary {
      padding: 1.2rem 2.5rem;
      border-radius: 0;
      text-decoration: none;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2px;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      font-size: 0.85rem;
    }
    .btn-primary {
      background: #1a1a1a;
      color: #ffffff;
      border: 1px solid #1a1a1a;
    }
    .btn-secondary {
      background: transparent;
      color: #1a1a1a;
      border: 1px solid #1a1a1a;
    }
    .btn-primary:hover {
      background: #ffffff;
      color: #1a1a1a;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .btn-secondary:hover {
      background: #1a1a1a;
      color: #ffffff;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
  `]
})
export class BookingSuccessComponent { }
