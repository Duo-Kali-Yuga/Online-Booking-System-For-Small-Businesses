# Frontend-Backend Testing Checklist

This document provides a comprehensive checklist to verify all frontend-backend connections are working correctly.

## Authentication Flow ✅

- [ ] **Register**: User can register with email, password, and role
  - Frontend: `front-end/src/pages/Register.jsx`
  - Backend: `POST /api/auth/register`
  - Expected: User created, can login

- [ ] **Login**: User can login with credentials
  - Frontend: `front-end/src/pages/Login.jsx`
  - Backend: `POST /api/auth/login`
  - Expected: JWT token returned, stored in localStorage

- [ ] **Auth Restore**: User session persists on page refresh
  - Frontend: `front-end/src/context/AuthContext.jsx`
  - Backend: `GET /api/auth/me`
  - Expected: User data loaded from token

## Client Features ✅

### Discovery & Booking
- [ ] **Browse Providers**: Client can see list of providers
  - Frontend: `front-end/src/pages/client/ClientDiscovery.jsx`
  - Backend: `GET /api/providers`
  - Expected: Provider list displayed with filters

- [ ] **Search Providers**: Client can filter by industry/city/search
  - Frontend: `front-end/src/features/client/components/ProviderSearchForm.jsx`
  - Backend: `GET /api/providers?search=...&industry=...&city=...`
  - Expected: Filtered results returned

- [ ] **View Provider Details**: Client can see provider profile
  - Frontend: `front-end/src/pages/client/BookingPage.jsx`
  - Backend: `GET /api/providers/:id`
  - Expected: Provider details with services and reviews

- [ ] **Get Available Slots**: Client can see available appointment times
  - Frontend: `front-end/src/pages/client/BookingPage.jsx`
  - Backend: `GET /api/slots?providerId=...&date=...&duration=...`
  - Expected: Array of available time slots

- [ ] **Book Appointment**: Client can book an appointment
  - Frontend: `front-end/src/pages/client/BookingPage.jsx`
  - Backend: `POST /api/appointments`
  - Expected: Appointment created, confirmation shown

### Appointment Management
- [ ] **View My Appointments**: Client can see their bookings
  - Frontend: `front-end/src/pages/client/ClientDashboard.jsx`
  - Backend: `GET /api/appointments/my-bookings`
  - Expected: List of client's appointments

- [ ] **Cancel Appointment**: Client can cancel upcoming appointment
  - Frontend: `front-end/src/pages/client/ClientDashboard.jsx`
  - Backend: `PATCH /api/appointments/:id/cancel`
  - Expected: Appointment status changed to cancelled

- [ ] **Reschedule Appointment**: Client can reschedule appointment
  - Frontend: `front-end/src/pages/client/BookingPage.jsx` (with `?reschedule=:id`)
  - Backend: `POST /api/appointments` (with `rescheduleId`)
  - Expected: New appointment created, old one cancelled

### Reviews
- [ ] **Submit Review**: Client can review completed appointment
  - Frontend: `front-end/src/components/ReviewModel.jsx`
  - Backend: `POST /api/reviews`
  - Expected: Review created, provider rating updated

- [ ] **View Reviews**: Client can see provider reviews
  - Frontend: `front-end/src/components/ReviewList.jsx`
  - Backend: `GET /api/reviews/:providerId`
  - Expected: List of reviews displayed

### Profile
- [ ] **Update Profile**: Client can update name and avatar
  - Frontend: `front-end/src/pages/Settings.jsx`
  - Backend: `PATCH /api/users/me`
  - Expected: User profile updated

## Provider Features ✅

### Setup & Profile
- [ ] **Create Provider Profile**: Provider can set up business profile
  - Frontend: `front-end/src/pages/provider/SetupProviderProfile.jsx`
  - Backend: `POST /api/providers`
  - Expected: Provider profile created

- [ ] **Edit Provider Profile**: Provider can update business info
  - Frontend: `front-end/src/pages/provider/EditProviderProfile.jsx`
  - Backend: `PATCH /api/providers/profile`
  - Expected: Provider profile updated

### Services
- [ ] **Add Service**: Provider can add services
  - Frontend: `front-end/src/pages/provider/ProviderServices.jsx`
  - Backend: `POST /api/services`
  - Expected: Service created

- [ ] **View Services**: Provider can see their services
  - Frontend: `front-end/src/pages/provider/ProviderServices.jsx`
  - Backend: `GET /api/services/me`
  - Expected: List of provider's services

- [ ] **Delete Service**: Provider can remove service
  - Frontend: `front-end/src/pages/provider/ProviderServices.jsx`
  - Backend: `DELETE /api/services/:id`
  - Expected: Service deleted

