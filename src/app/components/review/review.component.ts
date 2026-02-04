import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: Date;
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  showReviewForm = false;
  
  review = {
    customerName: '',
    rating: 0,
    comment: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    // Load reviews from localStorage
    const savedReviews = localStorage.getItem('cafeReviews');
    if (savedReviews) {
      this.reviews = JSON.parse(savedReviews);
    } else {
      // Sample reviews for demonstration
      this.reviews = [
        {
          id: '1',
          customerName: 'Raj Patel',
          rating: 5,
          comment: 'Excellent coffee and amazing atmosphere! The staff is very friendly.',
          date: new Date('2024-01-15')
        },
        {
          id: '2',
          customerName: 'Priya Shah',
          rating: 4,
          comment: 'Great food and good service. The cafe has a wonderful ambiance.',
          date: new Date('2024-01-10')
        }
      ];
      this.saveReviews();
    }
  }

  saveReviews(): void {
    localStorage.setItem('cafeReviews', JSON.stringify(this.reviews));
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
      id: Date.now().toString(),
      customerName: this.review.customerName.trim(),
      rating: this.review.rating,
      comment: this.review.comment.trim(),
      date: new Date()
    };

    this.reviews.unshift(newReview);
    this.saveReviews();
    this.resetForm();
    this.showReviewForm = false;
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
