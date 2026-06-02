# Quick Start Guide - Booking System

## Overview

This is a full-stack booking system with:
- **Frontend**: React + Vite (port 5173)
- **Backend**: Node.js/Express (port 5002)
- **Database**: MongoDB

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/booking_system
JWT_SECRET=your-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_REGISTRATION_KEY=admin-secret-key
PORT=5002
```

Start backend:
```bash
npm start
```

Backend will run on `http://localhost:5002`

### 2. Frontend Setup

```bash
cd front-end
npm install
```

Create `.env` file:
```
VITE_API_URL=http://localhost:5002/api
```

Start frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Key Features

### For Clients
- ✅ Browse and search for service providers
- ✅ Book appointments with available time slots
- ✅ Cancel or reschedule appointments
- ✅ Leave reviews for providers
- ✅ Manage profile and avatar

### For Providers
- ✅ Create and manage business profile
- ✅ Add and manage services
- ✅ Set working hours and availability
- ✅ View and manage client bookings
- ✅ Respond to client reviews
- ✅ View dashboard with statistics

### For Admins
- ✅ View system statistics
- ✅ Manage users and providers
- ✅ View all appointments
- ✅ Delete users or appointments

## User Roles

### Client
- Email: `client@example.com`
- Password: `password123`
- Can book appointments and leave reviews

### Provider
- Email: `provider@example.com`
- Password: `password123`
- Can manage services and availability

### Admin
- Email: `admin@example.com`
- Password: `password123`
- Admin Registration Key: Set in `.env` as `ADMIN_REGISTRATION_KEY`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Providers
- `GET /api/providers` - List all providers
- `GET /api/providers/:id` - Get provider details
- `POST /api/providers` - Create provider profile
- `PATCH /api/providers/profile` - Update provider profile

### Services
- `GET /api/services/me` - Get my services
- `POST /api/services` - Create service
- `DELETE /api/services/:id` - Delete service

### Availability
- `GET /api/availability/me` - Get my availability
- `POST /api/availability` - Set availability
- `DELETE /api/availability/:dayOfWeek` - Delete availability

### Appointments
- `GET /api/appointments/my-bookings` - Get my appointments (client)
- `GET /api/appointments/provider-bookings` - Get provider appointments
- `POST /api/appointments` - Book appointment
- `PATCH /api/appointments/:id/cancel` - Cancel appointment
- `PATCH /api/appointments/:id/reschedule` - Reschedule appointment
- `PATCH /api/appointments/:id/status` - Update appointment status

### Reviews
- `GET /api/reviews/:providerId` - Get provider reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/me/my-reviews` - Get my reviews (provider)
- `PATCH /api/reviews/:reviewId/respond` - Respond to review

### Dashboard
- `GET /api/dashboard/dashboard` - Get provider dashboard stats
- `GET /api/dashboard/client/dashboard` - Get client dashboard

### Admin
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/providers` - List all providers
- `GET /api/admin/appointments` - List all appointments
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/appointments/:id` - Delete appointment

## Frontend Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

### Client Routes
- `/client` - Discovery page (browse providers)
- `/client/dashboard` - My appointments
- `/client/settings` - Profile settings
- `/client/booking/:providerId` - Book appointment

### Provider Routes
- `/provider` - Dashboard
- `/provider/setup` - Initial setup
- `/provider/profile` - Edit profile
- `/provider/services` - Manage services
- `/provider/availability` - Manage availability
- `/provider/bookings` - View bookings
- `/provider/reviews` - Manage reviews

### Admin Routes
- `/admin` - Admin dashboard

## Common Workflows

### Client Booking Workflow
1. Register as client
2. Go to `/client` to browse providers
3. Click on provider to view details
4. Select service, date, and time
5. Click "Book" to confirm
6. View appointment in `/client/dashboard`
7. After appointment, leave review

### Provider Setup Workflow
1. Register as provider
2. Go to `/provider/setup` to create profile
3. Add services in `/provider/services`
4. Set availability in `/provider/availability`
5. View bookings in `/provider/bookings`
6. Accept/manage appointments
7. View reviews in `/provider/reviews`

### Reschedule Workflow
1. Client goes to `/client/dashboard`
2. Clicks "Reschedule" on appointment
3. Selects new date and time
4. Confirms reschedule
5. Old appointment is cancelled, new one created

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file has correct values
- Check if port 5002 is available

### Frontend won't connect to backend
- Verify backend is running on port 5002
- Check CORS settings in `backend/src/app.js`
- Verify `VITE_API_URL` in frontend `.env`

### Login not working
- Check if user exists in database
- Verify password is correct
- Check JWT_SECRET in backend `.env`

### Appointments not showing
- Verify user is logged in
- Check if appointments exist in database
- Check browser console for errors

### Images not uploading
- Verify `uploads/` directory exists
- Check file permissions
- Verify file size is under 2MB

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "client" | "provider" | "admin",
  avatar: String,
  createdAt: Date
}
```

### Provider
```javascript
{
  user: ObjectId (ref: User),
  businessName: String,
  industry: String,
  description: String,
  location: { address, city, country },
  avatar: String,
  phone: String,
  ratingStats: { averageRating, totalReviews }
}
```

### Service
```javascript
{
  provider: ObjectId (ref: Provider),
  name: String,
  duration: Number (minutes),
  price: Number
}
```

### Appointment
```javascript
{
  client: ObjectId (ref: User),
  provider: ObjectId (ref: Provider),
  service: ObjectId (ref: Service),
  date: Date,
  startTime: String,
  endTime: String,
  status: "pending" | "confirmed" | "cancelled",
  isReviewed: Boolean
}
```

### Review
```javascript
{
  client: ObjectId (ref: User),
  provider: ObjectId (ref: Provider),
  rating: Number (1-5),
  comment: String,
  appointment: ObjectId (ref: Appointment),
  response: String,
  respondedAt: Date
}
```

## Performance Tips

1. **Caching**: Backend uses in-memory cache for provider searches
2. **Pagination**: Use limit/skip for large datasets
3. **Indexing**: Database has indexes on frequently queried fields
4. **Lazy Loading**: Frontend loads data on demand

## Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Password Hashing**: Bcrypt for password security
3. **CORS Protection**: Restricted to allowed origins
4. **Input Validation**: Zod schemas for request validation
5. **Role-Based Access**: Middleware checks user roles
6. **File Upload Security**: File type and size validation

## Support

For issues or questions:
1. Check the `TESTING_CHECKLIST.md` for verification steps
2. Review `FIXES_APPLIED.md` for recent changes
3. Check browser console and backend logs for errors
4. Refer to `INTEGRATION.md` for architecture details

## Next Steps

1. Complete the setup instructions above
2. Run through the testing checklist
3. Test each user role workflow
4. Deploy to production when ready

Happy booking! 🎉
