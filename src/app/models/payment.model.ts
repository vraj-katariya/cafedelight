import { Order } from './order.model';
import { User } from './user.model';

export interface Payment {
    _id: string;
    order: Order | string;
    user: User | string;
    amount: number;
    method: 'cash' | 'card' | 'upi' | 'netbanking' | 'wallet';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId: string;
    paymentDetails?: {
        cardLast4?: string;
        upiId?: string;
        walletName?: string;
    };
    createdAt: Date;
}

export interface PaymentResponse {
    success: boolean;
    count?: number;
    payments?: Payment[];
    payment?: Payment;
    order?: Order;
    message?: string;
}