### Availability
- [ ] **Set Availability**: Provider can set working hours
  - Frontend: `front-end/src/pages/provider/AvailabilityManager.jsx`
  - Backend: `POST /api/availability`
  - Expected: Availability saved

- [ ] **View Availability**: Provider can see their schedule
  - Frontend: `front-end/src/pages/provider/AvailabilityManager.jsx`
  - Backend: `GET /api/availability/me`
  - Expected: List of availability for each day

- [ ] **Delete Availability**: Provider can remove day's availability
  - Frontend: `front-end/src/pages/provider/AvailabilityManager.jsx`
  - Backend: `DELETE /api/availability/:dayOfWeek`
  - Expected: Availability deleted

### Bookings
- [ ] **View Bookings**: Provider can see client appointments
  - Frontend: `front-end/src/pages/provider/ProviderBookings.jsx`
  - Backend: `GET /api/appointments/provider-bookings`
  - Expected: List of provider's appointments

- [ ] **Accept Booking**: Provider can confirm pending appointment
  - Frontend: `front-end/src/features/provider/dashboard/AppointmentCard.jsx`
  - Backend: `PATCH /api/appointments/:id/status`
  - Expected: Appointment status changed to confirmed

- [ ] **Cancel Booking**: Provider can cancel appointment
  - Frontend: `front-end/src/pages/provider/ProviderBookings.jsx`
  - Backend: `PATCH /api/appointments/:id/cancel`
  - Expected: Appointment cancelled

### Dashboard
- [ ] **View Dashboard**: Provider can see stats
  - Frontend: `front-end/src/pages/provider/ProviderDashboard.jsx`
  - Backend: `GET /api/dashboard/dashboard`
  - Expected: Dashboard stats displayed

### Reviews
- [ ] **View Reviews**: Provider can see client reviews
  - Frontend: `front-end/src/features/provider/components/ManageReview.jsx`
  - Backend: `GET /api/reviews/me/my-reviews`
  - Expected: List of reviews for provider

- [ ] **Respond to Review**: Provider can reply to review
  - Frontend: `front-end/src/features/provider/components/ManageReview.jsx`
  - Backend: `PATCH /api/reviews/:reviewId/respond`
  - Expected: Response saved

## Admin Features ✅

- [ ] **View Stats**: Admin can see system statistics
  - Frontend: `front-end/src/pages/admin/DashboardAdmin.jsx`
  - Backend: `GET /api/admin/stats`
  - Expected: User, provider, appointment counts

- [ ] **Manage Users**: Admin can view and delete users
  - Frontend: `front-end/src/pages/admin/DashboardAdmin.jsx`
  - Backend: `GET /api/admin/users`, `DELETE /api/admin/users/:id`
  - Expected: User list, deletion works

- [ ] **Manage Providers**: Admin can view and toggle providers
  - Frontend: `front-end/src/pages/admin/DashboardAdmin.jsx`
  - Backend: `GET /api/admin/providers`, `PATCH /api/admin/providers/:id/toggle`
  - Expected: Provider list, toggle works

- [ ] **Manage Appointments**: Admin can view and delete appointments
  - Frontend: `front-end/src/pages/admin/DashboardAdmin.jsx`
  - Backend: `GET /api/admin/appointments`, `DELETE /api/admin/appointments/:id`
  - Expected: Appointment list, deletion works

## Issues Fixed ✅

1. ✅ **Reschedule Service Import**: Fixed import in appointmentController.js
2. ✅ **Provider Reschedule Navigation**: Added appointment ID to reschedule URL
3. ✅ **Dashboard Routes**: Added dashboard routes to app.js
4. ✅ **CORS Configuration**: Fixed allowed origins
5. ✅ **Dashboard Controller Imports**: Added missing clientService import
6. ✅ **Provider Bookings Cancel**: Fixed API endpoint path
7. ✅ **EditProviderProfile Industry**: Fixed INDUSTRIES variable reference

## How to Test

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd front-end && npm run dev`
3. Go through each feature in the checklist
4. Verify API calls in browser DevTools Network tab
5. Check backend console for any errors

## Common Issues & Solutions

### 404 Errors
- Check if route is mounted in `backend/src/app.js`
- Verify endpoint path matches frontend API call
- Check if middleware is applied correctly

### CORS Errors
- Verify frontend URL is in `allowedOrigins` in app.js
- Check if credentials are being sent correctly
- Verify Authorization header is being set

### Authentication Errors
- Check if token is stored in localStorage
- Verify JWT_SECRET is set in .env
- Check if protect middleware is applied to route

### Data Not Updating
- Verify API response is being used to update state
- Check if component is re-rendering after state change
- Verify backend is actually saving data to database
