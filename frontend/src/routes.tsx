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
import Bookings from "./pages/bookings";
import EmailVerification from "./components/auth/emailVerification";
import RequestVerificationEmail from "./components/auth/requestVerificationEmail";
import UserResetPassword from "./components/auth/userResetPassword";
import { Notifications } from "./pages/notifications";
import BusinessNotifications from "./pages/businessNotifications";
import PaymentVerification from "./pages/paymentsVerification";
import CancelReservation from "./pages/cancelReservation";

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
    path: "/verify-email/:uid/:token",
    element: <EmailVerification />,
  },
  {
    path: "/request-verification-email",
    element: <RequestVerificationEmail />,
  },
  {
    path: "/password-reset",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:uid/:token",
    element: <UserResetPassword />,
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
    path: "/bookings",
    element: <Bookings />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: '/payments/verify',
    element: <PaymentVerification />,
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
        path: "reservation-management/reservations/confirm-cancel/:token",
        element: <CancelReservation />,
      },
      {
        path: "settings",
        element: <BusinessProfile />,
      },
      {
        path: "business-notifications",
        element: <BusinessNotifications />,
      },
    ],
  },
]);

export default routes;
