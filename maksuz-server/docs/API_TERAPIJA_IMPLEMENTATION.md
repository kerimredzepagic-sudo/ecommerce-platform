# Api Terapija Booking System - Implementation Documentation

## Overview

This document describes the complete implementation of the Api Terapija booking system for Maksuz. The system enables:

- **Admin** to manage services, time slots, and bookings via the admin panel
- **Guests** to book appointments without creating an account
- **Logged-in users** to book appointments with automatic account linking and booking history
- **Email notifications** for booking confirmations and cancellations

---

## Table of Contents

1. [Backend Implementation](#1-backend-implementation)
2. [Frontend Implementation](#2-frontend-implementation)
3. [Database Models](#3-database-models)
4. [API Endpoints](#4-api-endpoints)
5. [File Structure](#5-file-structure)
6. [Features](#6-features)
7. [Usage Guide](#7-usage-guide)
8. [Future Enhancements](#8-future-enhancements)

---

## 1. Backend Implementation

### 1.1 Data Models

Three Mongoose models were created in `maksuz-server/src/models/`:

#### ApiService.model.ts
Stores service definitions with dynamic pricing:
```typescript
interface IApiService {
  name: string;           // "Api Mini", "Api Full", etc.
  slug: string;           // URL-friendly identifier
  description: string;
  price: number;          // Price in BAM
  duration: number;       // Duration in minutes
  sessionsIncluded: number; // 1 for single, 4/8 for packages
  isPackage: boolean;
  validityDays?: number;  // Package validity period
  image?: string;
  isActive: boolean;
  order: number;          // Display order
}
```

#### ApiSlot.model.ts
Stores available time slots:
```typescript
interface IApiSlot {
  date: Date;             // Slot date
  startTime: string;      // "HH:mm" format
  endTime: string;        // "HH:mm" format
  isBooked: boolean;
  isBlocked: boolean;     // Admin can block slots
  booking?: ObjectId;     // Reference to booking
  createdBy: ObjectId;    // Admin who created
  notes?: string;
}
```

#### ApiBooking.model.ts
Stores bookings with auto-generated booking numbers:
```typescript
interface IApiBooking {
  bookingNumber: string;  // Auto-generated "API-XXXXX-XXXX"
  user?: ObjectId;        // Optional - for logged-in users
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  service: ObjectId;
  sessions: [{
    slot: ObjectId;
    date: Date;
    startTime: string;
    endTime: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  }];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  paymentMethod: 'cash' | 'online';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  adminNotes?: string;
}
```

### 1.2 Services (Business Logic)

Three service files handle the business logic:

#### apiService.service.ts
- CRUD operations for services
- Slug uniqueness validation
- Reorder functionality with bulk updates

#### apiSlot.service.ts
- Single slot creation
- Bulk slot creation (generates multiple slots for date range)
- Availability queries
- Block/unblock functionality

#### apiBooking.service.ts
- Booking creation with MongoDB transactions (prevents double-booking)
- Automatic slot marking as booked
- User linking for logged-in users
- Cancellation with slot release
- Email notification integration

### 1.3 Validators (Zod Schemas)

Validation schemas in `validators/`:
- `apiService.validator.ts` - Service creation/update validation
- `apiSlot.validator.ts` - Slot creation, bulk creation validation
- `apiBooking.validator.ts` - Booking creation, status updates

### 1.4 Email Templates

Added to `email.service.ts`:
- `sendBookingConfirmation()` - Sends confirmation with booking details
- `sendBookingCancellation()` - Notifies about cancellation

Email templates are in Croatian with branded styling.

### 1.5 Routes

Three route files added:
- `/api/api-services` - Service CRUD
- `/api/api-slots` - Slot management
- `/api/api-bookings` - Booking operations

### 1.6 Seed Script

`scripts/seedApiServices.ts` - Seeds the initial 4 services:
- Api Mini (50 KM, 20 min)
- Api Full (100 KM, 60 min)
- Paket 4 Tretmana (250 KM, 4 sessions)
- Paket 8 Tretmana (250 KM, 8 sessions)

Run with: `npx ts-node src/scripts/seedApiServices.ts`

---

## 2. Frontend Implementation

### 2.1 API Hooks

Three hook files manage API communication:

#### useAdminApi.ts (additions)
Admin operations for:
- Services: `useApiServices`, `useCreateApiService`, `useUpdateApiService`, `useDeleteApiService`
- Slots: `useApiSlots`, `useCreateApiSlot`, `useCreateBulkApiSlots`, `useToggleApiSlotBlock`, `useDeleteApiSlot`
- Bookings: `useApiBookings`, `useApiBooking`, `useUpdateApiBookingStatus`, `useUpdateApiBookingPayment`, `useCancelApiBookingAdmin`

#### useApiBookingApi.ts (new file)
Public booking operations:
- `useActiveApiServices` - Get available services
- `useAvailableSlots` - Get available time slots
- `useCreateBooking` - Create booking (supports guest & logged-in users)
- `useBookingLookup` - Lookup booking by number

#### useAccountApi.ts (additions)
User account operations:
- `useMyApiBookings` - User's booking history
- `useMyApiBooking` - Single booking detail
- `useCancelMyApiBooking` - Cancel own booking

### 2.2 Admin Panel Pages

Located in `app/admin/`:

#### api-services/
- `page.tsx` - List of services with edit/delete
- `new/page.tsx` - Create new service form
- `[id]/page.tsx` - Edit service form

#### api-slots/
- `page.tsx` - Calendar-based slot management
  - Interactive calendar for date selection
  - Single slot creation
  - Bulk slot creation (date range, working hours, slot duration)
  - Block/unblock slots
  - Delete slots

#### api-bookings/
- `page.tsx` - Bookings list with filters
- `[id]/page.tsx` - Booking detail with status management

### 2.3 Public Booking Components

Located in `components/api-booking/`:

#### ServiceSelector.tsx
Card-based service selection with:
- Service name, description, price
- Duration and package info
- Visual selection indicator

#### BookingCalendar.tsx
Date and time selection:
- Calendar with availability indicators
- Only dates with available slots are selectable
- Time slot grid for selected date

#### BookingForm.tsx
Customer information form:
- Name, email, phone fields
- Payment method selection (cash/online)
- Optional notes
- Pre-fills data for logged-in users

#### BookingConfirmation.tsx
Success screen showing:
- Booking number (copyable)
- Service details
- Appointment date/time
- Customer info
- Payment details

### 2.4 Booking Flow Page

`app/(corporate)/api-terapija/rezervacija/page.tsx`

Multi-step booking flow:
1. **Service Selection** - Choose service/package
2. **Date & Time** - Select available slot
3. **Customer Details** - Fill in contact info and payment method
4. **Confirmation** - Success page with booking number

### 2.5 User Account Pages

Located in `app/account/rezervacije/`:

#### page.tsx
- Booking history list
- Status filters
- Upcoming appointment highlight
- Pagination

#### [id]/page.tsx
- Booking detail view
- Session list with status
- Cancel option (24h before)

### 2.6 Navigation Updates

#### AdminSidebar.tsx
Added "Api Terapija" section with:
- Usluge (Services)
- Termini (Slots)
- Rezervacije (Bookings)

#### AccountSidebar.tsx
Added "Moje rezervacije" link

---

## 3. Database Models

### Collections Created:
1. `apiservices` - Service definitions
2. `apislots` - Available time slots
3. `apibookings` - Customer bookings

### Indexes:
- `apislots`: `{ date: 1, startTime: 1 }` (compound)
- `apibookings`: `{ bookingNumber: 1 }` (unique)
- `apibookings`: `{ user: 1 }` (for user history queries)

---

## 4. API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/api-services/active` | Get active services |
| GET | `/api/api-slots/available?from=&to=` | Get available slots |
| POST | `/api/api-bookings` | Create booking |
| GET | `/api/api-bookings/lookup/:bookingNumber` | Lookup by number |

### User Endpoints (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/api-bookings/my-bookings` | User's bookings |
| GET | `/api/api-bookings/my-bookings/:id` | Booking detail |
| POST | `/api/api-bookings/my-bookings/:id/cancel` | Cancel booking |

### Admin Endpoints (Admin Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/api-slots` | Create slot |
| POST | `/api/api-slots/bulk` | Bulk create slots |
| PUT | `/api/api-slots/:id` | Update slot |
| DELETE | `/api/api-slots/:id` | Delete slot |
| PATCH | `/api/api-slots/:id/block` | Toggle block |
| GET | `/api/api-bookings/admin/all` | All bookings |
| PATCH | `/api/api-bookings/admin/:id/status` | Update status |
| PATCH | `/api/api-bookings/admin/:id/payment` | Update payment |

---

## 5. File Structure

### Backend (maksuz-server)
```
src/
├── models/
│   ├── ApiService.model.ts
│   ├── ApiSlot.model.ts
│   ├── ApiBooking.model.ts
│   └── index.ts (updated)
├── validators/
│   ├── apiService.validator.ts
│   ├── apiSlot.validator.ts
│   └── apiBooking.validator.ts
├── services/
│   ├── apiService.service.ts
│   ├── apiSlot.service.ts
│   └── apiBooking.service.ts
├── controllers/
│   ├── apiService.controller.ts
│   ├── apiSlot.controller.ts
│   └── apiBooking.controller.ts
├── views/
│   ├── apiService.view.ts
│   ├── apiSlot.view.ts
│   └── apiBooking.view.ts
├── routes/
│   ├── apiService.routes.ts
│   ├── apiSlot.routes.ts
│   ├── apiBooking.routes.ts
│   └── index.ts (updated)
├── scripts/
│   └── seedApiServices.ts
└── services/
    └── email.service.ts (updated)
```

### Frontend (maksuz-web)
```
src/
├── hooks/
│   ├── useAdminApi.ts (updated)
│   ├── useAccountApi.ts (updated)
│   └── useApiBookingApi.ts (new)
├── components/
│   ├── ui/
│   │   └── calendar.tsx (new)
│   ├── admin/
│   │   └── AdminSidebar.tsx (updated)
│   ├── account/
│   │   └── AccountSidebar.tsx (updated)
│   └── api-booking/
│       ├── index.ts
│       ├── ServiceSelector.tsx
│       ├── BookingCalendar.tsx
│       ├── BookingForm.tsx
│       └── BookingConfirmation.tsx
└── app/
    ├── admin/
    │   ├── api-services/
    │   │   ├── page.tsx
    │   │   ├── new/page.tsx
    │   │   └── [id]/page.tsx
    │   ├── api-slots/
    │   │   └── page.tsx
    │   └── api-bookings/
    │       ├── page.tsx
    │       └── [id]/page.tsx
    ├── account/
    │   ├── layout.tsx (updated)
    │   └── rezervacije/
    │       ├── page.tsx
    │       └── [id]/page.tsx
    └── (corporate)/
        └── api-terapija/
            └── rezervacija/
                └── page.tsx
```

---

## 6. Features

### For Admins:
- ✅ Calendar-based slot management
- ✅ Bulk slot creation for date ranges
- ✅ Block/unblock individual slots
- ✅ View and manage all bookings
- ✅ Update booking and payment status
- ✅ Service CRUD with dynamic pricing

### For Guests:
- ✅ Browse available services
- ✅ View available dates and times
- ✅ Book without account
- ✅ Receive email confirmation
- ✅ Lookup booking by number

### For Logged-in Users:
- ✅ All guest features
- ✅ Auto-fill booking form
- ✅ View booking history
- ✅ Cancel bookings (24h before)
- ✅ Account-linked bookings

### Technical Features:
- ✅ MongoDB transactions for double-booking prevention
- ✅ Auto-generated booking numbers
- ✅ Email notifications
- ✅ Responsive design
- ✅ Croatian language UI

---

## 7. Usage Guide

### Admin Setup:
1. Run seed script: `npx ts-node src/scripts/seedApiServices.ts`
2. Access admin panel: `/admin/api-services`
3. Create slots: `/admin/api-slots`
   - Use calendar to select dates
   - Create single slots or use bulk creation
4. Monitor bookings: `/admin/api-bookings`

### Customer Booking:
1. Visit `/api-terapija/rezervacija`
2. Select service
3. Choose date and time
4. Fill in contact details
5. Confirm booking
6. Receive email with booking number

---

## 8. Future Enhancements

### Planned:
- [ ] Online payment integration (Monri)
- [ ] SMS notifications
- [ ] Recurring booking templates
- [ ] Calendar sync (Google/iCal)
- [ ] Admin mobile app

### Optional:
- [ ] Waiting list for full slots
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Customer reviews

---

## Verification

To test the implementation:

1. **Backend**: `cd maksuz-server && yarn dev`
2. **Frontend**: `cd maksuz-web && yarn dev`
3. **Seed services**: Run the seed script
4. **Admin test**: Create slots, view services
5. **Booking test**: Complete booking flow as guest and logged-in user
6. **Check email**: Verify confirmation email received

---

*Implementation completed: January 2026*
*Author: Claude Code Assistant*
