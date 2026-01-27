# Cafe Web Application Implementation Plan

## 1. System Architecture
### Frontend (Angular)
- **Architecture**: Modular Component-based architecture.
- **State Management**: RxJS (Services with BehaviorSubjects).
- **Modules**:
  - `AuthModule`: Login, Registration, JWT handling.
  - `AdminModule`: Dashboard, Manage Users, Tables, Menu, Orders.
  - `UserModule`: Booking, Menu Browsing, Carts, Orders.
  - `SharedModule`: Reusable components (headers, footers, loaders).

### Backend (Node.js + Express)
- **Architecture**: Layered (Controller-Service-Model).
- **Security**: Helmet, CORS, Rate Limiting, JWT (HttpOnly Cookies).
- **API Structure**: `/api/v1/{resource}`.

### Database (MongoDB)
- **Collections**:
  - `users`: Auth & Profile.
  - `tables`: Capacity, Location, Availability status per slot.
  - `bookings`: User ref, Table ref, Date, TimeSlot, Status.
  - `menu_items`: Food details.
  - `orders`: Link to MenuItems, User, Booking.
  - `payments`: Transaction details.
  - `admin_logs`: Auditing.

## 2. Implementation Steps

### Phase 1: Database & Backend Core (Current Focus)
- [ ] **Data Models**:
  - Create `Table` model (Capacity, Number, Status).
  - Create `Booking` model (Date, Slot, GuestCount, Status).
  - Create `AdminLog` model.
- [ ] **API Routes**:
  - `tables`: CRUD, Availability Check.
  - `bookings`: Create (with Conflict Check), Cancel, List.
  - `admin`: Dashboard stats.

### Phase 2: Booking Core Logic
- Implement `checkAvailability` middleware.
- Logic: `Booking.findOne({ tableId, date, timeSlot, status: { $ne: 'Cancelled' } })`.
- Transaction support for Booking + Table Lock (optional but recommended).

### Phase 3: Frontend Integration
- **Admin**:
  - Table Management UI.
  - Booking Manager UI.
- **User**:
  - Booking UI (Date/Time picker).
  - Table Selection.

## 3. Database Schema Design (Detailed)

### Table Schema
```json
{
  "tableNumber": { "type": "Number", "unique": true, "required": true },
  "capacity": { "type": "Number", "required": true },
  "isAvailable": { "type": "Boolean", "default": true }, // General availability
}
```

### Booking Schema
```json
{
  "user": { "type": "ObjectId", "ref": "User" },
  "table": { "type": "ObjectId", "ref": "Table" },
  "date": { "type": "Date", "required": true }, // Normalized to midnight or string YYYY-MM-DD
  "timeSlot": { "type": "String", "required": true }, // e.g., "19:00-20:00"
  "guests": { "type": "Number", "required": true },
  "status": { "type": "String", "enum": ["Pending", "Confirmed", "Completed", "Cancelled"], "default": "Pending" }
}
```

## 4. API Route Structure
- `GET /api/tables` - List all tables (Admin/Public).
- `POST /api/tables` - Create table (Admin).
- `GET /api/bookings/availability` - Check slots.
- `POST /api/bookings` - Create booking (User).
- `GET /api/bookings/my-bookings` - User history.

This plan focuses on immediate deliverables for the Booking System.
