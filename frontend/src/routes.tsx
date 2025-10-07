import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import BusinessDashboard from "./pages/businessDashboard";
import BusinessDashboardLayout from "./components/layout/businessDashboardLayout";
import LandingPage from "./pages/LandingPage";
import CarInventory from "./pages/carInventory";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/business-signup",
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
    ],
  },
]);

export default routes;
