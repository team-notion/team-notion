import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import BusinessDashboard from "./pages/businessDashboard";
import BusinessDashboardLayout from "./components/layout/businessDashboardLayout";

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
    path: "/business-dashboard",
    element: <BusinessDashboardLayout />,
    children: [
      {
        path: "",
        element: <BusinessDashboard />,
      },
      {
        path: "",
        element: <BusinessDashboard />,
      },
    ],
  },
]);

export default routes;
