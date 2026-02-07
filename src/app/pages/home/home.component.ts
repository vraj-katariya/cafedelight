import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReviewComponent } from '../../components/review/review.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, ReviewComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    constructor(public authService: AuthService) { }

    categories = [
        { name: 'Coffee', icon: '☕', description: 'Premium brews & espresso', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80' },
        { name: 'Beverages', icon: '🥤', description: 'Fresh juices & smoothies', image: 'https://images.unsplash.com/photo-1544145945-f904253d0c71?w=500&q=80' },
        { name: 'Snacks', icon: '🍟', description: 'Delicious bites & sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80' },
        { name: 'Waffle', icon: '🧇', description: 'Belgian waffles & toppings', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&q=80' },
        { name: 'Cakes', icon: '🍰', description: 'Fresh baked desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80' }
    ];
}
