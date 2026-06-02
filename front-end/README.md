# Frontend README

This is a React + Vite application for a booking system. It uses Tailwind CSS for styling and Framer Motion for animations.

## Project Structure

```
front-end/src/
├── api/              # API configuration and services
├── components/       # Reusable UI components
├── context/          # React Context providers (Auth)
├── features/         # Feature-based code organization
├── layouts/          # Page layouts (Navbar, PublicLayout, etc.)
├── pages/            # Page components (routes)
└── utils/            # Utility functions
```

## Key Concepts

### Pages and Routes

Each page in the app is located in `src/pages/` and corresponds to a route defined in `App.jsx`.

#### Public Pages
- `Landing.jsx` - Landing page for the booking platform
- `Login.jsx` - User login page
- `Register.jsx` - User registration page

#### Client Pages
- `client/ClientDiscovery.jsx` - Browse and search for providers
- `client/ClientDashboard.jsx` - View and manage your appointments
- `client/BookingPage.jsx` - Book an appointment with a provider

#### Provider Pages
- `provider/ProviderDashboard.jsx` - Provider's main dashboard
- `provider/ProviderServices.jsx` - Manage services offered
- `provider/ProviderBookings.jsx` - View and manage appointments
- `provider/AvailabilityManager.jsx` - Set working hours and availability
- `provider/SetupProviderProfile.jsx` - Initial provider profile setup

#### Admin Pages
- `admin/DashboardAdmin.jsx` - System administration dashboard

#### Shared Pages
- `Settings.jsx` - User profile settings

## Code Organization

### Features

The `features/` folder organizes code by feature rather than by type (MVC-style). Each feature folder contains:
- `components/` - Components specific to that feature
- `hooks/` - Custom React hooks
- `services/` - API service functions

Features:
- `auth/` - Authentication functionality
- `client/` - Client-side features (booking, discovery)
- `provider/` - Provider-side features (dashboard, services)
- `marketing/` - Marketing-related components

### Layouts

Layouts wrap pages and provide consistent UI structure:
- `AppLayout.jsx` - Main layout with Navbar for authenticated users
- `PublicLayout.jsx` - Layout for public pages (login, register)
- `ProviderLayout.jsx` - Sidebar layout for provider dashboard

### Components

- `ProtectedRoutes.jsx` - Route wrapper that checks authentication
- `ReviewList.jsx` - Displays provider reviews
- `ReviewModel.jsx` - Modal for submitting reviews

### Context

- `AuthContext.jsx` - Manages user authentication state and provides login/logout functions

### API

- `axios.js` - Configured Axios instance with JWT token interceptor

## How Pages Work

1. **Route Definition**: Pages are mapped to routes in `App.jsx`
2. **Authentication**: `ProtectedRoutes.jsx` checks if user is logged in
3. **Data Fetching**: Pages use `api` from `../api/axios` to fetch data
4. **State Management**: Uses React state hooks (`useState`, `useEffect`)
5. **Styling**: Uses Tailwind CSS utility classes

## Key Functions

### Authentication Flow
1. User logs in via `Login.jsx`
2. Token stored in `localStorage`
3. `AuthContext.jsx` manages user state
4. `ProtectedRoutes.jsx` protects authenticated routes

### Booking Flow
1. Client discovers providers via `ClientDiscovery.jsx`
2. Selects provider and service via `BookingPage.jsx`
3. Chooses date and available slot
4. Appointment created via API call
5. Confirmation shown

### Provider Flow
1. Provider sets up profile via `SetupProviderProfile.jsx`
2. Sets availability via `AvailabilityManager.jsx`
3. Adds services via `ProviderServices.jsx`
4. Views appointments on dashboard
5. Manages bookings and reviews

## Running the App

```bash
cd front-end
npm install
npm run dev
```

The app will run on `http://localhost:5173` (default Vite port).