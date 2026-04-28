import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import Navbar from "./layouts/Navbar";

// Layouts (you can create these later if not yet)
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Client
import ClientDiscovery from "./pages/client/ClientDiscovery";
import ClientDashboard from "./pages/client/ClientDashboard";
import BookingPage from "./pages/client/BookingPage";

// Provider
import SetupProviderProfile from "./pages/provider/SetupProviderProfile";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderSetup from "./pages/provider/ProviderSetup";
import ProviderServices from "./pages/provider/ProviderServices";
import ProviderBookings from "./pages/provider/ProviderBookings";
import EditProviderProfile from "./pages/provider/EditProviderProfile";
import AvailabilityManager from "./pages/provider/AvailabilityManager";
import ManageReviews from "./features/provider/components/ManageReview";

// Admin
import DashboardAdmin from "./pages/admin/DashboardAdmin";

// Shared
import Settings from "./pages/Settings";
import ServerWarmer from "./components/layout/ServerWarmer";



function App() {
  return (
    <Router>
      <AuthProvider>
        <ServerWarmer/>

        <Routes>

          {/* PUBLIC  */}
          <Route
            path="/" element={
              <PublicLayout>
                <Landing />
              </PublicLayout>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/*  CLIENT  */}
          <Route
            path="/client"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <AppLayout />
              </ProtectedRoute>
            }>
            <Route index element={<ClientDiscovery />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="booking/:providerId" element={<BookingPage />} />
          </Route>


          {/*  PROVIDER  */}
          <Route
            path="/provider"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <AppLayout>
                  <Navbar />
                  <ProviderDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<ProviderDashboard />} />
            <Route path="setup" element={<ProviderSetup />} />
            <Route path="profile" element={<EditProviderProfile />} />
            <Route path="services" element={<ProviderServices />} />
            <Route path="availability" element={<AvailabilityManager />} />
            <Route path="bookings" element={<ProviderBookings />} />
            <Route path="reviews" element={<ManageReviews />} />
            <Route path="setup-profile" element={<SetupProviderProfile />} />

          </Route>


          {/*  ADMIN  */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout />
              </ProtectedRoute>
            }>

            <Route index element={<DashboardAdmin />} />
          </Route>

          {/*  FALLBACK  */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

      </AuthProvider>
    </Router>
  );
}


export default App;