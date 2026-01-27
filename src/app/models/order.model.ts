import { User } from './user.model';

export interface OrderItem {
    menuItem: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    user: User | string;
    items: OrderItem[];
    subtotal: number;
    gstRate: number;
    gstAmount: number;
    total: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    deliveryAddress?: string;
    notes?: string;
    createdAt: Date;
}

export interface OrderResponse {
    success: boolean;
    count?: number;
    orders?: Order[];
    order?: Order;
    message?: string;
}
