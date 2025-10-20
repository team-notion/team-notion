import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import BusinessDashboard from "./pages/businessDashboard";
import BusinessDashboardLayout from "./components/layout/businessDashboardLayout";
import LandingPage from "./pages/LandingPage";
import CarInventory from "./pages/carInventory";
import ReservationManagement from "./pages/reservationManagement";
import ReservationPage from "./pages/reservation";
import ProfileManagement from "./pages/profileManagement";
import VehiclePage from "./pages/vehiclePage";
import BusinessProfile from "./pages/businessProfile";
import ForgotPassword from "./pages/forgotPassword";

const routes = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/reset-password",
    element: <ForgotPassword />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
      path: "/",
      element: <LandingPage />
  },
  {
    path: "/reservation/:carId",
    element: <ReservationPage />
  },
  {
    path: "/vehicle-catalogue",
    element: <VehiclePage />
  },
  {
    path: "/profile",
    element: <ProfileManagement />
  },
  {
    path: "/",
    element: <BusinessDashboardLayout />,
    children: [
      {
        path: "business-dashboard",
        element: <BusinessDashboard />,
      },
      {
        path: "car-inventory",
        element: <CarInventory />,
      },
      {
        path: "reservation-management",
        element: <ReservationManagement />,
      },
      {
        path: "settings",
        element: <BusinessProfile />,
      },
    ],
  },
]);

export default routes;
