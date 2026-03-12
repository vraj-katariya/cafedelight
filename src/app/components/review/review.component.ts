import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe, SlicePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReviewService, Review } from '../../services/review.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, SlicePipe],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  @Input() allowWrite = true;
  @Input() showHeader = true;
  @Input() showList = true;
  @Input() showForm = false;
  @Input() limit = 0;
  @Input() orderId?: string;
  @Output() reviewSubmitted = new EventEmitter<void>();

  reviews: Review[] = [];
  showReviewForm = false;
  isLoading = false;
  isExpanded = false;
  reviewForm: FormGroup;

  constructor(
    private reviewService: ReviewService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      rating: [0, [Validators.required, Validators.min(1)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadReviews();
    if (this.showForm) {
      this.showReviewForm = true;
    }
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
    this.reviewForm.patchValue({ rating });
    this.reviewForm.get('rating')?.markAsTouched();
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const { customerName, rating, comment } = this.reviewForm.value;

    const newReview: Review = {
      customerName: customerName.trim(),
      rating,
      comment: comment.trim(),
      ...(this.orderId && { orderId: this.orderId })
    };

    this.isLoading = true;
    this.reviewService.submitReview(newReview).subscribe({
      next: (savedReview) => {
        this.reviews.unshift(savedReview);
        this.resetForm();
        this.showReviewForm = false;
        this.reviewSubmitted.emit();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        const errorMsg = err.error?.message || 'Failed to submit review. Please try again.';
        alert(errorMsg);
        this.isLoading = false;
      }
    });
  }

  cancelReview(): void {
    this.resetForm();
    this.showReviewForm = false;
  }

  resetForm(): void {
    this.reviewForm.reset({
      rating: 0
    });
  }

  get f() { return this.reviewForm.controls; }

  get averageRating(): number {
    if (this.reviews.length === 0) return 0;
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / this.reviews.length;
  }

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
}
