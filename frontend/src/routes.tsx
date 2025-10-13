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

const routes = createBrowserRouter([
  {
    path: "/",
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
      path: "/landing",
      element: <LandingPage />
  },
  {
    path: "/reservation",
    element: <ReservationPage />
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
    ],
  },
]);

export default routes;
