import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { ReviewService, Review } from '../../services/review.service';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe, TruncatePipe],
  templateUrl: './admin-reviews.component.html',
  styleUrls: ['./admin-reviews.component.css']
})
export class AdminReviewsComponent implements OnInit {
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  selectedReviews: string[] = [];
  selectAll = false;
  searchTerm = '';
  filterRating = '';
  viewingReview: Review | null = null;
  isLoading = false;

  constructor(private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.reviewService.getReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredReviews = this.reviews.filter(review => {
      const matchesSearch = !this.searchTerm ||
        review.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRating = !this.filterRating || review.rating === parseInt(this.filterRating);

      return matchesSearch && matchesRating;
    });
  }

  get totalReviews(): number {
    return this.reviews.length;
  }

  get averageRating(): number {
    if (this.reviews.length === 0) return 0;
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / this.reviews.length;
  }

  get todayReviews(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.reviews.filter(review => {
      if (!review.date) return false;
      const reviewDate = new Date(review.date);
      reviewDate.setHours(0, 0, 0, 0);
      return reviewDate.getTime() === today.getTime();
    }).length;
  }

  getStarDisplay(rating: number): string {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.selectedReviews = this.filteredReviews.map(review => review._id!);
    } else {
      this.selectedReviews = [];
    }
  }

  deleteReview(reviewId: string): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(review => review._id !== reviewId);
          this.applyFilters();
          this.selectedReviews = this.selectedReviews.filter(id => id !== reviewId);
        },
        error: (err) => {
          console.error('Error deleting review:', err);
          alert('Failed to delete review.');
        }
      });
    }
  }

  deleteSelectedReviews(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedReviews.length} reviews?`)) {
      // For simplicity, deleting one by one. In a real app, a bulk delete API would be better.
      const deletePromises = this.selectedReviews.map(id => this.reviewService.deleteReview(id).toPromise());
      Promise.all(deletePromises).then(() => {
        this.reviews = this.reviews.filter(review => !this.selectedReviews.includes(review._id!));
        this.applyFilters();
        this.selectedReviews = [];
        this.selectAll = false;
      }).catch(err => {
        console.error('Error deleting some reviews:', err);
        alert('Some reviews could not be deleted.');
        this.loadReviews(); // Reload to sync state
      });
    }
  }

  showFullReview(review: Review): void {
    this.viewingReview = review;
  }

  closeViewModal(): void {
    this.viewingReview = null;
  }

  exportReviews(): void {
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviews_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  generateCSV(): string {
    const headers = ['Customer Name', 'Rating', 'Comment', 'Date'];
    const rows = this.reviews.map(review => [
      review.customerName,
      review.rating,
      review.comment.replace(/"/g, '""'),
      review.date ? new Date(review.date).toISOString() : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        row.map(cell => `"${cell}"`).join(',')
      )
    ].join('\n');

    return csvContent;
  }
}
