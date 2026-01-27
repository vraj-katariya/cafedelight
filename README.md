# Cafe Delight - Full Stack Cafe Management System

A professional, production-ready Cafe Management System built with Angular, Node.js, Express, and MongoDB.

## 🛠️ Tech Stack

**Frontend:**
- Angular 19+ (Standalone Components)
- Angular Routing with Lazy Loading
- Reactive Forms with Validation
- Role-based Guards (AuthGuard, AdminGuard)
- Responsive CSS Design

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Password Hashing (bcrypt)
- Role-based Middleware

**Currency:** All prices in Indian Rupees (₹)

---

## 📂 Project Structure

```
clicafe/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT & Role middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── dashboardRoutes.js
│   ├── server.js
│   ├── seed.js                # Sample data seeder
│   └── .env
├── src/                       # Angular Frontend
│   ├── app/
│   │   ├── components/        # Header, Footer
│   │   ├── guards/            # Auth, Admin guards
│   │   ├── interceptors/      # Auth interceptor
│   │   ├── models/            # TypeScript interfaces
│   │   ├── pages/             # All page components
│   │   └── services/          # API services
│   ├── environments/
│   └── styles.css
└── package.json               # Angular frontend package
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Angular CLI (`npm install -g @angular/cli`)

### Backend Setup

1. Navigate to backend:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment (edit `.env`):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cafe_delight
   JWT_SECRET=your_secret_key
   ```

4. Seed database (optional but recommended):
   ```bash
   node seed.js
   ```

5. Start server:
   ```bash
   npm start
   ```

Backend runs at: `http://localhost:5000`

### Frontend Setup

1. Navigate to project root:
   ```bash
   cd clicafe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   ng serve
   ```

Frontend runs at: `http://localhost:4200`

---

## 🔐 Demo Credentials

| Role  | Email                    | Password  |
|-------|--------------------------|-----------|
| Admin | admin@cafedelight.com    | Admin@123 |
| User  | john@example.com         | User@123  |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|  
| POST   | /api/auth/register  | Register new user   |
| POST   | /api/auth/login     | Login user          |
| GET    | /api/auth/me        | Get current user    |

### Users (Admin)
| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| GET    | /api/users          | Get all users       |
| POST   | /api/users          | Create user         |
| PUT    | /api/users/:id      | Update user         |
| DELETE | /api/users/:id      | Delete user         |

### Menu
| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| GET    | /api/menu           | Get all items       |
| POST   | /api/menu           | Create item (Admin) |
| PUT    | /api/menu/:id       | Update item (Admin) |
| DELETE | /api/menu/:id       | Delete item (Admin) |

### Cart
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | /api/cart             | Get user's cart     |
| POST   | /api/cart/add         | Add item to cart    |
| PUT    | /api/cart/update      | Update quantity     |
| DELETE | /api/cart/remove/:id  | Remove item         |

### Orders
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | /api/orders           | Get orders          |
| POST   | /api/orders           | Create order        |
| PUT    | /api/orders/:id/status| Update status       |

### Payments
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | /api/payments         | Get payments        |
| POST   | /api/payments         | Process payment     |

### Admin Dashboard
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | /api/admin/dashboard  | Get stats & data    |

---

## 📝 Sample API Requests

### Register User
```json
POST /api/auth/register
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123"
}
```

### Login
```json
POST /api/auth/login
{
    "email": "admin@cafedelight.com",
    "password": "Admin@123"
}
```

**Response:**
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "...",
        "name": "Admin User",
        "email": "admin@cafedelight.com",
        "role": "admin"
    }
}
```

### Add to Cart
```json
POST /api/cart/add
Authorization: Bearer <token>
{
    "menuItemId": "...",
    "quantity": 2
}
```

### Create Order
```json
POST /api/orders
Authorization: Bearer <token>
{
    "deliveryAddress": "123 Main St",
    "notes": "No sugar please"
}
```

---

## 🎨 Features

### User Features
- ✅ Register/Login with JWT
- ✅ Browse menu with category filter
- ✅ Add items to cart
- ✅ Quantity management & GST calculation
- ✅ Place orders
- ✅ View order history
- ✅ Process payments (UPI, Card, Cash, Wallet)
- ✅ User dashboard with profile info

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Total users, orders, revenue (₹)
- ✅ Recent orders table
- ✅ User management (CRUD)
- ✅ Menu management (CRUD)
- ✅ Update order status

---

## 📱 Menu Categories
- ☕ Coffee
- 🥤 Beverages  
- 🍟 Snacks
- 🧇 Waffle
- 🍰 Cakes

---

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Angular route guards

---

## 📄 License

MIT License - Free to use and modify
