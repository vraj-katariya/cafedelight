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
        { name: 'Coffee', icon: '☕', description: 'Premium brews & espresso', image: '/assets/categories/coffee.png' },
        { name: 'Beverages', icon: '🥤', description: 'Fresh juices & smoothies', image: '/assets/categories/beverages.png' },
        { name: 'Snacks', icon: '🍟', description: 'Delicious bites & sandwiches', image: '/assets/categories/snacks.png' },
        { name: 'Waffle', icon: '🧇', description: 'Belgian waffles & toppings', image: '/assets/categories/waffle.png' }
    ];
}
