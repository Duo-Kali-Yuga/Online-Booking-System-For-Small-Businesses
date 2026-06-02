# Backend README

This is a Node.js/Express backend for a booking system using MongoDB and Mongoose.

## Project Structure

```
backend/src/
├── config/           # Configuration files (database, etc.)
├── controllers/      # Request handlers
├── jobs/             # Background jobs (cron tasks)
├── middlewares/      # Custom middleware functions
├── models/           # MongoDB schemas and models
├── routes/           # API route definitions
├── services/         # Business logic layer
├── utils/            # Utility functions
└── validators/       # Request validation schemas
```

## Key Concepts

### Models (Database Schema)

Models define the structure of data in MongoDB.

- `User.js` - User accounts (clients, providers, admins)
- `Provider.js` - Provider business profiles
- `Service.js` - Services offered by providers
- `Availability.js` - Provider working hours and breaks
- `Appointment.js` - Booked appointments
- `Review.js` - Client reviews for providers

**Example**: The `User` model stores user information with password hashing and role-based access.

### Routes (API Endpoints)

Routes define the API endpoints and which controller handles them.

- `authRoutes.js` - `/auth/*` - Login, register
- `userRoutes.js` - `/users/*` - User profile updates
- `providerRoutes.js` - `/providers/*` - Provider management
- `serviceRoutes.js` - `/services/*` - Service CRUD
- `availabilityRoutes.js` - `/availability/*` - Working hours
- `slotRoutes.js` - `/slots/*` - Available time slots
- `appointmentRoutes.js` - `/appointments/*` - Booking management
- `reviewRoutes.js` - `/reviews/*` - Reviews
- `dashboardRoutes.js` - `/dashboard/*` - Dashboard stats
- `adminRoutes.js` - `/admin/*` - Admin functions

### Controllers (Request Handlers)

Controllers contain the logic for handling requests.

- `authController.js` - Login/register logic
- `userController.js` - User profile updates
- `providerController.js` - Provider profile management
- `serviceController.js` - Service CRUD operations
- `availabilityController.js` - Availability management
- `slotController.js` - Available slot calculation
- `appointmentController.js` - Booking logic
- `reviewController.js` - Review creation and management
- `dashboardController.js` - Dashboard statistics
- `adminController.js` - Admin functions

### Services (Business Logic)

Services contain the core business logic, separated from controllers for better organization.

- `clientService.js` - Client-specific logic
- `providerService.js` - Provider profile logic
- `serviceService.js` - Service management
- `availabilityService.js` - Availability management
- `slotService.js` - Slot availability calculation
- `appointmentServices.js` - Booking logic
- `analyticsService.js` - Dashboard statistics
- `rescheduleAppintment.js` - Rescheduling logic

### Middlewares (Request Interceptors)

Middlewares run before controllers to preprocess requests.

- `authMiddleware.js` - JWT authentication
  - `protect` - Ensures user is authenticated
  - `isProvider` - Ensures user is a provider
  - `isAdmin` - Ensures user is an admin
- `errorMiddleware.js` - Centralized error handling
- `validate.js` - Request validation using Zod schemas
- `uploadMiddleware.js` - File upload handling (avatars)
- `logger.js` - Request logging with Morgan

### Utils (Helper Functions)

Utility functions used throughout the app.

- `response.js` - Standardized response formatting
- `email.js` - Email sending with Nodemailer
- `cache.js` - In-memory caching
- `pagination.js` - Pagination helpers

### Jobs (Background Tasks)

Background jobs run on a schedule.

- `reminderJob.js` - Sends appointment reminders via email

### Config

Configuration files.

- `db.js` - MongoDB connection setup

## How the Backend Works

### Request Flow

1. **Route**: Request hits an endpoint (e.g., `/api/auth/login`)
2. **Middleware**: Auth, validation, and other middleware run
3. **Controller**: Controller handles the request
4. **Service**: Business logic is executed
5. **Model**: Database operations occur
6. **Response**: Formatted response sent back

### Authentication Flow

1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Password is hashed using bcrypt
3. JWT token is generated and returned
4. Token stored in frontend `localStorage`
5. Token sent in `Authorization` header for protected routes
6. `protect` middleware verifies token and loads user

### Booking Flow

1. Client fetches available providers via `/api/providers`
2. Client selects provider and service
3. Available slots fetched via `/api/slots?providerId=...&date=...&duration=...`
4. Client books appointment via `/api/appointments` POST
5. Backend validates slot availability
6. Appointment created in database
7. Email notification sent (optional)

### Provider Flow

1. Provider creates profile via `/api/providers`
2. Provider sets availability via `/api/availability`
3. Provider adds services via `/api/services`
4. Provider views appointments via `/api/dashboard`
5. Provider manages bookings via `/api/appointments`

## Running the Backend

```bash
cd backend
npm install
npm start
```

The API will run on `http://localhost:5002` (default port).

## Environment Variables

Required `.env` variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `EMAIL_USER` - Email address for sending emails
- `EMAIL_PASS` - Email password/app password
- `ADMIN_REGISTRATION_KEY` - Secret key for admin registration