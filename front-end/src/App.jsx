import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoutes';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import SetupProviderProfile from './pages/provider/SetupProviderProfile';
import ClientDiscovery from './pages/client/ClientDiscovery';
import ClientDashboard from './pages/client/ClientDashboard';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProviderSetup from './pages/provider/ProviderSetup';
import BookingPage from './pages/client/BookingPage';
import ProviderServices from './pages/provider/ProviderServices';
import AvailabilityManager from './pages/provider/components/AvailabilityManager';
import ProviderBookings from './pages/provider/ProviderBookings';
import EditProviderProfile from './pages/provider/EditProviderProfile';





function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- Client Routes --- */}
          <Route path="/app" element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientDiscovery />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/booking/:providerId" element={<BookingPage />} />

          {/* --- Provider Routes --- */}
          <Route path="/book/:providerId" element={<BookingPage />} />
          <Route path="/setup-profile" element={
            <ProtectedRoute allowedRoles={['provider']}>
              <SetupProviderProfile />
            </ProtectedRoute>
          } />
          <Route path="/provider" element={
            <ProtectedRoute allowedRoles={['provider']}>
              <ProviderDashboard />
            </ProtectedRoute>
          } />
          <Route path="/provider/setup" element={<ProviderSetup />} />
          <Route path="/provider/profile" element={<EditProviderProfile />} />

          <Route path="/provider/availability" element={<AvailabilityManager />} /> {/* /provider/availability */}
          <Route path="/provider/bookings" element={<ProviderBookings />} /> {/* /provider/bookings */}

          <Route path="/provider/services" element={<ProviderServices />} />

          {/* --- Admin Routes --- */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* --- Catch All --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;