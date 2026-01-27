export interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: 'Coffee' | 'Beverages' | 'Snacks' | 'Waffle' | 'Cakes';
    image: string;
    isAvailable: boolean;
    isVeg: boolean;
    createdAt: Date;
}

export interface MenuResponse {
    success: boolean;
    count?: number;
    menuItems?: MenuItem[];
    menuItem?: MenuItem;
    message?: string;
}
