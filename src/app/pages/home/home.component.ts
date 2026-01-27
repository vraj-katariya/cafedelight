import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    constructor(public authService: AuthService) { }

    categories = [
        { name: 'Coffee', icon: '☕', description: 'Premium brews & espresso' },
        { name: 'Beverages', icon: '🥤', description: 'Fresh juices & smoothies' },
        { name: 'Snacks', icon: '🍟', description: 'Delicious bites & sandwiches' },
        { name: 'Waffle', icon: '🧇', description: 'Belgian waffles & toppings' },
        { name: 'Cakes', icon: '🍰', description: 'Fresh baked desserts' }
    ];
}
