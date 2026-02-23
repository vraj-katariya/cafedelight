import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService, Review } from '../../services/review.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  showReviewForm = false;
  isLoading = false;

  review = {
    customerName: '',
    rating: 0,
    comment: ''
  };

  constructor(private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.reviewService.getReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.isLoading = false;
      }
    });
  }

  setRating(rating: number): void {
    this.review.rating = rating;
  }

  submitReview(): void {
    if (this.review.rating === 0 || !this.review.customerName.trim() || !this.review.comment.trim()) {
      alert('Please fill in all fields and select a rating');
      return;
    }

    const newReview: Review = {
      customerName: this.review.customerName.trim(),
      rating: this.review.rating,
      comment: this.review.comment.trim()
    };

    this.reviewService.submitReview(newReview).subscribe({
      next: (savedReview) => {
        this.reviews.unshift(savedReview);
        this.resetForm();
        this.showReviewForm = false;
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        const errorMsg = err.error?.message || 'Failed to submit review. Please try again.';
        alert(errorMsg);
      }
    });
  }

  cancelReview(): void {
    this.resetForm();
    this.showReviewForm = false;
  }

  resetForm(): void {
    this.review = {
      customerName: '',
      rating: 0,
      comment: ''
    };
  }

  get averageRating(): number {
    if (this.reviews.length === 0) return 0;
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / this.reviews.length;
  }
}
