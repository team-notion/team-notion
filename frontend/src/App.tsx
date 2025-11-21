import { RouterProvider } from "react-router";
import { Toaster, toast } from 'sonner';
import routes from "./routes";
import { AuthProvider } from "./components/lib/authContext";
import { NotificationProvider } from "./components/lib/notificationContext";

const App = () => {
  return (
    <>
      <AuthProvider>
        <NotificationProvider>
          <RouterProvider router={routes} />
          <Toaster richColors position="top-right" />
        </NotificationProvider>
      </AuthProvider>
    </>
  );
};

export default App;
