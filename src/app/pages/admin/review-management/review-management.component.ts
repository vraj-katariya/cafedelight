import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminReviewsComponent } from '../../../components/admin-reviews/admin-reviews.component';

@Component({
  selector: 'app-review-management',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminReviewsComponent],
  templateUrl: './review-management.component.html',
  styleUrls: ['../admin-dashboard/admin-dashboard.component.css', './review-management.component.css']
})
export class ReviewManagementComponent {
  constructor() { }
}
