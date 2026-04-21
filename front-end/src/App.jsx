import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Landing from "./pages/Landing";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<Home />} />

        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/provider/services" element={<ProviderServices />} />
        <Route path="/provider/bookings" element={<ProviderBookings />} />
        <Route path="/provider/availability" element={<ProviderAvailability />} />
        

        <Route path="/booking/:providerId" element={<Booking />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



