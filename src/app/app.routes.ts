import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'menu',
        loadComponent: () => import('./pages/menu/menu.component').then(m => m.MenuComponent)
    },
    {
        path: 'booking',
        loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent),
        canActivate: [authGuard]
    },
    {
        path: 'booking-success',
        loadComponent: () => import('./pages/booking/booking-success/booking-success.component').then(m => m.BookingSuccessComponent),
        canActivate: [authGuard]
    },
    {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
        canActivate: [authGuard]
    },
    {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent),
        canActivate: [authGuard]
    },
    {
        path: 'orders/:id',
        loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent),
        canActivate: [authGuard]
    },
    {
        path: 'payment/:id',
        loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent),
        canActivate: [authGuard]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/users',
        loadComponent: () => import('./pages/admin/user-management/user-management.component').then(m => m.UserManagementComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/menu',
        loadComponent: () => import('./pages/admin/menu-management/menu-management.component').then(m => m.MenuManagementComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/tables',
        loadComponent: () => import('./pages/admin/table-management/table-management.component').then(m => m.TableManagementComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/bookings',
        loadComponent: () => import('./pages/admin/booking-management/booking-management.component').then(m => m.BookingManagementComponent),
        canActivate: [adminGuard]
    },
    {
        path: '**',
        loadComponent: () => import('./pages/error-pages/not-found.component').then(m => m.NotFoundComponent)
    }
];
