import { MenuItem } from './menu.model';

export interface CartItem {
    menuItem: MenuItem;
    quantity: number;
    price: number;
}

export interface Cart {
    items: CartItem[];
    subtotal: number;
    gstRate: number;
    gstAmount: number;
    total: number;
}

export interface CartResponse {
    success: boolean;
    cart?: Cart;
    message?: string;
}
