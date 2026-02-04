import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from '../../pipes/truncate.pipe';

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: Date;
}

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe, TruncatePipe],
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
  editingReview: Review | null = null;
  viewingReview: Review | null = null;

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    const savedReviews = localStorage.getItem('cafeReviews');
    if (savedReviews) {
      this.reviews = JSON.parse(savedReviews);
    } else {
      this.reviews = [];
    }
    this.applyFilters();
  }

  saveReviews(): void {
    localStorage.setItem('cafeReviews', JSON.stringify(this.reviews));
    this.applyFilters();
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
      this.selectedReviews = this.filteredReviews.map(review => review.id);
    } else {
      this.selectedReviews = [];
    }
  }

  deleteReview(reviewId: string): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviews = this.reviews.filter(review => review.id !== reviewId);
      this.saveReviews();
      this.selectedReviews = this.selectedReviews.filter(id => id !== reviewId);
    }
  }

  deleteSelectedReviews(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedReviews.length} reviews?`)) {
      this.reviews = this.reviews.filter(review => !this.selectedReviews.includes(review.id));
      this.saveReviews();
      this.selectedReviews = [];
      this.selectAll = false;
    }
  }

  editReview(review: Review): void {
    this.editingReview = { ...review };
  }

  updateReview(): void {
    if (this.editingReview) {
      const index = this.reviews.findIndex(r => r.id === this.editingReview!.id);
      if (index !== -1) {
        this.reviews[index] = { ...this.editingReview };
        this.saveReviews();
        this.closeEditModal();
      }
    }
  }

  setEditRating(rating: number): void {
    if (this.editingReview) {
      this.editingReview.rating = rating;
    }
  }

  closeEditModal(): void {
    this.editingReview = null;
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
      new Date(review.date).toISOString()
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
