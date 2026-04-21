import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Landing from "./pages/Landing";
import Register from "./pages/Register";

import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderServices from "./pages/provider/ProviderServices";
import ProviderBookings from "./pages/provider/ProviderBookings";
import ProviderAvailability from "./pages/provider/ProviderAvailability";
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProviders from "./pages/admin/AdminProviders";
import AdminAppointments from "./pages/admin/AdminAppointments";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<Home />} />

        <Route path="/provider">
          <Route index element={
            <ProtectedRoute role="provider">
              <ProviderDashboard />
            </ProtectedRoute>
          }/>
          <Route path="services" element={
            <ProtectedRoute role="provider">
              <ProviderServices />
            </ProtectedRoute>
          }/>
          <Route path="bookings" element={
            <ProtectedRoute role="provider">
              <ProviderBookings />
            </ProtectedRoute>
          }/>
          <Route path="availability" element={
            <ProtectedRoute role="provider">
              <ProviderAvailability />
            </ProtectedRoute>
          }/>
        </Route>

        <Route path="/admin">
          <Route index element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }/>
          <Route path="users" element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }/>
          <Route path="providers" element={
            <ProtectedRoute role="admin">
              <AdminProviders />
            </ProtectedRoute>
          }/>
          <Route path="appointments" element={
            <ProtectedRoute role="admin">
              <AdminAppointments />
            </ProtectedRoute>
          }/>
          <Route
            path="dashboard"
            element={
              <ProtectedRoute role="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
        
        <Route path="/booking/:providerId" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



