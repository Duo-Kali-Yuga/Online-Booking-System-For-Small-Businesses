# Frontend-Backend Integration README

This document explains how the frontend and backend work together in this booking system.

## Architecture Overview

This is a full-stack application with:
- **Frontend**: React + Vite (runs on port 5173)
- **Backend**: Node.js/Express (runs on port 5002)
- **Database**: MongoDB

The frontend and backend communicate via REST API calls using JSON.

## API Communication

### Base URL

The frontend is configured to call the backend at:
- Local: `http://localhost:5002/api`
- Production: `https://bookingbusinesses.onrender.com/api`

This is configured in `front-end/src/api/axios.js`.

### Authentication

All API calls use JWT (JSON Web Token) authentication:

1. User logs in via `/api/auth/login`
2. Backend returns token and user data
3. Frontend stores token in `localStorage`
4. Axios interceptor automatically adds token to `Authorization` header

```javascript
// Example of how token is sent
Authorization: Bearer <your-jwt-token>
```

## Key Features and Code Locations

### 1. Authentication

**Frontend**:
- `front-end/src/pages/Login.jsx` - Login form
- `front-end/src/pages/Register.jsx` - Registration form
- `front-end/src/context/AuthContext.jsx` - Auth state management

**Backend**:
- `backend/src/controllers/authController.js` - Login/register logic
- `backend/src/routes/authRoutes.js` - Auth routes

**Flow**:
1. User submits credentials in `Login.jsx`
2. Frontend calls `POST /api/auth/login`
3. Backend validates credentials
4. Backend returns token and user data
5. Frontend stores token and user in `AuthContext`

### 2. Provider Discovery (Client)

**Frontend**:
- `front-end/src/pages/client/ClientDiscovery.jsx` - Browse providers
- `front-end/src/features/client/components/ProviderSearchForm.jsx` - Search form
- `front-end/src/features/client/components/ProviderList.jsx` - Provider list

**Backend**:
- `backend/src/controllers/providerController.js` - Get providers
- `backend/src/routes/providerRoutes.js` - Provider routes

**Flow**:
1. Client visits discovery page
2. Frontend calls `GET /api/providers`
3. Backend returns filtered provider list
4. Frontend displays providers with search/filter options

### 3. Booking Appointment

**Frontend**:
- `front-end/src/pages/client/BookingPage.jsx` - Booking interface
- `front-end/src/features/client/components/ClientHeader.jsx` - Header component

**Backend**:
- `backend/src/controllers/slotController.js` - Get available slots
- `backend/src/controllers/appointmentController.js` - Create appointment
- `backend/src/services/slotService.js` - Slot availability logic
- `backend/src/services/appointmentServices.js` - Booking logic

**Flow**:
1. Client selects provider and service
2. Frontend calls `GET /api/slots?providerId=...&date=...&duration=...`
3. Backend calculates available slots based on:
   - Provider availability
   - Existing appointments
   - Break times
4. Frontend displays available time slots
5. Client selects a slot
6. Frontend calls `POST /api/appointments` with booking data
7. Backend validates and creates appointment
8. Backend returns success response

### 4. Provider Dashboard

**Frontend**:
- `front-end/src/pages/provider/ProviderDashboard.jsx` - Main dashboard
- `front-end/src/features/provider/dashboard/` - Dashboard components

**Backend**:
- `backend/src/controllers/dashboardController.js` - Dashboard stats
- `backend/src/controllers/appointmentController.js` - Get appointments
- `backend/src/services/analyticsService.js` - Analytics logic

**Flow**:
1. Provider visits dashboard
2. Frontend calls `GET /api/dashboard/dashboard`
3. Backend calculates:
   - Total appointments
   - Total revenue
   - Service statistics
4. Backend returns statistics
5. Frontend displays dashboard cards

### 5. Review System

**Frontend**:
- `front-end/src/components/ReviewList.jsx` - Display reviews
- `front-end/src/components/ReviewModel.jsx` - Review submission modal

**Backend**:
- `backend/src/controllers/reviewController.js` - Review CRUD
- `backend/src/routes/reviewRoutes.js` - Review routes
- `backend/src/models/Review.js` - Review schema

**Flow**:
1. Client completes appointment
2. Client submits review via modal
3. Frontend calls `POST /api/reviews`
4. Backend validates and creates review
5. Backend triggers rating recalculation
6. Backend returns review data
7. Frontend displays new review

### 6. Availability Management

**Frontend**:
- `front-end/src/pages/provider/AvailabilityManager.jsx` - Availability UI

**Backend**:
- `backend/src/controllers/availabilityController.js` - Availability CRUD
- `backend/src/routes/availabilityRoutes.js` - Availability routes
- `backend/src/services/availabilityService.js` - Availability logic

**Flow**:
1. Provider sets working hours
2. Frontend calls `POST /api/availability`
3. Backend saves availability document
4. Backend returns success response
5. Slots are calculated based on this availability

## Data Models

### User
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: "client" | "provider" | "admin",
  avatar: String
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

## Key Integration Points

### 1. Protected Routes

The frontend uses `ProtectedRoutes.jsx` to check authentication:

```javascript
// Checks if user is logged in
if (!user) return <Navigate to="/login" replace />;

// Checks if user has correct role
if (allowedRoles && !allowedRoles.includes(user.role)) {
  return <Navigate to="/" replace />;
}
```

### 2. Error Handling

Backend errors are caught and displayed:

```javascript
// In frontend components
try {
  await api.post('/appointments', data);
} catch (err) {
  alert(err.response?.data?.message || "Booking failed");
}
```

### 3. Loading States

Frontend shows loading indicators during API calls:

```javascript
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchData();
}, []);

if (loading) return <GlobalLoader message="Loading..."/>;

// In fetchData
try {
  const res = await api.get('/endpoint');
  setData(res.data);
} finally {
  setLoading(false);
}
```

## Authentication Flow Diagram

```
User -> Login Form -> POST /api/auth/login
                    -> Backend validates credentials
                    -> Backend returns token + user
                    -> Frontend stores token
                    -> Frontend redirects to dashboard

Protected Route -> Check AuthContext
                 -> If not logged in -> Redirect to login
                 -> If logged in -> Show page
                 -> API calls include token in header
```

## Booking Flow Diagram

```
Client -> Discovery Page -> GET /api/providers
                         -> Display providers

Client -> Select Provider -> GET /api/services/:providerId
                         -> Display services

Client -> Select Service -> GET /api/slots?providerId=&date=&duration=
                         -> Calculate available slots
                         -> Display time slots

Client -> Select Slot -> POST /api/appointments
                      -> Create appointment
                      -> Return success

Client -> View Dashboard -> GET /api/appointments/my-bookings
                         -> Display appointments
```

## Running the Full Application

1. **Start Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Start Frontend**:
   ```bash
   cd front-end
   npm install
   npm run dev
   ```

3. **Access Application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5002/api`

## Environment Configuration

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/booking
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_REGISTRATION_KEY=admin-secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5002/api
```

## Key Files for Integration

### Frontend
- `front-end/src/api/axios.js` - API configuration
- `front-end/src/context/AuthContext.jsx` - Auth state
- `front-end/src/components/ProtectedRoutes.jsx` - Route protection

### Backend
- `backend/src/middlewares/authMiddleware.js` - Auth logic
- `backend/src/utils/response.js` - Response formatting
- `backend/src/middlewares/errorMiddleware.js` - Error handling